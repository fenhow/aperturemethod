"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MethodNote } from "@/lib/realityStudyMethod";

/**
 * The "?" beside a statistic: how that number is worked out.
 *
 * Same shape as the Clarity Check's MetricExplainer, kept separate because it
 * carries method notes rather than teaching copy, and because the study
 * dashboard should be able to change one without disturbing the other.
 *
 * Portalled to the body: the cards sit inside a sticky, transformed layout, and
 * a transform creates a stacking context a fixed overlay cannot escape.
 */
export function StatNote({ title, note }: { title: string; note: MethodNote }) {
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
        aria-label={`How ${title} is calculated`}
        className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-maroon text-[11px] font-semibold leading-none text-maroon transition-colors hover:bg-maroon hover:text-paper"
      >
        ?
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
              aria-label={`How ${title} is calculated`}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-lg bg-paper p-6 shadow-xl outline-none sm:rounded-lg sm:p-8"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow mb-2">How this is calculated</p>
                  <h3 className="text-h4 font-semibold text-ink">{title}</h3>
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
                {note.map((b) => (
                  <div key={b.h}>
                    <dt className="text-caption font-semibold uppercase tracking-overline text-maroon">
                      {b.h}
                    </dt>
                    <dd className="mt-1.5 text-body text-body">{b.p}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
