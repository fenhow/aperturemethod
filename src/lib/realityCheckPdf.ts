import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import { APERTURE_LOGO_WHITE_HORIZONTAL_B64 } from "./onboarding/logo";
import { questions, type RCResult } from "./realityCheck";

/**
 * The Reality Check, as a branded PDF attached to the breakdown email.
 *
 * WHY A SEPARATE BUILDER rather than reusing lib/onboarding/pdf.ts. That module
 * builds the documents a client SIGNS, and its `Doc` class is bound to the
 * onboarding payload types: the letterhead wants a signer, the footer wants an
 * IP address, and there is a draft stamp that must never be removable. Bending
 * it to take a quiz result would mean editing the code path that produces a
 * contract, to add a marketing attachment. Not a trade worth making. The brand
 * constants and the letterhead treatment are deliberately copied so the two
 * documents look like they came from the same firm.
 *
 * SANITIZER, AND WHY IT IS NOT THE ONE NEXT DOOR. Standard Helvetica is WinAnsi
 * encoded and cannot represent a character above 255. The onboarding sanitizer
 * keeps a short allow-list and DROPS everything else, which is right for prose
 * but silently destroys arithmetic: the explainers contain U+2212 MINUS SIGN
 * and U+2248 ALMOST EQUAL TO, so "DSO + days inventory outstanding - days
 * payable outstanding" would have lost its minus and become nonsense in a
 * document about being precise with numbers. Every symbol used in the
 * explainers is mapped to an ASCII equivalent here rather than dropped.
 */

const MAROON = rgb(0x50 / 255, 0, 0);
const INK = rgb(0.1, 0.1, 0.1);
const MUTED = rgb(0.42, 0.42, 0.42);
const LINE = rgb(0.86, 0.86, 0.86);
const SURFACE = rgb(0.96, 0.955, 0.955);
const GOLD = rgb(0xc9 / 255, 0xa2 / 255, 0x4b / 255);

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = 70;

/** Characters the explainers actually use that Helvetica cannot encode. */
const MAP: Record<string, string> = {
  "−": "-", // minus sign
  "≈": "~", // almost equal to
  "→": " to ",
  "←": "<-",
  "–": "-",
  "—": "-",
  "‘": "'",
  "’": "'",
  "“": '"',
  "”": '"',
  "…": "...",
  " ": " ",
};
/** ™ is representable and carries legal weight, so it stays. */
const KEEP = new Set([0x2122]);

function san(s: string): string {
  return Array.from(s ?? "")
    .map((ch) => {
      const mapped = MAP[ch];
      if (mapped !== undefined) return mapped;
      const c = ch.codePointAt(0)!;
      return c <= 255 || KEEP.has(c) ? ch : "";
    })
    .join("");
}

class Doc {
  doc!: PDFDocument;
  page!: PDFPage;
  y = 0;
  reg!: PDFFont;
  bold!: PDFFont;
  ital!: PDFFont;
  logo!: PDFImage;
  recipient = "";
  date = "";

  async init(recipient: string, date: string) {
    this.doc = await PDFDocument.create();
    this.reg = await this.doc.embedFont(StandardFonts.Helvetica);
    this.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.ital = await this.doc.embedFont(StandardFonts.HelveticaOblique);
    this.logo = await this.doc.embedPng(Buffer.from(APERTURE_LOGO_WHITE_HORIZONTAL_B64, "base64"));
    this.recipient = san(recipient);
    this.date = san(date);
    this.doc.setTitle("The Reality Check");
    this.doc.setAuthor("The Aperture Method");
    this.addPage(true);
  }

  private rightText(text: string, y: number, size: number, font: PDFFont, color: ReturnType<typeof rgb>) {
    const w = font.widthOfTextAtSize(text, size);
    this.page.drawText(text, { x: PAGE_W - MARGIN - w, y, size, font, color });
  }

  addPage(first = false) {
    this.page = this.doc.addPage([PAGE_W, PAGE_H]);
    if (first) {
      const BAND = 104;
      this.page.drawRectangle({ x: 0, y: PAGE_H - BAND, width: PAGE_W, height: BAND, color: MAROON });
      const lw = 214;
      const lh = lw * (this.logo.height / this.logo.width);
      this.page.drawImage(this.logo, { x: MARGIN, y: PAGE_H - 40 - lh, width: lw, height: lh });
      this.page.drawText("The Reality Check", {
        x: MARGIN, y: PAGE_H - 84, size: 10.5, font: this.reg, color: rgb(0.92, 0.85, 0.85),
      });
      const recip = this.recipient.length > 40 ? this.recipient.slice(0, 40) + "..." : this.recipient;
      this.rightText("PREPARED FOR", PAGE_H - 40, 7, this.bold, GOLD);
      if (recip) this.rightText(recip, PAGE_H - 58, 12, this.bold, rgb(1, 1, 1));
      this.rightText(this.date, PAGE_H - 74, 8.5, this.reg, rgb(0.92, 0.85, 0.85));
      this.y = PAGE_H - BAND - 30;
    } else {
      /*
       * Text only in the running header, and no logo mark.
       *
       * The only icon available as an embedded asset is the WHITE one, which is
       * meant for the maroon band on page one. Placed on a white continuation
       * page it disappears apart from its anti-aliased edge, which reads as a
       * smudge rather than a logo. A small maroon rule carries the brand here
       * instead, and it survives being printed in black and white.
       */
      this.page.drawRectangle({ x: MARGIN, y: PAGE_H - 50, width: 3, height: 11, color: MAROON });
      this.page.drawText("The Aperture Method: The Reality Check", {
        x: MARGIN + 10, y: PAGE_H - 47, size: 8, font: this.reg, color: MUTED,
      });
      this.rightText(this.recipient, PAGE_H - 47, 8, this.reg, MUTED);
      this.page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 58 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 58 },
        thickness: 0.5, color: LINE,
      });
      this.y = PAGE_H - 78;
    }
  }

  ensure(space: number) {
    if (this.y - space < BOTTOM) this.addPage();
  }

  wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
    const out: string[] = [];
    for (const raw of san(text).split("\n")) {
      const words = raw.split(/\s+/);
      let line = "";
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (font.widthOfTextAtSize(test, size) > maxW && line) {
          out.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      out.push(line);
    }
    return out;
  }

  para(
    text: string,
    opts: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; x?: number; maxW?: number; gap?: number; after?: number } = {}
  ) {
    const font = opts.font ?? this.reg;
    const size = opts.size ?? 10;
    const color = opts.color ?? INK;
    const x = opts.x ?? MARGIN;
    const maxW = opts.maxW ?? CONTENT_W - (x - MARGIN);
    const gap = opts.gap ?? size * 1.42;
    for (const ln of this.wrap(text, font, size, maxW)) {
      this.ensure(gap);
      this.page.drawText(ln, { x, y: this.y, size, font, color });
      this.y -= gap;
    }
    if (opts.after) this.y -= opts.after;
  }

  heading(text: string) {
    this.y -= 10;
    this.ensure(24);
    this.para(text, { font: this.bold, size: 12, color: MAROON, after: 5 });
  }

  /**
   * A run-in beat: a bold maroon label followed by body text that wraps under
   * the label rather than being indented to it. Matches the email, where the
   * same three beats appear, so the two read as one document.
   */
  beat(label: string, text: string, size = 9.5) {
    const gap = size * 1.45;
    const lbl = san(label) + " ";
    const lw = this.bold.widthOfTextAtSize(lbl, size);
    const first = this.wrap(text, this.reg, size, CONTENT_W - lw - 12);
    const firstLine = first[0] ?? "";
    this.ensure(gap);
    this.page.drawText(lbl, { x: MARGIN + 12, y: this.y, size, font: this.bold, color: MAROON });
    this.page.drawText(firstLine, { x: MARGIN + 12 + lw, y: this.y, size, font: this.reg, color: INK });
    this.y -= gap;
    const rest = san(text).slice(firstLine.length).trim();
    if (rest) this.para(rest, { x: MARGIN + 12, maxW: CONTENT_W - 12, size, gap });
  }

  rule(after = 8) {
    this.ensure(10);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y + 4 }, end: { x: PAGE_W - MARGIN, y: this.y + 4 },
      thickness: 0.5, color: LINE,
    });
    this.y -= after;
  }

  finalizeFooters() {
    const pages = this.doc.getPages();
    pages.forEach((p, i) => {
      p.drawLine({
        start: { x: MARGIN, y: BOTTOM - 16 }, end: { x: PAGE_W - MARGIN, y: BOTTOM - 16 },
        thickness: 0.5, color: LINE,
      });
      p.drawText("A self-assessment, not an audit  ·  The Aperture Method", {
        x: MARGIN, y: BOTTOM - 30, size: 7.5, font: this.reg, color: MUTED,
      });
      const label = `Page ${i + 1} of ${pages.length}`;
      const w = this.reg.widthOfTextAtSize(label, 7.5);
      p.drawText(label, { x: PAGE_W - MARGIN - w, y: BOTTOM - 30, size: 7.5, font: this.reg, color: MUTED });
    });
  }
}

export async function generateRealityCheckPdf(
  who: { name: string; company?: string },
  result: RCResult,
  answers: Record<string, number>,
  date: string
): Promise<{ bytes: Uint8Array; filename: string }> {
  const { score, band, gaps, blindSpot } = result;
  const d = new Doc();
  await d.init(who.company?.trim() || who.name, date);

  /* ------------------------------------------------ the score, up front */
  const BOX_H = 92;
  d.ensure(BOX_H + 10);
  const top = d.y;
  d.page.drawRectangle({ x: MARGIN, y: top - BOX_H, width: CONTENT_W, height: BOX_H, color: SURFACE });
  d.page.drawRectangle({ x: MARGIN, y: top - BOX_H, width: 4, height: BOX_H, color: MAROON });
  d.page.drawText(String(score), { x: MARGIN + 22, y: top - 46, size: 40, font: d.bold, color: MAROON });
  const sw = d.bold.widthOfTextAtSize(String(score), 40);
  d.page.drawText("/ 100", { x: MARGIN + 26 + sw, y: top - 46, size: 12, font: d.reg, color: MUTED });
  d.page.drawText("YOUR CLARITY SCORE", { x: MARGIN + 22, y: top - 64, size: 7.5, font: d.bold, color: MUTED });
  const bandX = MARGIN + 170;
  d.page.drawText(san(band.name), { x: bandX, y: top - 30, size: 14, font: d.bold, color: INK });
  const verdict = d.wrap(band.verdict, d.reg, 9.5, CONTENT_W - (bandX - MARGIN) - 20);
  let vy = top - 48;
  for (const ln of verdict.slice(0, 3)) {
    d.page.drawText(ln, { x: bandX, y: vy, size: 9.5, font: d.reg, color: INK });
    vy -= 13;
  }
  d.y = top - BOX_H - 18;

  d.para(band.frame, { size: 10, color: INK, after: 4 });

  /* ------------------------------------------------------------- gaps */
  if (gaps.length > 0) {
    d.heading(`What you could not answer with confidence: ${gaps.length} of ${questions.length}`);
    d.para(
      "Each of these is a question about your own business that does not currently have an evidenced answer. This list is the useful part of the result.",
      { size: 9.5, color: MUTED, after: 6 }
    );
    for (const g of gaps) {
      d.ensure(30);
      d.para(san(g.area).toUpperCase(), { font: d.bold, size: 7.5, color: MAROON, gap: 11 });
      d.para(g.prompt, { size: 9.5, color: INK, after: 6 });
    }
  } else {
    d.heading(`You answered all ${questions.length} with confidence`);
    d.para(
      "That is genuinely uncommon. The honest recommendation is not a full engagement; it is a conversation about the one or two questions where your evidence is thinnest.",
      { size: 9.5, color: MUTED, after: 4 }
    );
  }

  /* ------------------------------------------------------- blind spot */
  if (blindSpot) {
    d.y -= 6;
    d.ensure(120);
    d.heading("Your biggest blind spot");
    d.para(blindSpot.blindSpot.headline, { font: d.bold, size: 11.5, color: INK, after: 4 });
    d.para(blindSpot.blindSpot.body, { size: 9.5, after: 4 });
    d.para(blindSpot.blindSpot.cost, { font: d.bold, size: 9.5, after: 4 });
    d.para(`Addressed by ${blindSpot.component}`, { size: 8.5, color: MUTED, after: 2 });
  }

  /* --------------------------------------------------- what they said */
  d.heading("Everything you answered");
  for (const q of questions) {
    const v = answers[q.id];
    const chosen = q.options.find((o) => o.score === v);
    const weak = (v ?? 0) <= 1;
    d.ensure(26);
    d.para(san(q.area).toUpperCase(), { font: d.bold, size: 7, color: weak ? MAROON : MUTED, gap: 10 });
    d.para(chosen ? chosen.label : "Not answered", {
      size: 9.5, color: weak ? MAROON : INK, font: weak ? d.bold : d.reg, after: 5,
    });
  }

  /* ------------------------------------------- the study guide, its own page */
  d.addPage();
  d.para("THE METRICS BEHIND THE QUESTIONS", { font: d.bold, size: 8, color: MAROON, gap: 13 });
  d.para(
    "Every question you answered is the plain-language version of a standard financial or operating measure. Here is each one: what it is, how it is calculated, and what the number tells you once you have it. Your own gaps are marked, and they are the ones worth starting with. Nothing here needs software you do not already have; most of it comes off a P&L and a balance sheet you already produce.",
    { size: 9.5, color: MUTED, after: 10 }
  );

  questions.forEach((q, i) => {
    const weak = (answers[q.id] ?? 0) <= 1;
    d.ensure(96);
    d.rule(10);
    const n = String(i + 1).padStart(2, "0");
    d.para(`${n}  ${san(q.area).toUpperCase()}${weak ? "   ·   ONE OF YOUR GAPS" : ""}`, {
      font: d.bold, size: 7, color: weak ? MAROON : MUTED, gap: 12,
    });
    d.para(q.explainer.metric, { font: d.bold, size: 11.5, color: INK, after: 2 });
    d.para(q.prompt, { font: d.ital, size: 9, color: MUTED, after: 5 });
    d.beat("What it is.", q.explainer.what);
    d.beat("How it is calculated.", q.explainer.how);
    d.beat("What the number tells you.", q.explainer.reading);
    d.y -= 6;
  });

  /* ------------------------------------------------------------ close */
  d.y -= 6;
  d.ensure(110);
  d.heading("What this is, and what it is not");
  d.para(
    "This is a self-assessment. It tells you what you do not currently know, not how good the business is. The Business X-Ray™ is the diagnostic that answers it: a seven-lens read of the whole business, the named constraint with the evidence behind it, and a baseline Aperture Score™ you can track. Two to three weeks, fixed fee, senior-led.",
    { size: 9.5, after: 6 }
  );
  d.para("aperturemethod.com  ·  hello@aperturemethod.com", { size: 9, color: MAROON, font: d.bold });

  d.finalizeFooters();
  const bytes = await d.doc.save();
  const safe = (who.company?.trim() || who.name).replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "your-business";
  const stamp = date.replace(/[^0-9]/g, "").slice(0, 8);
  return { bytes, filename: `Reality-Check-${safe}-${stamp}.pdf` };
}
