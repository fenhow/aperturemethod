"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * A trigger + full-screen popup for viewing a PDF document in-app. The visitor
 * can page through the document full screen without leaving the site, with an
 * "open in a new tab" fallback for downloading or printing.
 */
export function DocumentLightbox({
  href,
  title,
  triggerLabel,
  triggerClassName,
  triggerIcon = true,
}: {
  href: string;
  title: string;
  triggerLabel: React.ReactNode;
  triggerClassName?: string;
  triggerIcon?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={triggerClassName}>
        {triggerIcon && (
          <svg
            className="h-4 w-4 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        )}
        {triggerLabel}
      </button>
      {open && <Viewer href={href} title={title} onClose={() => setOpen(false)} />}
    </>
  );
}

function Viewer({ href, title, onClose }: { href: string; title: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Capture phase + stopImmediatePropagation so Escape closes only this
    // viewer, leaving any modal beneath it (e.g. a deliverable popup) open.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex flex-col bg-ink/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 text-paper sm:px-6">
        <p className="min-w-0 flex-1 truncate text-small font-semibold text-paper">{title}</p>
        <div className="flex items-center gap-2">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-white/25 px-3 py-1.5 text-small font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            Open in new tab
            <span aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close document"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 text-paper transition-colors hover:bg-white/10"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 px-2 pb-2 sm:px-4 sm:pb-4">
        <iframe
          src={`${href}#view=FitH`}
          title={title}
          className="h-full w-full rounded-lg border border-white/10 bg-white"
        />
      </div>
    </div>,
    document.body
  );
}
