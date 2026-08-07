import { NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/contact";
import { questions } from "@/lib/realityCheck";

/**
 * Reality Check — optional emailed breakdown. Same posture as the newsletter
 * handler: validate, honeypot, forward to NEWSLETTER_WEBHOOK_URL when set,
 * otherwise accept and log so the front end is testable without config.
 *
 * The score is shown on screen regardless; this endpoint only exists for
 * people who ask for the long version.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    email?: string;
    website?: string;
    score?: number;
    band?: string;
    answers?: Record<string, number>;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = body.email?.trim() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  // Only accept scores for questions we actually asked.
  const known = new Set(questions.map((q) => q.id));
  const answers: Record<string, number> = {};
  for (const [k, v] of Object.entries(body.answers ?? {})) {
    if (known.has(k) && typeof v === "number" && v >= 0 && v <= 4) answers[k] = v;
  }

  const score = typeof body.score === "number" ? Math.max(0, Math.min(100, body.score)) : null;

  const record = {
    email,
    score,
    band: typeof body.band === "string" ? body.band.slice(0, 80) : null,
    answers,
    receivedAt: new Date().toISOString(),
    source: "website:reality-check",
  };

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[reality-check] webhook forward failed:", err);
      return NextResponse.json(
        { ok: false, message: "We could not send that just now. Please try again shortly." },
        { status: 502 }
      );
    }
  } else {
    console.info("[reality-check] no NEWSLETTER_WEBHOOK_URL set; logging only:", record);
  }

  return NextResponse.json({ ok: true });
}
