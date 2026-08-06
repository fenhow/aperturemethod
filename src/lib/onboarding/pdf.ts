import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  intakeSections,
  intakeMeta,
  intakeConsent,
  agreementClauses,
  agreementMeta,
  feeSchedule,
  ESIGN_CONSENT,
  SYSTEM_ROWS,
} from "./content";
import type { OnboardingPayload } from "./types";
import { KIND_LABEL } from "./types";

// Brand palette
const MAROON = rgb(0x50 / 255, 0, 0);
const INK = rgb(0.1, 0.1, 0.1);
const MUTED = rgb(0.42, 0.42, 0.42);
const LINE = rgb(0.86, 0.86, 0.86);
const GOLD = rgb(0xc9 / 255, 0xa2 / 255, 0x4b / 255);

// Standard Helvetica uses WinAnsi encoding, which can't represent characters
// like → or emoji. Map the common ones and drop anything else out of range so
// arbitrary user input never crashes PDF generation.
const KEEP = new Set([0x2122, 0x2018, 0x2019, 0x201c, 0x201d, 0x2013, 0x2014, 0x2022, 0x2026, 0x20ac]);
function san(s: string): string {
  const replaced = (s ?? "").replace(/→/g, " to ").replace(/[←]/g, "<-").replace(/[↔]/g, "<->").replace(/[⇒]/g, "=>");
  return Array.from(replaced)
    .map((ch) => {
      const c = ch.codePointAt(0)!;
      return c <= 255 || KEEP.has(c) ? ch : "";
    })
    .join("");
}

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = 70;

type Meta = { signerName: string; date: string; ip: string };

class Doc {
  doc!: PDFDocument;
  page!: PDFPage;
  y = 0;
  reg!: PDFFont;
  bold!: PDFFont;
  ital!: PDFFont;
  title = "";
  meta!: Meta;

  async init(title: string, meta: Meta) {
    this.doc = await PDFDocument.create();
    this.reg = await this.doc.embedFont(StandardFonts.Helvetica);
    this.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.ital = await this.doc.embedFont(StandardFonts.HelveticaOblique);
    this.title = san(title);
    this.meta = { ...meta, signerName: san(meta.signerName), date: san(meta.date), ip: san(meta.ip) };
    this.addPage(true);
  }

  addPage(first = false) {
    this.page = this.doc.addPage([PAGE_W, PAGE_H]);
    if (first) {
      // Maroon header band
      this.page.drawRectangle({ x: 0, y: PAGE_H - 96, width: PAGE_W, height: 96, color: MAROON });
      this.page.drawText("THE APERTURE METHOD", {
        x: MARGIN, y: PAGE_H - 46, size: 15, font: this.bold, color: rgb(1, 1, 1),
      });
      this.page.drawText("™", { x: MARGIN + 176, y: PAGE_H - 42, size: 8, font: this.bold, color: GOLD });
      this.page.drawText(this.title, {
        x: MARGIN, y: PAGE_H - 74, size: 10.5, font: this.reg, color: rgb(0.92, 0.85, 0.85),
      });
      this.y = PAGE_H - 128;
    } else {
      this.page.drawText("THE APERTURE METHOD — " + this.title, {
        x: MARGIN, y: PAGE_H - 46, size: 8, font: this.reg, color: MUTED,
      });
      this.page.drawLine({
        start: { x: MARGIN, y: PAGE_H - 54 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 54 },
        thickness: 0.5, color: LINE,
      });
      this.y = PAGE_H - 74;
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
    const lines = this.wrap(text, font, size, maxW);
    for (const ln of lines) {
      this.ensure(gap);
      this.page.drawText(ln, { x, y: this.y, size, font, color });
      this.y -= gap;
    }
    if (opts.after) this.y -= opts.after;
  }

  bullet(text: string) {
    const x = MARGIN + 14;
    this.ensure(14);
    this.page.drawText("•", { x: MARGIN + 2, y: this.y, size: 10, font: this.bold, color: MAROON });
    this.para(text, { x, maxW: CONTENT_W - 14, after: 3 });
  }

  heading(text: string) {
    this.y -= 8;
    this.ensure(20);
    this.para(text, { font: this.bold, size: 12, color: MAROON, after: 4 });
  }

  rule() {
    this.ensure(10);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y + 4 }, end: { x: PAGE_W - MARGIN, y: this.y + 4 },
      thickness: 0.5, color: LINE,
    });
    this.y -= 8;
  }

  finalizeFooters() {
    const pages = this.doc.getPages();
    pages.forEach((p, i) => {
      p.drawLine({
        start: { x: MARGIN, y: BOTTOM - 16 }, end: { x: PAGE_W - MARGIN, y: BOTTOM - 16 },
        thickness: 0.5, color: LINE,
      });
      p.drawText("Confidential · The Aperture Method", {
        x: MARGIN, y: BOTTOM - 30, size: 7.5, font: this.reg, color: MUTED,
      });
      const label = `Page ${i + 1} of ${pages.length}`;
      const w = this.reg.widthOfTextAtSize(label, 7.5);
      p.drawText(label, { x: PAGE_W - MARGIN - w, y: BOTTOM - 30, size: 7.5, font: this.reg, color: MUTED });
    });
  }

  async signatureBlock(p: OnboardingPayload, secondParty: boolean) {
    this.y -= 10;
    this.ensure(120);
    this.heading("Electronic signature");
    this.para(ESIGN_CONSENT, { size: 8.5, color: MUTED, after: 10 });

    // Signature sits in a fixed-height area above the rule; details go below it.
    const areaTop = this.y;
    const AREA_H = 54;
    if (p.signature.type === "draw" && p.signature.data.startsWith("data:image")) {
      try {
        const b64 = p.signature.data.split(",")[1] ?? "";
        const png = await this.doc.embedPng(Buffer.from(b64, "base64"));
        const scale = Math.min(220 / png.width, 46 / png.height);
        this.page.drawImage(png, {
          x: MARGIN, y: areaTop - png.height * scale, width: png.width * scale, height: png.height * scale,
        });
      } catch {
        this.page.drawText(san(p.signerName), { x: MARGIN, y: areaTop - 34, size: 22, font: this.ital, color: INK });
      }
    } else {
      this.page.drawText(san(p.signature.data || p.signerName), {
        x: MARGIN, y: areaTop - 34, size: 22, font: this.ital, color: INK,
      });
    }
    this.y = areaTop - AREA_H;
    this.page.drawLine({ start: { x: MARGIN, y: this.y + 8 }, end: { x: MARGIN + 240, y: this.y + 8 }, thickness: 0.75, color: INK });
    this.y -= 8;

    const rows: [string, string][] = [
      ["Signed by", p.signerName],
      ...(p.signerTitle ? ([["Title", p.signerTitle]] as [string, string][]) : []),
      ["Company", p.company],
      ["Email", p.signerEmail],
      ["Date", this.meta.date],
      ["IP address", this.meta.ip],
    ];
    for (const [k, v] of rows) {
      this.ensure(13);
      this.page.drawText(k + ":", { x: MARGIN, y: this.y, size: 9, font: this.bold, color: INK });
      this.page.drawText(san(v), { x: MARGIN + 78, y: this.y, size: 9, font: this.reg, color: INK });
      this.y -= 13;
    }

    if (secondParty) {
      this.y -= 8;
      this.para("For The Aperture Method: Fenwick How, Founder — countersigned on acceptance.", {
        size: 8.5, color: MUTED,
      });
    }
  }
}

function fieldValue(answers: Record<string, string>, name: string): string {
  const v = answers[name];
  return v && v.trim() ? v.trim() : "";
}

// ------- INTAKE PDF -------
async function buildIntake(p: OnboardingPayload, meta: Meta): Promise<Uint8Array> {
  const d = new Doc();
  await d.init(intakeMeta.title, meta);
  d.para(intakeMeta.subtitle, { font: d.ital, size: 11, color: MUTED, after: 10 });

  for (const section of intakeSections) {
    d.heading(section.title);
    if (section.help) d.para(section.help, { size: 8.5, color: MUTED, after: 4 });
    for (const f of section.fields) {
      if (f.type === "systems") {
        d.para("Systems & data access:", { font: d.bold, size: 9.5, after: 2 });
        let rows: Array<{ area: string; system: string; available: string; share: string }> = [];
        try {
          rows = JSON.parse(fieldValue(p.answers, f.name) || "[]");
        } catch { rows = []; }
        const byArea = new Map(rows.map((r) => [r.area, r]));
        for (const area of SYSTEM_ROWS) {
          const r = byArea.get(area);
          const parts: string[] = [];
          if (r?.system) parts.push(r.system);
          if (r?.available) parts.push(`available: ${r.available}`);
          if (r?.share) parts.push(`share: ${r.share}`);
          d.para(`${area} — ${parts.length ? parts.join(" · ") : "—"}`, { x: MARGIN + 14, size: 9, after: 1 });
        }
        d.y -= 4;
        continue;
      }
      const val = fieldValue(p.answers, f.name);
      d.ensure(14);
      d.para(f.label, { font: d.bold, size: 9.5, after: 1 });
      d.para(val || "—", { size: 10, color: val ? INK : MUTED, after: 5 });
    }
  }

  d.rule();
  d.heading("Consent");
  d.para("✓  " + intakeConsent, { size: 9, after: 2 });
  await d.signatureBlock(p, false);
  d.finalizeFooters();
  return d.doc.save();
}

// ------- AGREEMENT PDF -------
async function buildAgreement(p: OnboardingPayload, meta: Meta): Promise<Uint8Array> {
  const d = new Doc();
  await d.init(agreementMeta.title, meta);
  d.para(agreementMeta.subtitle, { font: d.ital, size: 11, color: MUTED, after: 8 });

  const eff = fieldValue(p.answers, "effective_date") || meta.date;
  const legal = fieldValue(p.answers, "client_legal_name") || p.company;
  d.para(
    `This Services Agreement (the "Agreement") is entered into as of ${eff} (the "Effective Date") by and between Service Provider: The Aperture Method ("Aperture," "we," "us") and Client: ${legal} ("Client," "you"). Aperture and Client are each a "Party" and together the "Parties."`,
    { size: 10, after: 6 }
  );

  for (const c of agreementClauses) {
    d.heading(`${c.n}. ${c.title}`);
    if (c.body.length === 1) {
      d.para(c.body[0] ?? "", { size: 10, after: 4 });
    } else {
      for (const item of c.body) d.bullet(item);
      d.y -= 2;
    }
  }

  // Exhibit A
  d.rule();
  d.heading("Exhibit A — Scope & Fees");
  d.para("Standard starting points; the agreed figure is set per engagement.", { size: 8.5, color: MUTED, after: 6 });
  for (const row of feeSchedule) {
    d.ensure(24);
    d.para(row.phase, { font: d.bold, size: 9.5, after: 1 });
    d.para(`${row.deliverable}  —  ${row.fee}`, { x: MARGIN + 14, size: 9, color: MUTED, after: 4 });
  }
  const startDate = fieldValue(p.answers, "engagement_start");
  const clientContact = fieldValue(p.answers, "client_contact");
  d.y -= 2;
  d.para(`Engagement start date: ${startDate || "—"}`, { size: 9.5, after: 2 });
  d.para(`Primary Aperture contact: Fenwick How`, { size: 9.5, after: 2 });
  d.para(`Primary Client contact: ${clientContact || p.signerName}`, { size: 9.5, after: 4 });

  await d.signatureBlock(p, true);
  d.finalizeFooters();
  return d.doc.save();
}

export async function generateOnboardingPdf(
  p: OnboardingPayload,
  meta: { ip: string; date: string }
): Promise<{ bytes: Uint8Array; filename: string }> {
  const m: Meta = { signerName: p.signerName, date: meta.date, ip: meta.ip };
  const bytes = p.kind === "agreement" ? await buildAgreement(p, m) : await buildIntake(p, m);
  const safeCompany = p.company.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "client";
  const stamp = meta.date.replace(/[^0-9]/g, "").slice(0, 8);
  const filename = `${KIND_LABEL[p.kind].replace(/\s+/g, "-")}-${safeCompany}-${stamp}.pdf`;
  return { bytes, filename };
}
