"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * The anonymity promise for the Clarity Check.
 *
 * Deliberately NOT a modal that opens by itself. A privacy dialog nobody asked
 * for reads like a consent gate and gets dismissed unread, and volunteering a
 * warning loudly can make a calm thing sound alarming. So: one confident line
 * in view, and the full answer one click away for the people who actually
 * worry, who are the ones who will read it properly.
 *
 * Every claim below is what the code does. The stored row carries the answers,
 * the score, the timings and the optional size / industry / region profile, and
 * nothing else — no name, email, company or IP. If that ever changes, this file
 * changes first.
 */

export function AnonymityPromise({ study = false }: { study?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-8 max-w-xl rounded-lg border border-line bg-surface p-5">
      <p className="text-small text-body">
        <strong className="font-semibold text-ink">This is anonymous.</strong> No name, email,
        company or IP address is stored with your answers, and there is no sign-in — so there is
        nothing for an answer to be attached to.
      </p>
      {/* Maroon and underlined: as a bare .link-arrow this read as a heading
          and nobody clicked it. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-maroon underline underline-offset-4 transition-colors hover:text-maroon-hover"
      >
        How we keep this anonymous
        <span aria-hidden="true">&rarr;</span>
      </button>
      <AnonymityDialog open={open} onClose={() => setOpen(false)} study={study} />
    </div>
  );
}

/** The same promise, one line, for places deeper in the flow where the intro is
 *  long behind them: the question screens and the breakdown form. */
export function AnonymityLine({ className = "", study = false }: { className?: string; study?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <p className={`text-small text-muted ${className}`}>
        Still anonymous: nothing you have selected is attached to you or your business.{" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-semibold text-maroon underline-offset-4 hover:underline"
        >
          How that works
        </button>
      </p>
      <AnonymityDialog open={open} onClose={() => setOpen(false)} study={study} />
    </>
  );
}

function AnonymityDialog({
  open,
  onClose,
  study = false,
}: {
  open: boolean;
  onClose: () => void;
  study?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const point = (title: string, body: React.ReactNode) => (
    <div>
      <p className="text-small font-semibold text-ink">{title}</p>
      <p className="mt-1 text-small text-body">{body}</p>
    </div>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="anon-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-dark/70 backdrop-blur-[2px]"
      />
      <div className="relative max-h-[86vh] w-full max-w-[30rem] overflow-y-auto overscroll-contain rounded-lg border border-line bg-paper shadow-2xl">
        <div className="sticky top-0 h-1 w-full bg-maroon" aria-hidden="true" />
        <div className="p-6">
          <p className="eyebrow">Your privacy</p>
          <h2 id="anon-title" className="mt-3 text-balance text-h4 font-semibold leading-tight text-ink">
            Nobody finds out how you answered.
          </h2>
          <div className="mt-5 space-y-4 text-pretty">
            {point(
              "There is nothing to attach an answer to",
              "No name, no email, no company, no IP address is stored with your answers. There is no account and no sign-in."
            )}
            {point(
              "What we keep",
              "The answers, the score and how long it took — in one pile with everyone else's. It tells us which questions owners find hard, which is how the questions get better."
            )}
            {point(
              "What nobody can be told",
              "Not your bank, not your accountant, not anyone at your company. We could not tell them if we wanted to, because we do not know who answered."
            )}
            {study
              ? point(
                  "How the research reports it",
                  "Only as totals across all the businesses taking part. No single response is shown to anyone, quoted, or shared with a client, a sponsor or the university."
                )
              : null}
            {point(
              "The one exception, and it is yours to choose",
              study
                ? "If you ask for the benchmark report, your email is kept on its own list with no link to any response — not even a hidden one. Asking for the written breakdown of your own score works the same way: it is emailed to you, never joined to the anonymous record."
                : "If you ask for the written breakdown at the end, you give a name and email so it can be sent to you. That travels by email and is never joined to the anonymous record."
            )}
          </div>
          <p className="mt-5 border-l-2 border-maroon pl-3 text-small font-semibold text-ink">
            Fenwick How · The Aperture Method
          </p>
          <div className="mt-6">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="btn px-5 py-2.5 text-small"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
