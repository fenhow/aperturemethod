"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { CONSENT_EVENT } from "@/lib/consent";

/**
 * First-visit welcome pop-up. Appears once per visitor a few seconds after
 * landing, gives a one-line value proposition and a single low-risk next step,
 * and is easy to dismiss. Remembers dismissal so it never nags. Waits until the
 * cookie-consent choice is made so the two never stack.
 */

const SEEN_KEY = "aperture-welcome-v1";
const CONSENT_KEY = "am_cookie_consent_v1";

export function WelcomePopup({ delayMs = 6000 }: { delayMs?: number }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = reduce ? 1200 : delayMs;
    let showTimer = 0;
    let fallback = 0;
    const show = (ms: number) => {
      showTimer = window.setTimeout(() => setOpen(true), ms);
    };
    const consentResolved = () => {
      try {
        return !!window.localStorage.getItem(CONSENT_KEY);
      } catch {
        return true;
      }
    };

    const onConsent = () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      window.clearTimeout(fallback);
      show(reduce ? 600 : 1200);
    };

    if (consentResolved()) {
      show(base);
    } else {
      // Wait for the cookie choice; fall back so it still shows if ignored.
      window.addEventListener(CONSENT_EVENT, onConsent);
      fallback = window.setTimeout(() => {
        window.removeEventListener(CONSENT_EVENT, onConsent);
        show(base);
      }, 14000);
    }

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(fallback);
      window.removeEventListener(CONSENT_EVENT, onConsent);
    };
  }, [delayMs]);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
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

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={dismiss}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-paper shadow-card animate-fade-up">
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          ✕
        </button>

        <div className="p-8 sm:p-9">
          <Image
            src="/logo-icon-black.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9"
          />
          <p className="eyebrow mt-5">Welcome to Aperture</p>
          <h2 id="welcome-title" className="mt-2 text-h3 font-semibold text-ink">
            New here? Start with the big picture.
          </h2>
          <p className="mt-3 text-body text-muted">
            Aperture brings big-company intelligence — MBA-grade strategy plus market mapping — to
            owner-run businesses. The simplest way in is a fixed-fee <span className="font-semibold text-ink">Business X-Ray</span> that
            names your #1 constraint and shows where to grow.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Link href="/#how-it-works" onClick={dismiss} className="btn w-full text-center">
              See how it works →
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="text-small font-medium text-muted transition-colors hover:text-ink"
            >
              No thanks, I&apos;ll look around
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
