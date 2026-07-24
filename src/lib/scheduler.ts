/**
 * Scheduler (Calendly) configuration.
 *
 * Set the booking link ONE of two ways:
 *   1. Preferred: env var  NEXT_PUBLIC_SCHEDULER_URL=https://calendly.com/you/consultation
 *   2. Quick:     paste your Calendly event link into DEFAULT_SCHEDULER_URL below.
 *
 * When neither is set, the Contact page shows a graceful "send a note" fallback.
 */

// ⬇️  Paste your Calendly event link here (or leave "" and use the env var).
const DEFAULT_SCHEDULER_URL = "https://calendly.com/fenhow/30min";

export const schedulerUrl =
  process.env.NEXT_PUBLIC_SCHEDULER_URL || DEFAULT_SCHEDULER_URL || "";

export const isCalendly = (url: string): boolean => /calendly\.com/.test(url);

/** Brand-themed Calendly embed URL (maroon accent, no GDPR banner — we run our own consent). */
export function calendlyEmbedUrl(base: string = schedulerUrl): string {
  if (!base) return "";
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}hide_gdpr_banner=1&primary_color=500000`;
}
