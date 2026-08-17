/**
 * Minimal, provider-agnostic analytics hook. Pushes a typed event to
 * `window.dataLayer` (GTM / GA4 / Consent Mode v2 friendly) and is a safe no-op
 * on the server or before any tag is installed. Swap the sink here; the rest of
 * the app only ever calls `track(...)`.
 */

export type AnalyticsEvent =
  | "contact_form_start"
  | "contact_form_submit"
  | "contact_form_success"
  | "contact_form_error"
  | "newsletter_submit"
  | "newsletter_success"
  | "newsletter_error"
  | "cta_click"
  | "look_closer_unlock_submit"
  | "look_closer_unlock_success"
  | "look_closer_download";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

import { hasAnalyticsConsent } from "./consent";

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  // Respect cookie consent: no analytics events until the visitor opts in.
  if (!hasAnalyticsConsent()) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });
}
