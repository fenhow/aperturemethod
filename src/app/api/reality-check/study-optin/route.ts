import { NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/contact";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { sendEmail, emailConfigured, NOTIFY_EMAIL } from "@/lib/email";

/**
 * Clarity Check study: "send me the benchmark report when it is published".
 *
 * Stores the email ONLY, in its own table with no link to any response. That
 * separation is what lets the study page call the answers anonymous while still
 * offering participants the results. Do not add a run id here.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string; website?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  if (body.website && body.website.trim() !== "") return NextResponse.json({ ok: true });

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  if (serviceRoleConfigured) {
    try {
      const { error } = await createAdminClient()
        .from("reality_check_study_optins")
        .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
      if (!error) return NextResponse.json({ ok: true });
      console.error("[reality-check] optin store failed:", error.message);
    } catch (err) {
      console.error("[reality-check] optin store threw:", err);
    }
  }

  // Fallback: tell Fenwick directly so the request is not lost.
  if (emailConfigured) {
    const sent = await sendEmail({
      to: NOTIFY_EMAIL,
      subject: "Clarity Check study: benchmark report requested",
      html: `<p>Send the benchmark report to <strong>${email.replace(/</g, "&lt;")}</strong> when it is published.</p>`,
    });
    if (sent.ok) return NextResponse.json({ ok: true });
  }
  return NextResponse.json(
    { ok: false, message: "We could not save that just now. Please try again shortly." },
    { status: 503 }
  );
}
