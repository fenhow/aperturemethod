"use client";

import { useRef, useState } from "react";
import { methodPhases } from "@/lib/content";
import { ProductName } from "@/components/brand/ProductName";
import { cn } from "@/lib/utils";

/**
 * Interactive "Method Explorer" (Step 7). An accessible tabs widget: select a
 * phase to reveal its purpose, deliverable, and the decision it supports.
 * Full keyboard support (roving tabindex, Arrow/Home/End). Restrained motion.
 * The continuous platform band sits beneath.
 */
export function MethodExplorer() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const last = methodPhases.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  };

  const phase = methodPhases[active]!;

  return (
    <div>
      <div
        role="tablist"
        aria-label="The five phases of The Aperture Method"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-5"
      >
        {methodPhases.map((ph, i) => (
          <button
            key={ph.n}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`method-tab-${i}`}
            aria-selected={i === active}
            aria-controls="method-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "-mt-px border-t-2 px-1 py-5 text-left transition-colors duration-fast",
              i === active ? "border-maroon" : "border-transparent hover:bg-surface"
            )}
          >
            <span className={cn("text-[15px] font-semibold tracking-wide", i === active ? "text-maroon" : "text-muted")}>
              {ph.n}
            </span>
            <span className="mt-2 block text-h4 font-semibold text-ink">
              <ProductName short={ph.short} tone="light" />
            </span>
            <span className="mt-1 block text-small text-muted">{ph.verb}</span>
          </button>
        ))}
      </div>

      <div
        id="method-panel"
        role="tabpanel"
        aria-labelledby={`method-tab-${active}`}
        className="border-t border-line pt-8"
      >
        <p key={`q-${active}`} className="eyebrow mb-3 text-maroon motion-safe:animate-fade">
          {phase.verb} · &ldquo;{phase.question}&rdquo;
        </p>
        <p key={`p-${active}`} className="max-w-3xl text-h3 font-medium text-ink motion-safe:animate-fade-up">
          {phase.heading}
        </p>
        <p key={`desc-${active}`} className="mt-5 max-w-3xl text-body-lg text-body motion-safe:animate-fade">
          {phase.description}
        </p>
        <div key={`d-${active}`} className="mt-8 max-w-3xl motion-safe:animate-fade">
          <p className="eyebrow mb-2">What you get</p>
          <p className="text-body-lg font-medium text-ink">{phase.deliverable}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-1 rounded bg-dark px-6 py-4 text-paper sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center text-[15px] font-semibold">
          <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-maroon-soft" aria-hidden="true" />
          Aperture platform — the intelligence you keep
        </span>
        <span className="text-small text-white/50">
          Runs beneath all five phases · yours after the engagement
        </span>
      </div>
    </div>
  );
}
