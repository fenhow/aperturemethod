"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * The thank-you panel shown after the Reality Check breakdown is emailed, which
 * then moves the reader on to Pricing.
 *
 * WHY A COUNTDOWN RATHER THAN AN IMMEDIATE REDIRECT. The results screen holds
 * their score, their gaps and their named blind spot, and the quiz keeps that
 * state in memory only: navigate away and it is gone, with no way back short of
 * retaking all fifteen questions. Sending them straight to Pricing the instant
 * they hand over an email address would read as a bait and switch on the one
 * page where trust has just been earned. The countdown does the same job
 * without the ambush: it is visible, it is short, and it can be stopped.
 *
 * The escape hatch is deliberate and cheap. Almost nobody takes it, and the few
 * who do are people who wanted to screenshot their result, which is a thing
 * worth letting them do. Everyone who does nothing still lands on Pricing.
 *
 * The full breakdown is already in their inbox by this point, so the on-screen
 * result is a convenience rather than the deliverable.
 */

const SECONDS = 6;
const DESTINATION = "/pricing";

export function ThankYouRedirect({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [left, setLeft] = useState(SECONDS);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Warm the destination while they read, so the move feels instant.
  useEffect(() => {
    router.prefetch(DESTINATION);
  }, [router]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const tick = setInterval(() => setLeft((n) => n - 1), 1000);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearInterval(tick);
    };
  }, [open]);

  useEffect(() => {
    if (open && left <= 0) router.push(DESTINATION);
  }, [open, left, router]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[130] flex items-end justify-center bg-ink/50 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rc-thanks-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-lg bg-paper p-7 shadow-xl outline-none sm:rounded-lg sm:p-9"
      >
        <p className="eyebrow mb-3">The Reality Check</p>
        <h2 id="rc-thanks-title" className="text-h3 font-semibold text-ink">
          Thank you. It is on its way.
        </h2>
        <p className="mt-3 text-body text-muted">
          Your written breakdown is heading to{" "}
          <span className="font-semibold text-ink">{email}</span>, with every question, your answer,
          and a reference explaining the measure behind each one. If it is not there shortly, check
          your spam or promotions folder.
        </p>
        <p className="mt-4 text-body text-body">
          While you wait, here is what the work costs. Every fee is published, fixed, and agreed
          before anything starts.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={DESTINATION} className="btn w-full justify-center sm:w-auto sm:px-7">
            See pricing now
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-caption font-semibold text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Stay on my results
          </button>
        </div>

        <p className="mt-5 text-caption text-muted" aria-live="polite">
          Taking you to pricing in {Math.max(left, 0)}
          {Math.max(left, 0) === 1 ? " second" : " seconds"}.
        </p>
      </div>
    </div>,
    document.body
  );
}
