import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { DocumentLightbox } from "@/components/ui/DocumentLightbox";
import { deliverables, deliverableBySlug } from "@/lib/deliverables";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const EXAMPLE_REPORT = "/reports/Lumina-Aperture-Method-Example-Report.pdf";

/**
 * Deliverable detail pages — one per named artifact (Business X-Ray, Aperture
 * Score, Profit Map, …). Each explains, plainly, WHAT IT IS and HOW WE GET IT.
 * Data-driven from `deliverables`. Route param is `component` (the slug).
 */

export function generateStaticParams() {
  return deliverables.map((d) => ({ component: d.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { component: string };
}): Metadata {
  const d = deliverableBySlug(params.component);
  if (!d) return {};
  return pageMeta({
    title: `${d.name}™ — ${d.tagline}`,
    description: d.whatItIs.slice(0, 155),
    path: `/deliverables/${d.slug}`,
  });
}

export default function DeliverablePage({ params }: { params: { component: string } }) {
  const idx = deliverables.findIndex((x) => x.slug === params.component);
  if (idx < 0) notFound();
  const d = deliverables[idx]!;
  const next = deliverables[(idx + 1) % deliverables.length]!;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-dark text-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 82% 26%, rgba(140,43,43,0.26), transparent 62%)",
          }}
        />
        <Container className="relative z-10 pb-16 pt-32 md:pb-20 md:pt-40">
          <Reveal className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="eyebrow eyebrow--on-dark">The deliverables</span>
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
                {d.cap}
              </span>
            </div>
            <h1 className="text-display font-semibold text-paper">
              {d.name}
              <span className="align-super text-[0.35em]">™</span>
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-white/70">{d.tagline}</p>
            <p className="mt-4 text-small text-white/55">
              Produced in{" "}
              <Link
                href={`/method/${d.componentSlug}`}
                className="font-semibold text-white/80 underline decoration-white/30 underline-offset-2 hover:text-white"
              >
                {d.component}™
              </Link>
            </p>
          </Reveal>
        </Container>
      </section>

      {/* What it is */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading eyebrow="What it is" title={`The ${d.name}™, in plain terms.`} />
          <p className="mt-6 text-body-lg text-body">{d.whatItIs}</p>
        </Reveal>
      </Section>

      {/* How we get it */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <Reveal variant="right">
            <SectionHeading eyebrow="How we get it" title="How it's produced." />
          </Reveal>
          <Reveal variant="left" delay={90}>
            <p className="text-body-lg text-body">{d.howWeGetIt}</p>
          </Reveal>
        </div>
      </Section>

      {/* What's inside */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading eyebrow="What's inside" title="What you actually receive." />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {d.inside.map((item, i) => (
            <Reveal key={item} variant="up" delay={(i % 2) * 70}>
              <div className="flex items-start gap-3 rounded-lg border border-line bg-paper p-6">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-maroon" aria-hidden="true" />
                <p className="text-body text-ink">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
        {/* See the real thing — opens the example report to this deliverable */}
        <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-7">
          <p className="text-h4 font-semibold text-ink">See a real {d.name}™.</p>
          <p className="mt-2 max-w-measure text-body text-muted">
            Open the example report straight to this deliverable — produced end to end for Lumina
            Medical Aesthetics, an illustrative business.
          </p>
          <div className="mt-5">
            <DocumentLightbox
              href={EXAMPLE_REPORT}
              page={d.reportPage}
              title={`Example Report · ${d.name} — Lumina Medical Aesthetics`}
              triggerLabel={`Open the report to the ${d.name}`}
              triggerClassName="btn inline-flex items-center gap-2.5"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <LinkArrow href="/deliverables">All deliverables</LinkArrow>
          <LinkArrow href={`/deliverables/${next.slug}`}>Next: {next.name}™</LinkArrow>
        </div>
      </Section>

      {/* CTA */}
      <Section tone="dark" className="border-t border-white/10">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                Want the {d.name}™ for your business?
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                It starts with a Business X-Ray — a fixed-fee diagnostic that shows you exactly which
                components you need.
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
