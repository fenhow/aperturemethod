"use client";

import { openCookiePreferences } from "@/lib/consent";

/** Footer link that reopens the cookie preferences panel. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookiePreferences} className={className}>
      Cookie preferences
    </button>
  );
}
