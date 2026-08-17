"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CONSENT_EVENT } from "@/lib/consent";

/**
 * The persistent self-qualification CTA, a floating maroon pill on every
 * public page, linking to /who-its-for.
 *
 * Occupies the slot the former "Big Picture" button used, so the site never
 * shows two pieces of floating furniture at once.
 *
 * Waits for the cookie-consent choice before appearing: the consent bar is
 * full-width at the bottom of the viewport, so showing both at once stacks
 * them and makes this unclickable.
 */

const CONSENT_KEY = "am_cookie_consent_v1";

/** Everywhere except where it would be noise: the page it already links to,
 *  and the signed-in / mid-form areas where the visitor is a client, not a
 *  prospect. (/method-lab is served outside this layout and never sees it.) */
const HIDDEN_ON = ["/who-its-for", "/portal", "/admin", "/onboarding", "/method-lab"];

export function CreatorMark() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolved = () => {
      try {
        return !!window.localStorage.getItem(CONSENT_KEY);
      } catch {
        return true;
      }
    };
    if (resolved()) {
      setReady(true);
      return;
    }
    const onConsent = () => setReady(true);
    window.addEventListener(CONSENT_EVENT, onConsent);
    const fallback = window.setTimeout(() => setReady(true), 14000);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      window.clearTimeout(fallback);
    };
  }, []);

  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname?.startsWith(`${p}/`));
  if (!ready || hidden) return null;

  return (
    <Link
      href="/who-its-for"
      aria-label="Is the Aperture Method for me? See who it's for"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-maroon py-3 pl-5 pr-4 text-paper shadow-[0_10px_30px_-8px_rgba(80,0,0,0.55)] ring-1 ring-white/10 transition-colors hover:bg-maroon-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
    >
      <span className="whitespace-nowrap text-small font-semibold">Is this for me?</span>
      <span
        className="inline-block transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        &rarr;
      </span>
    </Link>
  );
}
