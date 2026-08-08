import { NextResponse } from "next/server";
import { validateOnboarding, type OnboardingPayload } from "@/lib/onboarding/types";
import { submitOnboarding } from "@/lib/onboarding/submit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Best-effort in-memory rate limit (per warm instance).
const HITS = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;

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
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: Partial<OnboardingPayload>;
  try {
    body = (await request.json()) as Partial<OnboardingPayload>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silently accept so bots don't learn they were caught.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, pdfBase64: "", filename: "", stored: false, emailed: false });
  }

  const errors = validateOnboarding(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const payload: OnboardingPayload = {
    kind: body.kind!,
    answers: body.answers ?? {},
    signerName: body.signerName!.trim(),
    signerTitle: body.signerTitle?.trim() || undefined,
    signerEmail: body.signerEmail!.trim(),
    company: body.company!.trim(),
    signature: body.signature!,
    consent: Boolean(body.consent),
    segments: Array.isArray(body.segments) ? body.segments : undefined,
    draftToken: typeof body.draftToken === "string" ? body.draftToken : undefined,
  };

  const date = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Chicago",
  });

  try {
    const result = await submitOnboarding(payload, { ip, userAgent, date });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[onboarding] submit failed:", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please email hello@aperturemethod.com and we'll help." },
      { status: 500 }
    );
  }
}
