import { NextResponse } from "next/server";
import { sendEmail, emailConfigured, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/email";

/**
 * Diagnostic: visit /api/email-test in a browser to check the email setup.
 * Sends a test message to the owner address only (can't be used to spam others)
 * and returns exactly what happened as JSON. Safe to leave in place; remove later
 * if you like. Never reveals credentials.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!emailConfigured) {
    return NextResponse.json({
      configured: false,
      ok: false,
      message:
        "SMTP is NOT configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS in Vercel → Settings → Environment Variables, then redeploy.",
    });
  }

  const res = await sendEmail({
    to: NOTIFY_EMAIL,
    subject: "Aperture email test ✔",
    html: "<p>If you can read this, your SMTP relay is working. You can ignore this message.</p>",
  });

  return NextResponse.json({
    configured: true,
    from: FROM_EMAIL,
    sentTo: NOTIFY_EMAIL,
    ok: res.ok,
    error: res.error ?? null,
    next: res.ok
      ? `Now check the inbox for ${NOTIFY_EMAIL} (and its spam folder).`
      : "The relay rejected the message — the 'error' above is the reason.",
  });
}
