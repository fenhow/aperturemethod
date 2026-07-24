import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact";

/**
 * Consultation / contact intake handler.
 *
 * Today: validates server-side, drops obvious spam, and (optionally) forwards
 * the enquiry to whatever endpoint `CONTACT_WEBHOOK_URL` points at — a HubSpot
 * Forms URL, a Formspree endpoint, or your own serverless function. With no env
 * set it accepts and logs, so the front end is fully testable before the CRM is
 * wired. Never throws the payload back to the client.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort in-memory rate limit (per warm instance). A durable limiter
// (Upstash / KV) replaces this in production.
const HITS = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

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
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: Partial<ContactPayload>;
  try {
    body = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot — silently accept so bots don't learn they were caught.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const enquiry = {
    inquiryType: body.inquiryType ?? "Consultation",
    name: body.name!.trim(),
    email: body.email!.trim(),
    company: body.company!.trim(),
    challenge: body.challenge!.trim(),
    role: body.role?.trim() || undefined,
    industry: body.industry || undefined,
    revenue: body.revenue || undefined,
    timeline: body.timeline || undefined,
    referral: body.referral?.trim() || undefined,
    newsletter: Boolean(body.newsletter),
    receivedAt: new Date().toISOString(),
    source: "website:/contact",
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(enquiry),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[contact] webhook forward failed:", err);
      return NextResponse.json(
        { ok: false, message: "Something went wrong sending your message. Please email us directly." },
        { status: 502 }
      );
    }
  } else {
    // No CRM wired yet — record it so nothing is lost during testing.
    console.info("[contact] enquiry received:", enquiry);
  }

  return NextResponse.json({ ok: true });
}
