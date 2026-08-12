import { NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/contact";

/**
 * "In Focus" newsletter opt-in. Same posture as the contact handler: validate,
 * honeypot, optional forward to `NEWSLETTER_WEBHOOK_URL` (a HubSpot / ESP list
 * endpoint). No env set → accept and log, so the front end is testable.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string; website?: string; source?: string; name?: string; org?: string };
  try {
    body = (await request.json()) as {
      email?: string;
      website?: string;
      source?: string;
      name?: string;
      org?: string;
    };
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

  const source = typeof body.source === "string" && body.source.trim() ? body.source.trim().slice(0, 64) : "in-focus";
  const clean = (v?: string) => (typeof v === "string" ? v.trim().slice(0, 120) : "");
  const record = {
    email,
    name: clean(body.name) || undefined,
    org: clean(body.org) || undefined,
    receivedAt: new Date().toISOString(),
    source: `website:${source}`,
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
      console.error("[newsletter] webhook forward failed:", err);
      return NextResponse.json(
        { ok: false, message: "Something went wrong. Please try again shortly." },
        { status: 502 }
      );
    }
  } else {
    console.info("[newsletter] subscribe:", record);
  }

  return NextResponse.json({ ok: true });
}
