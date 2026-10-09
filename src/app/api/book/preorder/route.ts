import { NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/contact";
import { sendEmail, emailConfigured, NOTIFY_EMAIL } from "@/lib/email";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";

/**
 * Book pre-orders for "Look Closer".
 *
 * This used to post to /api/newsletter, which meant a reservation was either
 * forwarded to an ESP webhook or written to the server log and lost. Every
 * pre-order is now one row in Supabase `book_preorders` — email address, the
 * Mays MBA flag, which page it came from, and the date and time — and Fenwick
 * gets a note the moment it lands. See supabase/migrations/0007.
 *
 * Degrades in order: store if the service role is configured, email if SMTP is
 * configured, forward to NEWSLETTER_WEBHOOK_URL if that is set. The visitor
 * sees success if any of those worked, and an honest error if none did, because
 * a cheerful thank-you over a dropped address is worse than no form at all.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HITS = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

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

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: { email?: string; name?: string; mays?: boolean; source?: string; website?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: answer like a success so a bot learns nothing.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, alreadyOn: false, mays: false });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address." },
      { status: 422 }
    );
  }
  const name = (body.name ?? "").trim().slice(0, 120) || null;
  const mays = body.mays === true;
  const source = ((body.source ?? "").trim() || "book").slice(0, 64);
  const at = new Date();

  let stored = false;
  let alreadyOn = false;
  let position: number | null = null;

  if (serviceRoleConfigured) {
    try {
      const admin = createAdminClient();
      const { data: existing } = await admin
        .from("book_preorders")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      alreadyOn = Boolean(existing?.id);

      const { error } = await admin
        .from("book_preorders")
        .upsert({ email, name, mays_cohort: mays, source }, { onConflict: "email" });
      if (error) throw error;
      stored = true;

      const { count } = await admin
        .from("book_preorders")
        .select("id", { count: "exact", head: true });
      position = typeof count === "number" ? count : null;
    } catch (err) {
      console.error("[book/preorder] store failed:", err);
    }
  }

  const when = at.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "full",
    timeStyle: "short",
  });

  let emailed = false;
  if (emailConfigured) {
    const row = (k: string, v: string) =>
      `<tr><td style="padding:4px 14px 4px 0;color:#6b6b6b;font:14px Helvetica,Arial,sans-serif">${k}</td>` +
      `<td style="padding:4px 0;color:#141414;font:14px Helvetica,Arial,sans-serif"><strong>${esc(v)}</strong></td></tr>`;
    const html =
      `<div style="font:16px Helvetica,Arial,sans-serif;color:#141414">` +
      `<p style="margin:0 0 14px"><strong>${mays ? "Mays MBA pre-order" : "Book pre-order"}</strong> for <em>Look Closer</em>.</p>` +
      `<table cellspacing="0" cellpadding="0">` +
      row("Email", email) +
      (name ? row("Name", name) : "") +
      row("Mays MBA cohort", mays ? "Yes — reads free" : "No") +
      row("Signed up from", source) +
      row("Date & time", `${when} (Central)`) +
      (position !== null ? row("List size", `${position} ${position === 1 ? "person" : "people"}`) : "") +
      (alreadyOn ? row("Note", "Already on the list — details updated") : "") +
      `</table>` +
      (stored
        ? `<p style="margin:16px 0 0;color:#6b6b6b;font:13px Helvetica,Arial,sans-serif">Saved to Supabase &rarr; book_preorders.</p>`
        : `<p style="margin:16px 0 0;color:#500000;font:13px Helvetica,Arial,sans-serif"><strong>Not saved to the database</strong> — this email is the only record. Check SUPABASE_SERVICE_ROLE_KEY.</p>`) +
      `</div>`;
    const res = await sendEmail({
      to: NOTIFY_EMAIL,
      subject: `${mays ? "Mays MBA" : "Book"} pre-order: ${email}`,
      html,
      replyTo: email,
    });
    emailed = res.ok;
  }

  // Optional ESP forward, so the address can also land in a mailing list.
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name: name ?? undefined,
          receivedAt: at.toISOString(),
          source: `website:book-preorder${mays ? ":mays" : ""}`,
        }),
      });
    } catch (err) {
      console.error("[book/preorder] webhook forward failed:", err);
    }
  }

  if (!stored && !emailed && !webhook) {
    console.info("[book/preorder] nowhere to put this:", { email, mays, source, at: at.toISOString() });
    return NextResponse.json(
      { ok: false, message: "We could not save that. Please email hello@aperturemethod.com and you are on the list." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, alreadyOn, mays });
}
