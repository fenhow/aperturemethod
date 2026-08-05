import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { deliverables } from "@/lib/deliverables";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The Deliverables — What You Get",
  description:
    "Every tangible artifact The Aperture Method produces — the Business X-Ray, Aperture Score, Profit Map, Customer & Market Map, Opportunity Matrix, Focus Plan, and Scoreboard — explained plainly: what each is and how we get it.",
  path: "/deliverables",
});

// Group deliverables by the component that produces them, preserving order.
const groups = deliverables.reduce<{ component: string; componentSlug: string; items: typeof deliverables }[]>(
  (acc, d) => {
    const g = acc.find((x) => x.component === d.component);
    if (g) g.items.push(d);
    else acc.push({ component: d.component, componentSlug: d.componentSlug, items: [d] });
    return acc;
  },
  []
);

export default function DeliverablesIndex() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-dark text-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(60% 70% at 80% 24%, rgba(140,43,43,0.24), transparent 62%)",
          }}
        />
        <div className="container relative z-10 pb-16 pt-32 md:pb-20 md:pt-40">
          <Reveal className="max-w-3xl">
            <p className="eyebrow eyebrow--on-dark mb-5">What you get</p>
            <h1 className="text-display font-semibold text-paper">The deliverables.</h1>
            <p className="mt-5 max-w-xl text-body-lg text-white/70">
              Every engagement produces tangible, executive-ready artifacts — not slideware. Here&apos;s
              each one, in plain terms: what it is, and how we get it. They&apos;re yours to keep.
            </p>
          </Reveal>
        </div>
      </section>

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
                <Link
                  href={`/deliverables/${d.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-line bg-paper p-7 hover-lift"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-h4 font-semibold text-ink group-hover:text-maroon">
                      {d.name}
                      <span className="align-super text-[0.5em]">™</span>
                    </h3>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                      {d.cap}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-body text-muted">{d.tagline}</p>
                  <span className="link-arrow mt-5 text-[14px]">
                    What it is &amp; how we get it
                    <span className="arrow" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      {/* See them in a real engagement */}
      <Section tone="surface">
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="See them in action"
            title="Every deliverable, in one real example."
            lede="Meet Lumina Medical Aesthetics — an illustrative business we take through the entire Method, producing a complete, reconciled set of these deliverables."
          />
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <LinkArrow href="/what-you-get">See the full example</LinkArrow>
            <LinkArrow href="/case-studies/lumina-medical-aesthetics">Read the case study</LinkArrow>
          </div>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section tone="dark" className="border-t border-white/10">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                See your business clearly. Then keep the tools.
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                Start with a Business X-Ray — a fixed-fee, low-risk first step.
              </p>
            </div>
            <Link href={primaryCta.href} className="btn--on-dark shrink-0">
              {primaryCta.label}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
