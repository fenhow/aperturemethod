import { NextResponse } from "next/server";
import type { OnboardingPayload } from "@/lib/onboarding/types";
import { generateOnboardingPdf } from "@/lib/onboarding/pdf";

/**
 * An unsigned reading copy of the agreement, so nobody has to sign a document
 * to find out what it says.
 *
 * Deliberately different from the submit route: nothing is stored, nothing is
 * emailed, no record is created, and the PDF is stamped DRAFT on every page.
 * Requirements are relaxed to match, because a person who wants to read the
 * contract has not necessarily decided on a company name yet.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const HITS = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    HITS.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: Partial<OnboardingPayload>;
  try {
    body = (await request.json()) as Partial<OnboardingPayload>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, pdfBase64: "", filename: "" });
  }

  const payload: OnboardingPayload = {
    kind: "agreement",
    answers: (body.answers as Record<string, string>) ?? {},
    signerName: body.signerName?.trim() || "",
    signerTitle: body.signerTitle?.trim() || "",
    signerEmail: body.signerEmail?.trim() || "",
    company: body.company?.trim() || "[Client company name]",
    // Never used: the draft path skips the signature block entirely.
    signature: { type: "type", data: "" },
    consent: false,
    segments: Array.isArray(body.segments) ? body.segments.slice(0, 12).map(String) : [],
    draft: true,
  };

  try {
    const { bytes } = await generateOnboardingPdf(payload, {
      ip,
      date: new Date().toISOString(),
    });
    return NextResponse.json({
      ok: true,
      pdfBase64: Buffer.from(bytes).toString("base64"),
      filename: "Aperture-New-Customer-Agreement-DRAFT.pdf",
    });
  } catch (err) {
    console.error("[onboarding/preview] pdf generation failed:", err);
    return NextResponse.json(
      { ok: false, message: "Could not build the reading copy. Please email hello@aperturemethod.com." },
      { status: 500 }
    );
  }
}
