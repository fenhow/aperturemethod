import { NextResponse } from "next/server";
import type { OnboardingPayload } from "@/lib/onboarding/types";
import { generateOnboardingPdf } from "@/lib/onboarding/pdf";

/**
 * An unsigned copy of a document, in one of two shapes.
 *
 *   draft (default)  a reading copy, stamped DRAFT on every page, so nobody has
 *                    to sign a document to find out what it says.
 *   printable        a copy to print, sign by hand and send back: ruled
 *                    signature lines for both parties, instructions for
 *                    returning it, and no DRAFT wash, because this one is meant
 *                    to become the executed copy once it is signed.
 *
 * Deliberately different from the submit route either way: nothing is stored,
 * nothing is emailed, and no record is created. A hand-signed document only
 * exists once it comes back by email. Requirements are relaxed to match,
 * because a person who wants to read the contract has not necessarily decided
 * on a company name yet.
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

  /* Either signable document can be read unsigned; anything else is treated as
     the agreement, which is what this route was built for. */
  const kind = body.kind === "nda" ? "nda" : body.kind === "intake" ? "intake" : "agreement";
  const printable = body.printable === true;
  const payload: OnboardingPayload = {
    kind,
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
    printable,
  };

  try {
    const { bytes } = await generateOnboardingPdf(payload, {
      ip,
      date: new Date().toISOString(),
    });
    return NextResponse.json({
      ok: true,
      pdfBase64: Buffer.from(bytes).toString("base64"),
      filename: `${
        kind === "nda"
          ? "Aperture-Mutual-NDA"
          : kind === "intake"
            ? "Aperture-Client-Intake"
            : "Aperture-New-Customer-Agreement"
      }-${printable ? "PRINT-AND-SIGN" : "DRAFT"}.pdf`,
    });
  } catch (err) {
    console.error("[onboarding/preview] pdf generation failed:", err);
    return NextResponse.json(
      { ok: false, message: "Could not build the reading copy. Please email hello@aperturemethod.com." },
      { status: 500 }
    );
  }
}
