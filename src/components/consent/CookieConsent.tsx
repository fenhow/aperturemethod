"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  applyConsent,
  readConsent,
  setDefaultConsent,
  writeConsent,
  OPEN_PREFERENCES_EVENT,
} from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * Cookie consent banner (Consent Mode v2). Appears on first visit pinned to the
 * bottom; blocks analytics/marketing until the visitor chooses. "Manage" reveals
 * per-category toggles. The choice persists and can be reopened from the footer.
 * Non-modal so it never blocks reading the site or the Cookie Policy.
 */

const CATEGORIES: { key: "functional" | "analytics" | "marketing"; label: string; desc: string }[] = [
  {
    key: "functional",
    label: "Functional",
    desc: "Remembers preferences so the site behaves the way you expect.",
  },
  {
    key: "analytics",
    label: "Analytics",
    desc: "Helps us understand, in aggregate, how the site is used.",
  },
  {
    key: "marketing",
    label: "Marketing",
    desc: "Supports advertising and campaign measurement. Not currently in use.",
  },
];

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [prefs, setPrefs] = useState({ functional: true, analytics: false, marketing: false });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDefaultConsent();
    const existing = readConsent();
    if (existing) {
      applyConsent(existing);
    } else {
      setOpen(true);
    }

    const onOpen = () => {
      const c = readConsent();
      setPrefs({
        functional: c?.functional ?? true,
        analytics: c?.analytics ?? false,
        marketing: c?.marketing ?? false,
      });
      setManage(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open, manage]);

  function decide(choice: { functional: boolean; analytics: boolean; marketing: boolean }) {
    writeConsent(choice);
    setOpen(false);
    setManage(false);
  }

  if (!open) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Cookie consent"
      tabIndex={-1}
      className="fixed inset-x-0 bottom-0 z-[90] p-3 focus:outline-none sm:p-6 motion-safe:animate-fade-up"
    >
      {/*
       * Sized down hard on phones. At full desktop weight this panel covered
       * ~70% of an iPhone SE screen and sat on top of the page's primary
       * button — the first thing a mobile visitor saw was a consent wall.
       */}
      <div className="mx-auto max-w-3xl rounded-lg border border-line bg-paper p-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] sm:p-8">
        <h2 className="text-body-lg font-semibold text-ink sm:text-h4">
          Cookies help us improve your experience.
        </h2>
        <p className="mt-2 text-small leading-relaxed text-muted sm:mt-3">
          We use only what we need to run the site, and we ask before setting anything else.
          <span className="hidden sm:inline">
            {" "}
            You can accept, decline non-essential cookies, or choose by category.
          </span>{" "}
          Read our{" "}
          <Link href="/cookies" className="link-inline">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="link-inline">
            Privacy Policy
          </Link>
          .
        </p>

        {manage && (
          <div className="mt-6 space-y-4 border-t border-line pt-6">
            {/* Strictly necessary — always on */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-small font-semibold text-ink">Strictly necessary</p>
                <p className="mt-0.5 text-small text-muted">
                  Required for the site to work. Always on.
                </p>
              </div>
              <span className="mt-0.5 shrink-0 text-small font-medium text-muted">Always on</span>
            </div>

            {CATEGORIES.map((cat) => (
              <label key={cat.key} className="flex cursor-pointer items-start justify-between gap-4">
                <span>
                  <span className="block text-small font-semibold text-ink">{cat.label}</span>
                  <span className="mt-0.5 block text-small text-muted">{cat.desc}</span>
                </span>
                <input
                  type="checkbox"
                  checked={prefs[cat.key]}
                  onChange={(e) => setPrefs((p) => ({ ...p, [cat.key]: e.target.checked }))}
                  className="mt-1 h-4 w-4 shrink-0 rounded-sm border-line text-maroon focus:ring-maroon"
                />
              </label>
            ))}
          </div>
        )}

        <div
          className={cn(
            "mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center",
            manage ? "sm:justify-end" : "sm:justify-between"
          )}
        >
          {!manage ? (
            <>
              <button
                type="button"
                onClick={() => setManage(true)}
                className="order-3 text-small font-semibold text-ink underline decoration-1 underline-offset-2 transition-colors hover:text-maroon sm:order-1"
              >
                Manage preferences
              </button>
              {/* Side by side on phones — stacking them cost two full rows. */}
              <div className="flex flex-row gap-3 sm:order-2">
                <button
                  type="button"
                  onClick={() => decide({ functional: false, analytics: false, marketing: false })}
                  className="btn--secondary flex-1 justify-center sm:flex-none"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => decide({ functional: true, analytics: true, marketing: true })}
                  className="btn flex-1 justify-center sm:flex-none"
                >
                  Accept all
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => decide({ functional: false, analytics: false, marketing: false })}
                className="btn--secondary"
              >
                Decline all
              </button>
              <button type="button" onClick={() => decide(prefs)} className="btn">
                Save preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
