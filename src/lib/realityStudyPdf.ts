import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import { APERTURE_LOGO_WHITE_HORIZONTAL_B64 } from "./onboarding/logo";
import { questions } from "./realityCheck";
import { sourceLabel, studyFields } from "./realityStudy";
import { MIN_N_TO_READ, MIN_SECONDS, type StudyStats } from "./realityStudyStats";
import { MIN_N_FOR_SHARE, fmtP, type ProportionTest } from "./stats";
import {
  VERDICT_LABEL, STATS_CAVEAT, correlationSentence, groupSentence, moeSentence,
  overconfidenceSentence, proportionSentence,
} from "./realityStudyReadout";

/**
 * A share, or a plain count while there are too few answers for a share to mean
 * anything. Same threshold as the dashboard (MIN_N_FOR_SHARE).
 */
function share(t: { n: number; pct: number }): string {
  return t.n < MIN_N_FOR_SHARE
    ? `${Math.round((t.pct / 100) * t.n)} of ${t.n}`
    : `${Math.round(t.pct)}% (n = ${t.n})`;
}

/**
 * The Clarity Check research study as a clean, branded PDF report.
 * Built from the same numbers as /method-lab/study (src/lib/realityStudyStats.ts),
 * so the PDF and the dashboard can never disagree.
 *
 * @illustrative-figures — dollar amounts here are the H2 survey threshold and
 * the H1 revenue range, not our fees. Fees live only in src/lib/pricing.ts.
 *
 * Brand treatment copied from src/lib/realityCheckPdf.ts (maroon band, white
 * logo, gold label, Helvetica) so the two documents look like one firm.
 */

export const MAROON = rgb(0x50 / 255, 0, 0);
export const INK = rgb(0.1, 0.1, 0.1);
export const MUTED = rgb(0.42, 0.42, 0.42);
const LINE = rgb(0.86, 0.86, 0.86);
const SURFACE = rgb(0.96, 0.955, 0.955);
const GOLD = rgb(0xc9 / 255, 0xa2 / 255, 0x4b / 255);
const WHITE = rgb(1, 1, 1);
type Color = ReturnType<typeof rgb>;

const PAGE_W = 612;
const PAGE_H = 792;
export const M = 56;
export const CW = PAGE_W - M * 2;
const BOTTOM = 72;

const MAP: Record<string, string> = {
  "−": "-", "≈": "~", "→": "->", "–": "-", "—": "-", "‘": "'", "’": "'", "“": '"', "”": '"',
  "…": "...", "×": "x", " ": " ",
};
export function san(s: string): string {
  return Array.from(s ?? "")
    .map((ch) => MAP[ch] ?? ((ch.codePointAt(0) ?? 0) <= 255 || ch === "™" ? ch : ""))
    .join("");
}
export const r0 = (x: number | null | undefined) => (x === null || x === undefined ? "-" : String(Math.round(x)));
export const r1 = (x: number | null | undefined) => (x === null || x === undefined ? "-" : x.toFixed(1));

export class Report {
  doc!: PDFDocument;
  page!: PDFPage;
  y = 0;
  reg!: PDFFont;
  bold!: PDFFont;
  logo!: PDFImage;
  subtitle = "";
  title = "Clarity Check Research Study";

  async init(subtitle: string, asOf: string, nLabel: string, title = "Clarity Check Research Study") {
    this.title = title;
    this.doc = await PDFDocument.create();
    this.reg = await this.doc.embedFont(StandardFonts.Helvetica);
    this.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.logo = await this.doc.embedPng(Buffer.from(APERTURE_LOGO_WHITE_HORIZONTAL_B64, "base64"));
    this.subtitle = san(subtitle);
    this.doc.setTitle(`${this.title}: Results`);
    this.doc.setAuthor("Fenwick How, The Aperture Method");
    this.doc.setSubject(this.title === "Clarity Check Research Study" ? "EMBA capstone research results" : `${this.title} results`);

    this.page = this.doc.addPage([PAGE_W, PAGE_H]);
    const BAND = 132;
    this.page.drawRectangle({ x: 0, y: PAGE_H - BAND, width: PAGE_W, height: BAND, color: MAROON });
    const lw = 200;
    const lh = lw * (this.logo.height / this.logo.width);
    this.page.drawImage(this.logo, { x: M, y: PAGE_H - 32 - lh, width: lw, height: lh });
    this.page.drawText(san(this.title), { x: M, y: PAGE_H - 92, size: 21, font: this.bold, color: WHITE });
    this.page.drawText(this.subtitle, { x: M, y: PAGE_H - 110, size: 10, font: this.reg, color: rgb(0.92, 0.85, 0.85) });
    this.right("AS OF", PAGE_H - 40, 7, this.bold, GOLD);
    this.right(san(asOf), PAGE_H - 56, 11, this.bold, WHITE);
    this.right(san(nLabel), PAGE_H - 71, 8.5, this.reg, rgb(0.92, 0.85, 0.85));
    this.y = PAGE_H - BAND - 30;
  }

  right(t: string, y: number, size: number, font: PDFFont, color: Color, rx = PAGE_W - M) {
    this.page.drawText(t, { x: rx - font.widthOfTextAtSize(t, size), y, size, font, color });
  }

  newPage() {
    this.page = this.doc.addPage([PAGE_W, PAGE_H]);
    this.page.drawRectangle({ x: M, y: PAGE_H - 50, width: 3, height: 11, color: MAROON });
    this.page.drawText(san(`${this.title}: Results`), { x: M + 10, y: PAGE_H - 47, size: 8, font: this.reg, color: MUTED });
    this.right(this.subtitle, PAGE_H - 47, 8, this.reg, MUTED);
    this.page.drawLine({ start: { x: M, y: PAGE_H - 58 }, end: { x: PAGE_W - M, y: PAGE_H - 58 }, thickness: 0.5, color: LINE });
    this.y = PAGE_H - 82;
  }

  ensure(h: number) {
    if (this.y - h < BOTTOM) this.newPage();
  }

  wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
    const out: string[] = [];
    for (const raw of san(text).split("\n")) {
      let line = "";
      for (const w of raw.split(/\s+/)) {
        const t = line ? line + " " + w : w;
        if (font.widthOfTextAtSize(t, size) > maxW && line) {
          out.push(line);
          line = w;
        } else line = t;
      }
      out.push(line);
    }
    return out;
  }

  para(text: string, o: { font?: PDFFont; size?: number; color?: Color; x?: number; maxW?: number; after?: number } = {}) {
    const font = o.font ?? this.reg;
    const size = o.size ?? 10;
    const x = o.x ?? M;
    const gap = size * 1.45;
    for (const ln of this.wrap(text, font, size, o.maxW ?? CW - (x - M))) {
      this.ensure(gap);
      this.page.drawText(ln, { x, y: this.y, size, font, color: o.color ?? INK });
      this.y -= gap;
    }
    this.y -= o.after ?? 0;
  }

  section(title: string, need = 120) {
    this.y -= 14;
    this.ensure(need);
    this.page.drawText(san(title.toUpperCase()), { x: M, y: this.y, size: 8, font: this.bold, color: MAROON });
    this.y -= 6;
    this.page.drawLine({ start: { x: M, y: this.y }, end: { x: PAGE_W - M, y: this.y }, thickness: 0.6, color: MAROON });
    this.y -= 18;
  }

  /** A horizontal bar row: label left, value right, bar beneath. */
  bar(label: string, value: string, pct: number, o: { x?: number; w?: number; size?: number } = {}) {
    const x = o.x ?? M;
    const w = o.w ?? CW;
    const size = o.size ?? 9;
    this.ensure(size + 14);
    const lbl = this.wrap(label, this.reg, size, w - 90)[0] ?? "";
    this.page.drawText(lbl, { x, y: this.y, size, font: this.reg, color: INK });
    this.right(san(value), this.y, size, this.reg, MUTED, x + w);
    this.y -= 6;
    this.page.drawRectangle({ x, y: this.y - 4, width: w, height: 4, color: LINE });
    this.page.drawRectangle({ x, y: this.y - 4, width: Math.max(1, (w * Math.min(100, pct)) / 100), height: 4, color: MAROON });
    this.y -= size + 6;
  }

  tiles(items: { label: string; value: string; sub: string }[]) {
    const gapX = 10;
    const tw = (CW - gapX * (items.length - 1)) / items.length;
    const th = 78;
    this.ensure(th + 10);
    items.forEach((t, i) => {
      const x = M + i * (tw + gapX);
      this.page.drawRectangle({ x, y: this.y - th, width: tw, height: th, color: SURFACE });
      this.page.drawRectangle({ x, y: this.y - th, width: 2.5, height: th, color: MAROON });
      this.page.drawText(san(t.label.toUpperCase()), { x: x + 11, y: this.y - 15, size: 6.5, font: this.bold, color: MUTED });
      this.page.drawText(san(t.value), { x: x + 11, y: this.y - 44, size: 24, font: this.bold, color: MAROON });
      const sub = this.wrap(t.sub, this.reg, 7, tw - 20);
      sub.slice(0, 2).forEach((s, j) => this.page.drawText(s, { x: x + 11, y: this.y - 58 - j * 9, size: 7, font: this.reg, color: MUTED }));
    });
    this.y -= th + 12;
  }

  /**
   * The small sampling curve inside a hypothesis card: where the true share
   * could sit, given this many answers. Mirrors ProportionCurve on the
   * dashboard, including the rule that it is not drawn at all below
   * MIN_N_FOR_SHARE answers, where it would be a spike at 0% or 100%.
   */
  proportionCurve(t: ProportionTest, x: number, w: number, top: number, h = 54) {
    const L = x + 14, R = x + w - 14, base = top - h + 14;
    const p = Math.min(0.999, Math.max(0.001, t.pct / 100));
    const se = Math.max(0.045, Math.sqrt((p * (1 - p)) / Math.max(1, t.n)));
    const px = (v: number) => L + (v / 100) * (R - L);
    const dens = (v: number) => Math.exp(-(((v / 100 - p) / se) ** 2) / 2);
    const py = (d: number) => base + d * (h - 22);

    // The supporting tail, as a stack of thin columns (pdf-lib has no path fill).
    for (let v = t.threshold; v <= 100; v += 1) {
      const x0 = px(v), x1 = px(Math.min(100, v + 1));
      this.page.drawRectangle({ x: x0, y: base, width: Math.max(0.6, x1 - x0), height: py(dens(v)) - base, color: MAROON, opacity: 0.12 });
    }
    // The curve itself.
    let prev: { x: number; y: number } | null = null;
    for (let i = 0; i <= 100; i++) {
      const v = i;
      const pt = { x: px(v), y: py(dens(v)) };
      if (prev) this.page.drawLine({ start: prev, end: pt, thickness: 1, color: MAROON });
      prev = pt;
    }
    this.page.drawLine({ start: { x: L, y: base }, end: { x: R, y: base }, thickness: 0.5, color: LINE });
    // The falsification line, and what we measured.
    this.page.drawLine({ start: { x: px(t.threshold), y: base }, end: { x: px(t.threshold), y: base + h - 20 }, thickness: 0.8, color: INK, dashArray: [3, 2] });
    const lab = san(`line ${t.threshold}%`);
    this.page.drawText(lab, { x: px(t.threshold) - this.reg.widthOfTextAtSize(lab, 6) / 2, y: base + h - 18, size: 6, font: this.reg, color: INK });
    this.page.drawLine({ start: { x: px(t.pct), y: base }, end: { x: px(t.pct), y: py(1) }, thickness: 1.2, color: MAROON });
    // The 95% interval, as a bracket under the axis.
    if (t.ci) {
      const yb = base - 6;
      this.page.drawLine({ start: { x: px(t.ci.lo), y: yb }, end: { x: px(t.ci.hi), y: yb }, thickness: 1, color: MAROON });
      for (const e of [t.ci.lo, t.ci.hi]) {
        this.page.drawLine({ start: { x: px(e), y: yb - 3 }, end: { x: px(e), y: yb + 3 }, thickness: 1, color: MAROON });
      }
      this.page.drawText(san(`${Math.round(t.ci.lo)}%`), { x: px(t.ci.lo), y: yb - 12, size: 6, font: this.reg, color: MUTED });
      const hi = san(`${Math.round(t.ci.hi)}%`);
      this.page.drawText(hi, { x: px(t.ci.hi) - this.reg.widthOfTextAtSize(hi, 6), y: yb - 12, size: 6, font: this.reg, color: MUTED });
    }
  }

  hypothesis(code: string, claim: string, t: ProportionTest, measure: string, test: string, extra: string | null, x: number, w: number, top: number) {
    /* Oct 2026: taller than it was, to carry the sampling curve the dashboard
       added. A card with no curve (a thin sample) keeps the same height so the
       two cards still line up side by side. */
    const h = 232;
    const verdict = VERDICT_LABEL[t.verdict];
    /* Same rule as the dashboard: no share under MIN_N_FOR_SHARE answers. */
    const thin = t.n < MIN_N_FOR_SHARE;
    const value = thin ? `${t.n}` : `${Math.round(t.pct)}%`;
    this.page.drawRectangle({ x, y: top - h, width: w, height: h, borderColor: LINE, borderWidth: 0.6, color: WHITE });
    this.page.drawRectangle({ x, y: top - h, width: 3, height: h, color: MAROON });
    this.page.drawText(code, { x: x + 14, y: top - 20, size: 13, font: this.bold, color: MAROON });
    const vw = this.bold.widthOfTextAtSize(san(verdict), 7.5) + 14;
    const dark = t.verdict === "supported" || t.verdict === "against";
    this.page.drawRectangle({ x: x + w - vw - 12, y: top - 24, width: vw, height: 14, color: t.verdict === "supported" ? MAROON : t.verdict === "against" ? INK : LINE });
    this.page.drawText(san(verdict), { x: x + w - vw - 5, y: top - 19.5, size: 7.5, font: this.bold, color: dark ? WHITE : INK });
    let yy = top - 38;
    for (const ln of this.wrap(claim, this.bold, 8.5, w - 28)) {
      this.page.drawText(ln, { x: x + 14, y: yy, size: 8.5, font: this.bold, color: INK });
      yy -= 11;
    }
    this.page.drawText(san(value), { x: x + 14, y: yy - 20, size: 22, font: this.bold, color: INK });
    const side = thin
      ? san(`${t.n === 1 ? "answer" : "answers"} so far  ·  too few to report a share (from ${MIN_N_FOR_SHARE})`)
      : t.ci
        ? san(`95% CI ${Math.round(t.ci.lo)}-${Math.round(t.ci.hi)}%  ·  ${fmtP(t.verdict === "against" ? t.pBelow : t.pAbove)}`)
        : null;
    if (side) {
      this.page.drawText(side, { x: x + 14 + this.bold.widthOfTextAtSize(value, 22) + 10, y: yy - 18, size: 8, font: this.bold, color: MAROON });
    }
    yy -= 32;
    for (const ln of this.wrap(measure, this.reg, 7.5, w - 28)) {
      this.page.drawText(ln, { x: x + 14, y: yy, size: 7.5, font: this.reg, color: MUTED });
      yy -= 9.5;
    }
    if (extra) {
      yy -= 2;
      for (const ln of this.wrap(extra, this.reg, 7.5, w - 28)) {
        this.page.drawText(ln, { x: x + 14, y: yy, size: 7.5, font: this.reg, color: INK });
        yy -= 9.5;
      }
    }
    const tl = this.wrap(test, this.reg, 7, w - 28);
    const testTop = top - h + 10 + (tl.length - 1) * 8.5;
    tl.forEach((ln, i) => {
      this.page.drawText(ln, { x: x + 14, y: top - h + 10 + (tl.length - 1 - i) * 8.5, size: 7, font: this.reg, color: MUTED });
    });

    if (!thin) {
      const capY = testTop + 16;
      const cap = "Normal approximation, for the shape; the p-value is the exact binomial.";
      this.page.drawText(san(cap), { x: x + 14, y: capY, size: 6, font: this.reg, color: MUTED });
      this.proportionCurve(t, x, w, capY + 62, 54);
    }
    return h;
  }

  scatter(points: { self: number; score: number }[]) {
    const H = 210;
    this.ensure(H + 30);
    const L = M + 34, R = PAGE_W - M - 6, T = this.y - 4, B = this.y - H + 22;
    const x = (v: number) => L + (v / 100) * (R - L);
    const y = (v: number) => B + (v / 100) * (T - B);
    for (const v of [0, 25, 50, 75, 100]) {
      this.page.drawLine({ start: { x: L, y: y(v) }, end: { x: R, y: y(v) }, thickness: 0.4, color: LINE });
      this.right(String(v), y(v) - 3, 7, this.reg, MUTED, L - 6);
    }
    for (let v = 1; v <= 10; v++) {
      const t = String(v);
      this.page.drawText(t, { x: x(v * 10) - this.reg.widthOfTextAtSize(t, 7) / 2, y: B - 12, size: 7, font: this.reg, color: MUTED });
    }
    this.page.drawLine({ start: { x: x(0), y: y(0) }, end: { x: x(100), y: y(100) }, thickness: 0.8, color: MUTED, dashArray: [3, 3] });
    this.right("score matches self-rating", y(100) - 12, 7, this.reg, MUTED, x(96));
    points.forEach((p, i) => {
      const jx = ((i * 7919) % 11) - 5, jy = (((i + 3) * 7919) % 11) - 5;
      this.page.drawCircle({ x: x(p.self * 10) + jx * 0.6, y: y(p.score) + jy * 0.4, size: 3.4, color: MAROON, opacity: 0.55 });
    });
    const xl = "Self-rating before the quiz (1 to 10)";
    this.page.drawText(xl, { x: (L + R) / 2 - this.reg.widthOfTextAtSize(xl, 7.5) / 2, y: B - 25, size: 7.5, font: this.reg, color: MUTED });
    this.page.drawText("Clarity Score", { x: M + 2, y: (T + B) / 2 - 25, size: 7.5, font: this.reg, color: MUTED, rotate: { type: "degrees" as never, angle: 90 } as never });
    this.y = B - 40;
  }

  /**
   * A histogram with a normal curve of the same mean and standard deviation
   * over it, the mean and +/-1 SD marked, and the 95% confidence interval of
   * the mean shaded behind. The paper twin of DistributionChart on the
   * dashboard, so the report and the screen cannot disagree.
   *
   * The curve is a comparison, not a claim: it is the shape the t-test assumes.
   * The caption on the page says so.
   */
  distribution(o: {
    values: number[];
    min: number;
    max: number;
    binWidth: number;
    mean: number | null;
    sd: number | null;
    ci: { lo: number; hi: number } | null;
    zeroLine?: boolean;
    xLabel: string;
  }) {
    const H = 170;
    this.ensure(H + 26);
    const L = M + 10, R = PAGE_W - M - 10;
    const top = this.y - 4;
    const base = top - H + 30;
    const px = (v: number) => L + ((v - o.min) / (o.max - o.min)) * (R - L);

    const bins: { lo: number; hi: number; n: number }[] = [];
    for (let lo = o.min; lo < o.max; lo += o.binWidth) {
      const hi = lo + o.binWidth;
      const last = hi >= o.max;
      bins.push({ lo, hi, n: o.values.filter((v) => v >= lo && (last ? v <= hi : v < hi)).length });
    }
    const dens = (v: number) =>
      o.mean === null || !o.sd ? 0 : Math.exp(-((v - o.mean) ** 2) / (2 * o.sd * o.sd)) / (o.sd * Math.sqrt(2 * Math.PI));
    const curvePeak = o.mean === null || !o.sd ? 0 : o.values.length * o.binWidth * dens(o.mean);
    const peak = Math.max(1, ...bins.map((b) => b.n), curvePeak) * 1.15;
    const py = (count: number) => base + (count / peak) * (H - 52);

    // 95% CI of the mean, behind everything.
    if (o.ci) {
      this.page.drawRectangle({
        x: px(o.ci.lo), y: base, width: Math.max(1, px(o.ci.hi) - px(o.ci.lo)), height: H - 44,
        color: MAROON, opacity: 0.07,
      });
    }

    // Bars, with the count above each one that has any.
    for (const b of bins) {
      const bx = px(b.lo) + 1.5;
      const bw = Math.max(1, px(b.hi) - px(b.lo) - 3);
      if (b.n) {
        this.page.drawRectangle({ x: bx, y: base, width: bw, height: py(b.n) - base, color: MAROON, opacity: 0.55 });
        const t = String(b.n);
        this.page.drawText(t, { x: bx + bw / 2 - this.reg.widthOfTextAtSize(t, 6.5) / 2, y: py(b.n) + 3, size: 6.5, font: this.reg, color: MUTED });
      }
    }

    // The fitted curve.
    if (o.mean !== null && o.sd) {
      let prev: { x: number; y: number } | null = null;
      for (let i = 0; i <= 120; i++) {
        const v = o.min + ((o.max - o.min) * i) / 120;
        const pt = { x: px(v), y: py(o.values.length * o.binWidth * dens(v)) };
        if (prev) this.page.drawLine({ start: prev, end: pt, thickness: 1.1, color: INK, opacity: 0.75 });
        prev = pt;
      }
    }

    // Reference lines.
    if (o.zeroLine) {
      this.page.drawLine({ start: { x: px(0), y: base }, end: { x: px(0), y: base + H - 44 }, thickness: 0.8, color: MUTED, dashArray: [3, 3] });
      const t = "no gap";
      this.page.drawText(t, { x: px(0) - this.reg.widthOfTextAtSize(t, 6.5) / 2, y: base + H - 42, size: 6.5, font: this.reg, color: MUTED });
    }
    if (o.mean !== null) {
      this.page.drawLine({ start: { x: px(o.mean), y: base }, end: { x: px(o.mean), y: base + H - 50 }, thickness: 1.2, color: MAROON });
      const t = san(`mean ${Math.round(o.mean)}`);
      this.page.drawText(t, { x: px(o.mean) - this.bold.widthOfTextAtSize(t, 6.5) / 2, y: base + H - 48, size: 6.5, font: this.bold, color: MAROON });
      if (o.sd) {
        for (const k of [-1, 1]) {
          const v = o.mean + k * o.sd;
          if (v < o.min || v > o.max) continue;
          this.page.drawLine({ start: { x: px(v), y: base }, end: { x: px(v), y: base + H - 58 }, thickness: 0.6, color: MAROON, opacity: 0.5, dashArray: [2, 2] });
          const lab = `${k > 0 ? "+" : "-"}1 SD`;
          this.page.drawText(lab, { x: px(v) - this.reg.widthOfTextAtSize(lab, 6) / 2, y: base + H - 56, size: 6, font: this.reg, color: MUTED });
        }
      }
    }

    // Axis and ticks.
    this.page.drawLine({ start: { x: L, y: base }, end: { x: R, y: base }, thickness: 0.5, color: LINE });
    for (let v = o.min; v <= o.max; v += o.binWidth * 2) {
      const t = String(Math.round(v));
      this.page.drawText(t, { x: px(v) - this.reg.widthOfTextAtSize(t, 6.5) / 2, y: base - 11, size: 6.5, font: this.reg, color: MUTED });
    }
    const xl = san(o.xLabel);
    this.page.drawText(xl, { x: (L + R) / 2 - this.reg.widthOfTextAtSize(xl, 7.5) / 2, y: base - 24, size: 7.5, font: this.reg, color: MUTED });
    this.y = base - 36;
  }

  /** The readings under a chart: evenly spaced, centred, with a rule above. */
  statRow(items: { k: string; v: string }[]) {
    this.ensure(34);
    this.page.drawLine({ start: { x: M, y: this.y + 6 }, end: { x: PAGE_W - M, y: this.y + 6 }, thickness: 0.5, color: LINE });
    const cw = CW / items.length;
    items.forEach((it, i) => {
      const cx = M + i * cw + cw / 2;
      const k = san(it.k.toUpperCase());
      const v = san(it.v);
      this.page.drawText(k, { x: cx - this.bold.widthOfTextAtSize(k, 6) / 2, y: this.y - 6, size: 6, font: this.bold, color: MUTED });
      this.page.drawText(v, { x: cx - this.bold.widthOfTextAtSize(v, 9) / 2, y: this.y - 19, size: 9, font: this.bold, color: INK });
    });
    this.y -= 32;
  }

  histogram(data: { label: string; n: number }[], x0: number, w: number) {
    const H = 120;
    const max = Math.max(1, ...data.map((d) => d.n));
    const top = this.y;
    const base = top - H + 16;
    const bw = (w - 4 * (data.length - 1)) / data.length;
    data.forEach((d, i) => {
      const bx = x0 + i * (bw + 4);
      const bh = ((H - 34) * d.n) / max;
      if (d.n) this.page.drawRectangle({ x: bx, y: base, width: bw, height: Math.max(1.5, bh), color: MAROON });
      if (d.n) {
        const t = String(d.n);
        this.page.drawText(t, { x: bx + bw / 2 - this.reg.widthOfTextAtSize(t, 6.5) / 2, y: base + bh + 3, size: 6.5, font: this.reg, color: MUTED });
      }
      const lab = d.label.split("–")[0] ?? "";
      this.page.drawText(lab, { x: bx + bw / 2 - this.reg.widthOfTextAtSize(lab, 6) / 2, y: base - 10, size: 6, font: this.reg, color: MUTED });
    });
    this.page.drawLine({ start: { x: x0, y: base }, end: { x: x0 + w, y: base }, thickness: 0.5, color: LINE });
    return H;
  }

  footers() {
    const pages = this.doc.getPages();
    pages.forEach((p, i) => {
      p.drawLine({ start: { x: M, y: BOTTOM - 18 }, end: { x: PAGE_W - M, y: BOTTOM - 18 }, thickness: 0.5, color: LINE });
      p.drawText("Confidential working report  ·  Anonymous, aggregate results only  ·  The Aperture Method", {
        x: M, y: BOTTOM - 32, size: 7, font: this.reg, color: MUTED,
      });
      const lbl = `Page ${i + 1} of ${pages.length}`;
      p.drawText(lbl, { x: PAGE_W - M - this.reg.widthOfTextAtSize(lbl, 7), y: BOTTOM - 32, size: 7, font: this.reg, color: MUTED });
    });
  }
}

export async function generateStudyReportPdf(
  s: StudyStats,
  filterLabel: string | null
): Promise<{ bytes: Uint8Array; filename: string }> {
  const now = new Date();
  const asOf = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "America/Chicago" });
  const d = new Report();
  await d.init(
    filterLabel ? `Segment: ${filterLabel}` : "Results report · EMBA capstone research",
    asOf,
    `${s.n} usable responses${filterLabel ? " in segment" : ""} · target ${s.target}`
  );

  const early = s.n < MIN_N_TO_READ;

  /* ── summary */
  d.section("Summary", 80);
  if (s.n === 0) {
    d.para("No usable responses yet. This report fills in automatically as owners complete the study.");
  } else {
    const parts = [
      `${s.n} owner-run businesses${filterLabel ? ` in this segment` : ""} completed the Clarity Check with a usable response (${s.cleanTotal} of ${s.target} toward the study target overall).`,
      `Their average Clarity Score was ${r0(s.meanScore)} out of 100 (median ${r0(s.medianScore)}), and on average they could not answer ${r1(s.meanGaps)} of the ${questions.length} questions with confidence.`,
    ];
    if (s.nRated) {
      parts.push(
        `Before the first question they rated their own knowledge at ${r0(s.meanSelf)} on the same 100-point scale. ${r0(s.pctOverconfident)}% rated themselves above the score they then earned, a mean gap of ${s.meanOverconfidence! > 0 ? "+" : ""}${r0(s.meanOverconfidence)} points.`
      );
    }
    const oc = overconfidenceSentence(s);
    if (oc) parts.push(oc);
    const top = s.byQuestion[0];
    if (top) parts.push(`The question owners were least able to answer was "${top.area}": ${r0(top.pct)}% could not answer it with confidence.`);
    d.para(parts.join(" "), { size: 10.5, after: 6 });
    if (early) {
      d.para(
        `Early reading: with fewer than ${MIN_N_TO_READ} responses each new answer moves these percentages noticeably. Treat them as signals, not findings.`,
        { size: 8.5, color: MAROON, after: 4 }
      );
    }
  }

  if (s.n > 0) {
    d.y -= 4;
    d.tiles([
      { label: "Avg Clarity Score", value: r0(s.meanScore), sub: `Median ${r0(s.medianScore)}${s.stats.meanScore ? ` · 95% CI ${r0(s.stats.meanScore.ci.lo)}-${r0(s.stats.meanScore.ci.hi)}` : ""}` },
      { label: "What owners think", value: r0(s.meanSelf), sub: `Self-rating x10 (n = ${s.nRated})` },
      { label: "Overconfidence gap", value: s.meanOverconfidence === null ? "-" : `${s.meanOverconfidence > 0 ? "+" : ""}${r0(s.meanOverconfidence)}`, sub: `${r0(s.pctOverconfident)}% rated above their score${s.stats.overconfidence ? ` · ${fmtP(s.stats.overconfidence.p)}` : ""}` },
      { label: "Could not answer", value: r1(s.meanGaps), sub: `Questions on average, of ${questions.length}` },
    ]);

    /* ── hypotheses */
    d.section("The hypotheses", 170);
    const top = d.y;
    const w = (CW - 12) / 2;
    d.hypothesis(
      "H1", "$1-20M owner-run firms lack access to decision-grade analysis.", s.h1,
      `of $1-20M firms get analysis from no one, only a bookkeeper or CPA, or software alone (n = ${s.h1.n})`,
      "Falsified if fewer than 40% report no access. Tested: is the true share above 40%?",
      null, M, w, top
    );
    const h = d.hypothesis(
      "H2", "Owners will pay for a fixed-fee diagnostic.", s.h2,
      `of owners and co-owners at $1M+ businesses say an outside view would help somewhat or a lot (n = ${s.h2.n})`,
      "Survey measure (need): not supported if 50% or fewer say so. Payment is tested by conversion (falsified below 1 in 8).",
      [
        s.h2Fit.n ? `Fit: ${share(s.h2Fit)} of them would choose an independent review.` : null,
        s.h2Everyone.n ? `All respondents: ${share(s.h2Everyone)}.` : null,
        s.h2Legacy.n ? `Retired price question: ${s.h2Legacy.n} answers, not used.` : null,
      ].filter(Boolean).join(" ") || null,
      M + w + 12, w, top
    );
    d.y = top - h - 8;

    /* ── how sure */
    d.section("How sure can we be?", 150);
    for (const t of [overconfidenceSentence(s), correlationSentence(s), `H1: ${proportionSentence(s.h1, "H1")}`, `H2: ${proportionSentence(s.h2, "H2")}`, moeSentence(s)]) {
      if (!t) continue;
      d.ensure(30);
      d.page.drawRectangle({ x: M, y: d.y - 2, width: 4, height: 4, color: MAROON });
      d.para(t, { size: 9, x: M + 12, after: 6 });
    }
    d.para(STATS_CAVEAT, { size: 7.5, color: MUTED });

    /* ── perceived vs measured */
    d.section("What owners think vs what they can evidence", 260);
    d.para("Each dot is one owner. Dots above the dashed line rated themselves higher than they scored.", { size: 8.5, color: MUTED, after: 6 });
    const cs = correlationSentence(s);
    if (cs) d.para(cs, { size: 8.5, after: 6 });
    if (s.scatter.length) d.scatter(s.scatter);
    else d.para("No self-ratings recorded yet.", { size: 9 });

    /* ── distributions, with the curve the statistics assume */
    d.section("Where the scores fall", 230);
    d.para(
      "Every Clarity Score, in ten-point bins. The line is a normal distribution with the same mean and standard deviation, drawn for comparison: it is what the t-test assumes, not a claim that the scores are normal. The shaded band is the 95% confidence interval of the mean.",
      { size: 8, color: MUTED, after: 4 }
    );
    d.distribution({
      values: s.scoreValues, min: 0, max: 100, binWidth: 10,
      mean: s.meanScore, sd: s.stats.meanScore?.sd ?? null, ci: s.stats.meanScore?.ci ?? null,
      xLabel: "Clarity Score",
    });
    d.statRow([
      { k: "n", v: String(s.n) },
      { k: "Mean", v: r1(s.meanScore) },
      { k: "Median", v: r0(s.medianScore) },
      { k: "SD", v: r1(s.stats.meanScore?.sd ?? null) },
      { k: "95% CI of the mean", v: s.stats.meanScore ? `${r1(s.stats.meanScore.ci.lo)} to ${r1(s.stats.meanScore.ci.hi)}` : "-" },
    ]);

    d.section("The overconfidence gap", 230);
    d.para(
      "Self-rating minus Clarity Score, one value per respondent. Right of the dashed line is an owner who rated themselves above what they could evidence.",
      { size: 8, color: MUTED, after: 4 }
    );
    d.distribution({
      values: s.gapValues, min: -50, max: 50, binWidth: 10,
      mean: s.meanOverconfidence, sd: s.stats.overconfidence?.sd ?? null, ci: s.stats.overconfidence?.ci ?? null,
      zeroLine: true, xLabel: "Self-rating minus score (points)",
    });
    d.statRow([
      { k: "n", v: String(s.nRated) },
      { k: "Mean gap", v: r1(s.meanOverconfidence) },
      { k: "SD", v: r1(s.stats.overconfidence?.sd ?? null) },
      { k: "Paired t-test", v: s.stats.overconfidence ? `t(${s.stats.overconfidence.n - 1}) = ${s.stats.overconfidence.t.toFixed(2)}` : "-" },
      { k: "Significance", v: s.stats.overconfidence ? fmtP(s.stats.overconfidence.p) : "-" },
      { k: "Effect size d", v: s.stats.overconfidence ? s.stats.overconfidence.d.toFixed(2) : "-" },
    ]);

    /* ── bands, which used to share a row with the old histogram */
    d.section("Result bands", 140);
    for (const b of s.bandCounts) d.bar(b.name, `${b.n} · ${r0(b.pct)}%`, b.pct);

    /* ── questions */
    d.section("Where owners are guessing", 200);
    d.para("Share who could not answer each question with confidence (an answer scoring 0 or 1 of 4), highest first. Brackets show the 95% confidence interval.", { size: 8.5, color: MUTED, after: 6 });
    for (const q of s.byQuestion) d.bar(q.area, `${r0(q.pct)}%${q.ci ? `  (${r0(q.ci.lo)}-${r0(q.ci.hi)})` : ""}`, q.pct);

    if (s.blindSpots.length) {
      d.section("Most common biggest blind spot", 120);
      for (const b of s.blindSpots) d.bar(b.area, `${b.n} · ${r0((100 * b.n) / s.n)}%`, (100 * b.n) / s.n);
    }

    /* ── who took part */
    d.section("Who took part", 160);
    d.para(`${r0(s.profileRate)}% answered at least one profile question. Percentages are of those who answered each question; "avg" is their average Clarity Score.`, { size: 8.5, color: MUTED, after: 4 });
    for (const key of Object.keys(s.profile) as (keyof StudyStats["profile"])[]) {
      const rows = s.profile[key];
      const total = rows.reduce((a, r) => a + r.n, 0);
      d.y -= 6;
      d.ensure(30 + rows.length * 19);
      d.para(studyFields.find((f) => f.id === key)!.prompt, { font: d.bold, size: 9, after: 2 });
      if (!total) {
        d.para("No answers yet.", { size: 8.5, color: MUTED });
        continue;
      }
      for (const r of rows) d.bar(r.label, `${r.n} · ${r0(r.pct)}%${r.avgScore !== null ? ` · avg ${r0(r.avgScore)}` : ""}`, r.pct, { size: 8 });
      const g = s.stats.groups[key];
      d.para(groupSentence(g), { size: 7.5, color: g && g.p < 0.05 ? MAROON : MUTED, after: 2 });
    }

    /* ── sources */
    if (s.sources.length) {
      d.section("How participants heard about the study", 100);
      const tot = s.sources.reduce((a, b) => a + b.count, 0);
      for (const src of s.sources) d.bar(sourceLabel(src.source), `${src.count} · ${r0((100 * src.count) / tot)}%`, (100 * src.count) / tot, { size: 8.5 });
    }
  }

  /* ── method */
  d.section("Method and limitations", 150);
  const ex = s.exclusions.length ? s.exclusions.map((e) => `${e.count} ${e.reason.toLowerCase()}`).join(", ") : "none";
  for (const line of [
    `Instrument. The Clarity Check: ${questions.length} questions, each asking for a number, a name or a timeframe, scored 4 / 2 / 1 / 0 and summed to a Clarity Score out of 100. It measures how well an owner knows the business, not how good the business is.`,
    "Self-rating. Asked before the first question so the quiz cannot colour it, on a 1 to 10 scale, multiplied by 10 to compare with the score.",
    "Profile. Optional, asked after the last question and before the score, in bands only (revenue, headcount, industry, role, years, region, three ZIP digits, main source of analysis, candour).",
    "Need and fit. Asked after the result, as two optional research questions about help in general: how much an outside view of these numbers would help right now (not at all, a little, somewhat, a lot), and which kind of help would suit best (a tool, their own CPA or bookkeeper, an independent review with a walk-through, an independent review plus help with the fixes, or no outside help). No brand, price or email was shown or asked, and respondents were told nobody would contact them, so the questions could not read as a sales pitch. H2 is read from the need question for owners and co-owners of $1M+ businesses; willingness to pay is tested in qualified sales conversations, not in the survey. Answers to an earlier price question (retired 6 October 2026) are reported separately and not used.",
    `Sample. Recruited through one shared link, aperturemethod.com/study; the channel is self-reported ("How did you hear about this study?"). Usable means first attempt, at least ${MIN_SECONDS} seconds, and not tagged as a test. ${s.totalRows} completed in total; left out: ${ex}.`,
    "Anonymity. No name, email, company or address is stored with a response. Benchmark-report emails are held in a separate table with no link to answers.",
    "Statistics. Proportions carry Wilson 95% confidence intervals. H1 and H2 are tested against their registered thresholds with an exact one-sided binomial test. The self-rating gap uses a paired t-test with Cohen's d; the self-rating and score relationship uses Spearman's rho (Pearson's r alongside); differences in score between groups use one-way ANOVA. Significance means p < 0.05.",
    "Limitations. A self-selected convenience sample, not a random one: results describe the owners who took part and should not be generalised without that caveat. The same applies to every p-value and interval in this report.",
    "Social desirability. Owners may shade answers to avoid appearing not to know their own business. Anonymity, evidence-based questions, a neutral permission statement (every business tracks different things; there are no wrong answers), an up-front honesty commitment and softened answer wording were used to reduce this. The permission statement deliberately gives no expected result, so it does not anchor answers in either direction. Remaining social-desirability bias would push scores up, so the gaps reported here are likely conservative.",
  ]) {
    const [head, ...rest] = line.split(". ");
    d.ensure(30);
    d.para(`${head}.`, { font: d.bold, size: 8.5, after: 0 });
    d.para(rest.join(". "), { size: 8.5, color: INK, after: 5 });
  }

  d.footers();
  const bytes = await d.doc.save();
  const stamp = now.toISOString().slice(0, 10);
  return { bytes, filename: `Clarity Check Study - Results ${stamp}.pdf` };
}
