"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { DocumentLightbox } from "@/components/ui/DocumentLightbox";
import { deliverables, type Deliverable } from "@/lib/deliverables";

const EXAMPLE_REPORT = "/reports/Lumina-Aperture-Method-Example-Report.pdf";

/**
 * Interactive deliverables index. Each card opens a quick-look modal that
 * previews the deliverable (what it is / how we get it / what's inside) without
 * leaving the page, plus a link through to its full detail page.
 */

// Group deliverables by the component that produces them, preserving order.
const groups = deliverables.reduce<
  { component: string; componentSlug: string; items: Deliverable[] }[]
>((acc, d) => {
  const g = acc.find((x) => x.component === d.component);
  if (g) g.items.push(d);
  else acc.push({ component: d.component, componentSlug: d.componentSlug, items: [d] });
  return acc;
}, []);

function PreviewModal({ d, onClose }: { d: Deliverable; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deliverable-preview-title"
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm animate-fade"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-paper shadow-card animate-fade-up sm:rounded-2xl">
        {/* Header */}
        <div className="relative isolate overflow-hidden rounded-t-2xl bg-dark px-7 py-8 text-paper sm:px-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(70% 80% at 85% 20%, rgba(140,43,43,0.30), transparent 62%)",
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/20 text-paper transition-colors hover:bg-white/10"
          >
            ✕
          </button>
          <div className="relative z-10">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="eyebrow eyebrow--on-dark">The deliverables</span>
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
                {d.cap}
              </span>
            </div>
            <h2 id="deliverable-preview-title" className="text-h2 font-semibold text-paper">
              {d.name}
              <span className="align-super text-[0.4em]">™</span>
            </h2>
            <p className="mt-3 max-w-xl text-body text-white/70">{d.tagline}</p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-7 px-7 py-8 sm:px-9">
          <div>
            <p className="eyebrow mb-2">What it is</p>
            <p className="text-body text-body">{d.whatItIs}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">How we get it</p>
            <p className="text-body text-body">{d.howWeGetIt}</p>
          </div>
          <div>
            <p className="eyebrow mb-3">What&apos;s inside</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {d.inside.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4"
                >
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-maroon"
                    aria-hidden="true"
                  />
                  <p className="text-small text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-line pt-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={`/deliverables/${d.slug}`} className="btn">
                Open the deliverable page →
              </Link>
              <LinkArrow href={`/case-studies/lumina-medical-aesthetics#${d.componentSlug}`}>
                See it in the Lumina example
              </LinkArrow>
            </div>
            <div className="mt-4">
              <DocumentLightbox
                href={EXAMPLE_REPORT}
                page={d.reportPage}
                title={`Example Report · ${d.name}, Lumina Medical Aesthetics`}
                triggerLabel={`See the ${d.name} in the example report, full screen`}
                triggerClassName="inline-flex items-center gap-2 text-small font-semibold text-maroon transition-colors hover:text-maroon-hover"
              />
              <p className="mt-2 text-small text-muted">
                Opens the example report straight to this deliverable, produced for a real
                (illustrative) business. You can page through the rest from there.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function DeliverablesExplorer() {
  const [active, setActive] = useState<Deliverable | null>(null);

  return (
    <>
      {groups.map((g, gi) => (
        <Section key={g.component} tone={gi % 2 === 1 ? "surface" : "paper"}>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow={`Produced in ${g.component}™`} title={g.component + "™"} />
              <LinkArrow href={`/method/${g.componentSlug}`}>About this component</LinkArrow>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {g.items.map((d, i) => (
              <Reveal key={d.slug} variant="up" delay={(i % 2) * 80}>
                <button
                  type="button"
                  onClick={() => setActive(d)}
                  className="group flex h-full w-full flex-col rounded-lg border border-line bg-paper p-7 text-left hover-lift"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-h4 font-semibold text-ink group-hover:text-maroon">
                      {d.name}
                      <span className="align-super text-[0.5em]">™</span>
                    </h3>
                    <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {d.cap}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-body text-muted">{d.tagline}</p>
                  <span className="link-arrow mt-5 text-[14px]">
                    Quick look
                    <span className="arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      {active && <PreviewModal d={active} onClose={() => setActive(null)} />}
    </>
  );
}
