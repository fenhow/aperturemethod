"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductName } from "@/components/brand/ProductName";
import { methodPhases } from "@/lib/content";

/**
 * "Under the hood" depth layer: the named frameworks applied in each of the
 * five phases. Hovering (or tapping / focusing) a chip reveals a plain-language
 * note on what that technique does for the client. Proof of MBA-level rigor,
 * kept below the plain-language narrative.
 *
 * The list uses a divided (not overflow-clipped) container so popovers can
 * extend past it; the row with an open popover is lifted in the stack so its
 * note sits above the rows beneath it.
 */
export function MethodFrameworks() {
  const [open, setOpen] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <Section tone="surface">
      <Reveal className="max-w-measure">
        <SectionHeading
          eyebrow="Under the hood"
          title="The frameworks behind the Method."
          lede="The same business science big-company strategy teams use, applied, in plain language, to your business. Hover any technique to see what it does for you."
        />
      </Reveal>

      <div ref={rootRef} className="mt-12 divide-y divide-line rounded-lg border border-line bg-paper">
        {methodPhases.map((p) => (
          <Reveal key={p.n} className={open?.startsWith(`${p.n}-`) ? "relative z-30" : "relative"}>
            <div className="grid gap-5 p-6 md:grid-cols-[1fr_2fr] md:gap-10 md:p-8">
              <div>
                <p className="eyebrow">{p.verb}</p>
                <div className="mt-2">
                  <ProductName short={p.short} tone="light" />
                </div>
                <p className="mt-2 text-small text-muted">{p.question}</p>
              </div>
              <div className="flex flex-wrap gap-2 self-center">
                {p.frameworks.map((f) => {
                  const key = `${p.n}-${f.name}`;
                  const isOpen = open === key;
                  return (
                    <span key={f.name} className="relative">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onMouseEnter={() => setOpen(key)}
                        onMouseLeave={() => setOpen((cur) => (cur === key ? null : cur))}
                        onFocus={() => setOpen(key)}
                        onBlur={() => setOpen((cur) => (cur === key ? null : cur))}
                        onClick={() => setOpen((cur) => (cur === key ? null : key))}
                        className={`rounded-full border px-3 py-1.5 text-small font-medium transition-colors duration-150 ${
                          isOpen
                            ? "border-maroon bg-maroon text-paper"
                            : "border-line bg-surface text-body hover:border-maroon/50 hover:text-maroon"
                        }`}
                      >
                        {f.name}
                      </button>
                      {isOpen && (
                        <span
                          role="tooltip"
                          className="pointer-events-none absolute left-0 top-full z-40 mt-2 block w-64 rounded-lg border border-line bg-paper p-4 text-left shadow-card"
                        >
                          <span className="block text-small font-semibold text-ink">{f.name}</span>
                          <span className="mt-1 block text-small leading-relaxed text-muted">
                            {f.what}
                          </span>
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 max-w-measure text-small italic text-muted">
        You don&apos;t need to know these by name. That&apos;s our job. They run quietly underneath
        the plain-language work you actually see.
      </p>
    </Section>
  );
}
