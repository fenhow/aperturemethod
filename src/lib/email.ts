import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Transactional email over SMTP, sent from your own mailbox (e.g. Google
 * Workspace / Gmail on aperturemethod.com). No third-party service. Set these in
 * Vercel → Settings → Environment Variables (Server):
 *
 *   SMTP_HOST  : e.g. smtp.gmail.com
 *   SMTP_PORT  : 465 (SSL) or 587 (STARTTLS). Default 587.
 *   SMTP_SECURE: "true" for port 465, otherwise leave unset/"false".
 *   SMTP_USER  : the full mailbox address (e.g. hello@aperturemethod.com)
 *   SMTP_PASS  : an app password for that mailbox (not your login password)
 *   ONBOARDING_FROM_EMAIL  : optional display sender; defaults to SMTP_USER
 *   ONBOARDING_NOTIFY_EMAIL: where owner notifications go; defaults to SMTP_USER
 *
 * Until SMTP is configured, sends are logged and treated as best-effort so the
 * rest of the flow (PDF + portal storage) still works.
 */
const SMTP_HOST = (process.env.SMTP_HOST ?? "").trim();
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_SECURE = (process.env.SMTP_SECURE ?? "").trim().toLowerCase() === "true";
const SMTP_USER = (process.env.SMTP_USER ?? "").trim();
const SMTP_PASS = (process.env.SMTP_PASS ?? "").trim();

export const FROM_EMAIL =
  (process.env.ONBOARDING_FROM_EMAIL ?? "").trim() ||
  (SMTP_USER ? `The Aperture Method <${SMTP_USER}>` : "The Aperture Method <hello@aperturemethod.com>");
export const NOTIFY_EMAIL =
  (process.env.ONBOARDING_NOTIFY_EMAIL ?? "").trim() || SMTP_USER || "hello@aperturemethod.com";

export const emailConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: Transporter | null = null;
function getTransport(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export type Attachment = { filename: string; contentBase64: string };

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
}): Promise<{ ok: boolean; error?: string }> {
  if (!emailConfigured) {
    console.info("[email] (SMTP not configured) would send:", opts.subject, "→", opts.to);
    return { ok: false, error: "not-configured" };
  }
  try {
    await getTransport().sendMail({
      from: FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
      attachments: opts.attachments?.map((a) => ({
        filename: a.filename,
        content: Buffer.from(a.contentBase64, "base64"),
        contentType: "application/pdf",
      })),
    });
    return { ok: true };
  } catch (err) {
    console.error("[email] SMTP send failed", err);
    return { ok: false, error: "smtp-exception" };
  }
}
