"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { RCExplainer } from "@/lib/realityCheck";

/**
 * The teaching panel behind a Reality Check question.
 *
 * Two modes, and the difference between them is the whole point:
 *
 *   BRIEF (on the question, `withReading` false). Defines the metric and gives
 *   the arithmetic. It does NOT say what a good number looks like, because an
 *   owner reading it is one click away from choosing an answer, and a Clarity
 *   Score that can be coached upward stops being a mirror.
 *
 *   FULL (on the results screen, `withReading` true). Adds what the number
 *   actually tells you. By then the answer is locked, so the interpretation can
 *   be given straight, and this is the moment the reader is most receptive to
 *   it: they have just been shown a gap and want to know what it means.
 *
 * Portalled to the body rather than rendered in place. The quiz card sits
 * inside animated wrappers that use transforms, and a transform creates a
 * stacking context, so a fixed overlay rendered inside one cannot rise above
 * the sticky header at any z-index. Same fix as AnalysisCards.
 */
export function MetricExplainer({
  explainer,
  withReading = false,
  label,
  className,
}: {
  explainer: RCExplainer;
  withReading?: boolean;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Return focus to where it came from, so a keyboard user is not dropped at
  // the top of the document when the panel closes.
  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  const beats: { h: string; p: string }[] = [
    { h: "What it is", p: explainer.what },
    { h: "How it is calculated", p: explainer.how },
    ...(withReading ? [{ h: "What the number tells you", p: explainer.reading }] : []),
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={
          className ??
          "inline-flex items-center gap-1.5 text-caption font-semibold text-maroon transition-colors hover:text-ink"
        }
      >
        <span
          aria-hidden="true"
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px] leading-none"
        >
          ?
        </span>
        {label ?? "What is this?"}
      </button>

      {open && mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/40 backdrop-blur-[2px] sm:items-center sm:p-6"
            onClick={close}
          >
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={explainer.metric}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-lg bg-paper p-6 shadow-xl outline-none sm:rounded-lg sm:p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow mb-2">The metric behind it</p>
                  <h3 className="text-h4 font-semibold text-ink">{explainer.metric}</h3>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-2xl font-light leading-none text-muted transition-colors hover:text-ink"
                >
                  &times;
                </button>
              </div>

              <dl className="mt-6 space-y-5">
                {beats.map((b) => (
                  <div key={b.h}>
                    <dt className="text-caption font-semibold uppercase tracking-overline text-maroon">
                      {b.h}
                    </dt>
                    <dd className="mt-1.5 text-body text-body">{b.p}</dd>
                  </div>
                ))}
              </dl>

              {!withReading ? (
                <p className="mt-6 border-t border-line pt-4 text-caption text-muted">
                  What a strong or weak number means is held back until your result, so that
                  reading this does not change the answer you give.
                </p>
              ) : null}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
