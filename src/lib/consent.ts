/**
 * Cookie-consent state. Stored in localStorage and mirrored to the dataLayer /
 * Google Consent Mode v2, so analytics and marketing tags stay denied until the
 * visitor opts in. The rest of the app reads consent through here.
 */

export type Consent = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

export type ConsentChoice = Pick<Consent, "functional" | "analytics" | "marketing">;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const KEY = "am_cookie_consent_v1";
export const CONSENT_EVENT = "am:consent-change";
export const OPEN_PREFERENCES_EVENT = "am:open-cookie-preferences";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics ?? false;
}

/** Push the current choice to the dataLayer and Consent Mode v2 (no-op until a tag manager is present). */
export function applyConsent(c: Consent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: "consent_update",
    functional_consent: c.functional,
    analytics_consent: c.analytics,
    marketing_consent: c.marketing,
  });
  window.gtag?.("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}

/** Consent Mode v2 defaults: everything non-essential denied until a choice is made. */
export function setDefaultConsent(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
}

export function writeConsent(choice: ConsentChoice): Consent {
  const full: Consent = { necessary: true, ...choice, ts: Date.now() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(full));
  } catch {
    /* storage unavailable: consent simply won't persist */
  }
  applyConsent(full);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: full }));
  return full;
}

/** Ask the consent banner to open its preferences panel (used by the footer link). */
export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}
