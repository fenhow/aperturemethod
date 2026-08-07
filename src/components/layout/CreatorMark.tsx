"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CONSENT_EVENT } from "@/lib/consent";

/**
 * The creator mark — a persistent floating pill carrying Fenwick's signature,
 * linking to /who-its-for.
 *
 * Replaces the former "Big Picture" floating button in the same slot, so the
 * site never shows two pieces of floating furniture at once.
 *
 * Like the button it replaces, it waits for the cookie-consent choice before
 * appearing: the consent bar is full-width at the bottom of the viewport, so
 * showing both at once would stack them.
 */

const CONSENT_KEY = "am_cookie_consent_v1";

/** Pages where the mark is noise: the page it links to, and the signed-in and
 *  part-way-through-a-form areas. */
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
      aria-label="Created by Fenwick How — see who the Aperture Method is for"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-ink/95 py-2 pl-4 pr-3.5 shadow-[0_12px_34px_-8px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-colors hover:border-white/45 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon sm:gap-3 sm:pl-5 sm:pr-4"
    >
      <Image
        src="/fenwick-signature-white.png"
        alt=""
        width={600}
        height={189}
        className="h-[26px] w-auto opacity-95 sm:h-[32px]"
        priority={false}
      />
      <span className="h-5 w-px bg-white/25" aria-hidden="true" />
      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-paper/85 transition-colors group-hover:text-paper sm:text-[11px]">
        Who it&rsquo;s for
        <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5" aria-hidden="true">
          &rarr;
        </span>
      </span>
    </Link>
  );
}
