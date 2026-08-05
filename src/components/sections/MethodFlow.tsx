import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { aperturePractices } from "@/lib/content";

/**
 * The Method, end to end — a walk-through flow: the Business X-Ray front door,
 * the five components with their deliverables, the SyncPoint AI platform layer,
 * and the loop. Responsive (horizontal on desktop, stacked on mobile).
 */
export function MethodFlow() {
  return (
    <Section id="flow" tone="surface">
      <Reveal className="max-w-measure">
        <SectionHeading
          eyebrow="How it works, end to end"
          title="One path — from a first read to a living platform."
          lede="Start with a fixed-fee Business X-Ray; it names your #1 constraint and prescribes which components you need. Take one result, or the full path."
        />
      </Reveal>

      {/* Entry — the X-Ray front door */}
      <Reveal variant="up" delay={80} className="mt-8">
        <div className="flex flex-col gap-3 rounded-xl bg-ink px-6 py-4 text-paper sm:flex-row sm:items-center">
          <span className="inline-flex w-fit shrink-0 rounded-md bg-paper px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-ink">
            Start here
          </span>
          <p className="text-body text-white/85">
            A fixed-fee <b className="font-semibold text-paper">Business X-Ray</b> reads your business,
            names your #1 constraint, and prescribes exactly which components you need.
          </p>
        </div>
      </Reveal>

      {/* The five components in sequence */}
      <Reveal variant="up" delay={120} className="mt-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {aperturePractices.map((p, i) => (
            <Fragment key={p.n}>
              <div className="flex flex-1 flex-col rounded-lg border border-line bg-paper p-5">
                <div className="flex items-center justify-between">
                  <span className="text-h4 font-semibold tabular-nums text-maroon">{p.n}</span>
                  {p.cap && (
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {p.cap}
                    </span>
                  )}
                </div>
                <p className="eyebrow mt-3">{p.verb}</p>
                <h3 className="mt-1 text-[15px] font-semibold leading-tight text-ink">{p.product}&trade;</h3>
                <p className="mt-2 text-small italic text-muted">&ldquo;{p.question}&rdquo;</p>
                <p className="mt-auto pt-4 text-overline font-semibold uppercase tracking-overline text-muted">
                  You get
                </p>
                <p className="mt-1 text-small font-medium text-ink">{p.deliverable}</p>
              </div>
              {i < aperturePractices.length - 1 && (
                <div
                  className="flex items-center justify-center text-h3 font-semibold text-maroon"
                  aria-hidden="true"
                >
                  <span className="rotate-90 lg:rotate-0">&rarr;</span>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </Reveal>

      {/* Platform layer */}
      <Reveal delay={140} className="mt-4">
        <div className="flex flex-col gap-2 rounded-lg bg-dark px-6 py-4 text-paper sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body font-semibold">
            The Aperture Platform · powered by <span className="text-maroon-onDark">SyncPoint AI</span>
          </p>
          <p className="text-small text-white/60">
            the data &amp; intelligence engine beneath every component
          </p>
        </div>
      </Reveal>

      {/* Loop */}
      <Reveal delay={160} className="mt-4">
        <div className="flex items-start gap-3 rounded-lg border border-dashed border-maroon/50 px-6 py-4">
          <span className="text-h4 leading-none text-maroon" aria-hidden="true">
            &#8635;
          </span>
          <p className="text-body text-body">
            <span className="font-semibold text-ink">It&apos;s a loop, not a line.</span> Aperture Atlas
            keeps the numbers live — fresh data re-opens the next constraint, and your Aperture Score is
            re-scored to prove progress.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
