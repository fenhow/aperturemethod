"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The "analysis behind it" grid on a landing page.
 *
 * Each card opens a panel explaining the technique in three fixed beats: what it
 * is, what it tells you, and why it matters. The three beats are fixed on
 * purpose. An owner reading fourteen of these needs the same shape every time,
 * and the third beat is the one that earns the fee.
 *
 * The cards are buttons and are styled to look like it. An earlier version of
 * this page shipped hairline outline buttons that nobody could see; see the
 * standing rule in the design system about affordance on light backgrounds.
 */
export type AnalysisCard = {
  label: string;
  note?: string;
  what?: string;
  tells?: string;
  matters?: string;
  applies?: Applies;
};

type Applies = "adapted" | "critical";

const APPLIES: Record<Applies, { chip: string; line: string }> = {
  adapted: {
    chip: "Adapted for private companies",
    line: "This one changes shape when there is no share price and fewer disclosures. It is adapted rather than skipped, and the report says which parts were and were not available.",
  },
  critical: {
    chip: "Matters more when owner-run",
    line: "This matters more in an owner-run business than in a listed one, because reported earnings reflect the owner's tax position as much as the cost of running the business.",
  },
};

export function AnalysisCards({ heading, cards }: { heading: string; cards: AnalysisCard[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const active = open === null ? null : cards[open];
  const lastFocused = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // The grid sits inside a Reveal, which animates with a transform. A transform
  // creates a stacking context, so a fixed overlay rendered inside it cannot
  // rise above the sticky header no matter what z-index it is given. Portal the
  // dialog to the body, where it is nobody's child.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (active == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      lastFocused.current?.focus();
    };
  }, [active]);

  return (
    <>
      <h3 className="eyebrow mb-4">{heading}</h3>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const detailed = Boolean(card.what);
          const badge = card.applies ? APPLIES[card.applies] : null;
          return (
            <li key={card.label} className="contents">
              <button
                type="button"
                disabled={!detailed}
                aria-haspopup="dialog"
                onClick={(e) => {
                  lastFocused.current = e.currentTarget;
                  setOpen(i);
                }}
                className="group flex h-full flex-col rounded-lg border border-line bg-paper p-5 text-left transition-all duration-fast enabled:hover:-translate-y-0.5 enabled:hover:border-maroon enabled:hover:shadow-[0_10px_24px_-14px_rgba(80,0,0,0.5)] disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
              >
                <span className="text-small font-semibold tabular-nums text-maroon">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-body font-semibold text-ink">{card.label}</p>
                {card.note && <p className="mt-1.5 flex-1 text-small text-muted">{card.note}</p>}
                {badge && (
                  <span className="mt-3 inline-flex w-fit rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                    {badge.chip}
                  </span>
                )}
                {detailed && (
                  <span className="mt-3 text-small font-semibold text-maroon">
                    What this is{" "}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-fast group-hover:translate-x-0.5"
                    >
                      &rarr;
                    </span>
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <p className="mt-5 max-w-measure text-small text-muted">
        Not every technique applies to every business. Some need disclosures a private company does not
        publish, and some matter far more when the owner is also the payroll. The report says which ones
        were run, which were adapted, and which were not possible, rather than quietly leaving a gap.
      </p>

      {active && mounted && createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
          onClick={() => setOpen(null)}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.label}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-lg bg-paper p-6 shadow-xl outline-none sm:rounded-lg sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-2">The analysis behind it</p>
                <h4 className="text-h3 font-semibold text-ink">{active.label}</h4>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close"
                className="shrink-0 rounded-sm p-1 text-muted transition-colors hover:text-ink"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <dl className="mt-6 space-y-5">
              {[
                ["What it is", active.what],
                ["What it tells you", active.tells],
                ["Why it matters", active.matters],
              ].map(([term, def]) =>
                def ? (
                  <div key={term as string}>
                    <dt className="text-small font-semibold uppercase tracking-[0.08em] text-maroon">{term}</dt>
                    <dd className="mt-1.5 text-body text-body">{def}</dd>
                  </div>
                ) : null
              )}
            </dl>

            {active.applies && (
              <p className="mt-6 border-l-2 border-maroon bg-surface py-3 pl-4 pr-3 text-small text-body">
                <span className="font-semibold">{APPLIES[active.applies].chip}.</span>{" "}
                {APPLIES[active.applies].line}
              </p>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
