import "server-only";

/**
 * Minimal transactional email via Resend's HTTP API (no SDK needed). Set
 * RESEND_API_KEY in Vercel to enable. Until then, sends are logged and treated
 * as best-effort so the rest of the flow (PDF + storage) still works.
 *
 *   RESEND_API_KEY          — your Resend key
 *   ONBOARDING_FROM_EMAIL   — verified sender, e.g. "The Aperture Method <onboarding@aperturemethod.com>"
 *   ONBOARDING_NOTIFY_EMAIL — where owner notifications go (default fen@aperturemethod.com)
 */
const RESEND_API_KEY = (process.env.RESEND_API_KEY ?? "").trim();
export const FROM_EMAIL =
  (process.env.ONBOARDING_FROM_EMAIL ?? "").trim() ||
  "The Aperture Method <onboarding@aperturemethod.com>";
export const NOTIFY_EMAIL =
  (process.env.ONBOARDING_NOTIFY_EMAIL ?? "").trim() || "fen@aperturemethod.com";

export const emailConfigured = Boolean(RESEND_API_KEY);

export type Attachment = { filename: string; contentBase64: string };

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
}): Promise<{ ok: boolean; error?: string }> {
  if (!emailConfigured) {
    console.info("[email] (not configured) would send:", opts.subject, "→", opts.to);
    return { ok: false, error: "not-configured" };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
        attachments: opts.attachments?.map((a) => ({ filename: a.filename, content: a.contentBase64 })),
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[email] Resend error", res.status, text);
      return { ok: false, error: `resend-${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, error: "exception" };
  }
}
