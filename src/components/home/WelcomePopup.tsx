"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CONSENT_EVENT } from "@/lib/consent";

/**
 * "The Big Picture": a first-visit welcome pop-up plus a persistent floating
 * button that reopens it from anywhere on the site.
 *
 * - Auto-opens once per visitor, a few seconds after landing, and only after
 *   the cookie-consent choice is made (so the two never stack).
 * - The floating "Big Picture" button is always available while browsing and
 *   reopens the panel on demand, even after it's been dismissed.
 */

const SEEN_KEY = "aperture-welcome-v1";
const CONSENT_KEY = "am_cookie_consent_v1";

/**
 * Pages where the visitor is part-way through something. Interrupting a quiz
 * or a form with a modal is how you lose the submission: the pop-up never
 * auto-opens here. The floating "Big Picture" button still does.
 */
const NO_AUTO_OPEN = ["/reality-check", "/onboarding", "/contact", "/portal", "/admin", "/method-lab"];

export function WelcomePopup({ delayMs = 4000 }: { delayMs?: number }) {
  const pathname = usePathname();
  const suppressed = NO_AUTO_OPEN.some((p) => pathname === p || pathname?.startsWith(`${p}/`));
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [consentReady, setConsentReady] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Mount + wait for the cookie-consent choice before doing anything visible.
  useEffect(() => {
    setMounted(true);
    const resolved = () => {
      try {
        return !!window.localStorage.getItem(CONSENT_KEY);
      } catch {
        return true;
      }
    };
    if (resolved()) {
      setConsentReady(true);
      return;
    }
    const onConsent = () => setConsentReady(true);
    window.addEventListener(CONSENT_EVENT, onConsent);
    const fb = window.setTimeout(() => setConsentReady(true), 14000);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      window.clearTimeout(fb);
    };
  }, []);

  // Auto-open once per visitor after consent is ready.
  useEffect(() => {
    if (!consentReady || suppressed) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setOpen(true), reduce ? 1200 : delayMs);
    return () => window.clearTimeout(t);
  }, [consentReady, delayMs, suppressed]);

  // Escape + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!mounted) return null;

  return (
    <>
      {/* Floating "Big Picture" button, always available while browsing */}
      {consentReady && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label="Open the big picture: what Aperture is"
          className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-maroon py-3 pl-3.5 pr-4 text-paper shadow-[0_10px_30px_-8px_rgba(80,0,0,0.5)] ring-1 ring-white/10 transition-colors hover:bg-maroon-hover"
        >
          <Image
            src="/logo-icon-white.png"
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
          <span className="text-small font-semibold">Big Picture</span>
        </button>
      )}

      {/* The panel */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade"
            />
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/40 bg-paper/80 shadow-card backdrop-blur-xl animate-fade-up">
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                ✕
              </button>

              <div className="p-8 sm:p-9">
                <Image src="/logo-icon-black.png" alt="" width={40} height={40} className="h-9 w-9" />
                <p className="eyebrow mt-5">Welcome to Aperture</p>
                <h2 id="welcome-title" className="mt-2 text-h3 font-semibold text-ink">
                  The big picture in 20 seconds.
                </h2>
                <p className="mt-3 text-body text-muted">
                  Aperture brings big-company intelligence, MBA-grade strategy plus market mapping
                  to owner-run businesses. The simplest way in is a fixed-fee{" "}
                  <span className="font-semibold text-ink">Business X-Ray</span> that names your #1
                  constraint and shows where to grow.
                </p>

                <div className="mt-7 flex flex-col gap-3">
                  <Link href="/#how-it-works" onClick={close} className="btn w-full text-center">
                    See how it works →
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="text-small font-medium text-muted transition-colors hover:text-ink"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
