"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { GdpRunRate } from "@/components/market/GdpRunRate";
import { Citation } from "@/components/market/Citation";
import { primaryCta } from "@/lib/site";

/**
 * The spoken pitch, on demand.
 *
 * Deliberately not an interrupting pop-up. It opens on a click and nothing
 * else: no timer, no first-visit auto-open, no second floating button
 * competing with the creator mark that already sits on every page. A reader
 * who clicks "the 30-second version" has asked the question, which is the only
 * condition under which a panel like this is welcome.
 *
 * The run-rate counter leads because the hero already claims 43.5% of US GDP
 * comes from small business. The pill states the share; this answers "so
 * what", in the currency the claim is made in, and then the pitch follows.
 */
export function ThirtySeconds({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Escape, scroll lock, and focus handling while the panel is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
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

  // Send focus back where it came from, so a keyboard reader is not dropped at
  // the top of the document when the panel closes.
  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={
          "group inline-flex items-center gap-2 text-small font-semibold text-maroon transition-colors hover:text-maroon-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon " +
          (className ?? "")
        }
      >
        Hear the 30-second version
        <span
          className="transition-transform duration-fast group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          &rarr;
        </span>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="thirty-seconds-title"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade"
            />
            <div className="relative z-10 max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-line bg-paper shadow-card animate-fade-up">
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                &#10005;
              </button>

              {/* The counter, and the honest label under it */}
              <div className="border-b border-line bg-surface px-8 pb-7 pt-8 sm:px-9">
                <Image
                  src="/logo-icon-black.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <div className="mt-5">
                  <GdpRunRate />
                </div>
                <p className="mt-3 text-small text-muted">
                  A run rate, not a live reading. US GDP was $32.5 trillion at an annual rate in
                  the second quarter of 2026; 43.5% of it comes from small business. We divided.
                </p>
              </div>

              {/* The pitch */}
              <div className="px-8 py-8 sm:px-9">
                <p className="eyebrow">In 30 seconds</p>
                <h2 id="thirty-seconds-title" className="mt-2 text-h3 font-semibold text-ink">
                  That is the economy nobody is analysing.
                </h2>

                <p className="mt-4 text-base text-body">
                  Every consultant says they&rsquo;ll help you grow. We say something more
                  specific: we apply graduate-level analytics, spatial intelligence and real
                  market data to show an owner exactly where their profit comes from, and where
                  the next opportunity actually is.
                </p>
                <p className="mt-4 text-base text-body">
                  It runs in five steps.{" "}
                  <span className="font-semibold text-ink">Understand</span> the business and name
                  the one constraint holding it back.{" "}
                  <span className="font-semibold text-ink">Quantify</span> it, so you know why.{" "}
                  <span className="font-semibold text-ink">Reveal</span> what your customers and
                  your market are telling you.{" "}
                  <span className="font-semibold text-ink">Navigate</span> to the few moves that
                  matter. <span className="font-semibold text-ink">Perform</span>, with a
                  scoreboard that keeps it alive after the report is delivered.
                </p>
                <p className="mt-4 text-base text-body">
                  You start small, with a fixed-fee Business X-Ray&trade;. No leap of faith.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link href={primaryCta.href} onClick={close} className="btn">
                    {primaryCta.label}
                  </Link>
                  <Link
                    href="/#how-it-works"
                    onClick={close}
                    className="text-small font-semibold text-maroon transition-colors hover:text-maroon-hover"
                  >
                    See how it works &rarr;
                  </Link>
                </div>

                <div className="mt-7 border-t border-line pt-5">
                  <Citation figures={["gdp", "shareOfGdp"]} />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
