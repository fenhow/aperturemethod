import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Logo } from "@/components/brand/Logo";
import { MarketMapLive } from "@/components/sections/MarketMapLive";
import { RevenueForecastLive } from "@/components/sections/RevenueForecastLive";
import { aperturePractices } from "@/lib/content";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

/**
 * Component pages for The Aperture Method™ — one product page per component
 * (Insights, Analytics, Intelligence, Compass, Atlas), rendered from the shared
 * `aperturePractices` data. Insights is the approved template; the other four
 * render from the same layout.
 */

const slugOf = (short: string) => short.toLowerCase();
const find = (component: string) =>
  aperturePractices.find((p) => slugOf(p.short) === component);

export function generateStaticParams() {
  return aperturePractices.map((p) => ({ component: slugOf(p.short) }));
}

export function generateMetadata({
  params,
}: {
  params: { component: string };
}): Metadata {
  const p = find(params.component);
  if (!p) return {};
  return pageMeta({
    title: `${p.product}™ — ${p.heading}`,
    description: p.description.slice(0, 155),
    path: `/method/${slugOf(p.short)}`,
  });
}

export default function ComponentPage({ params }: { params: { component: string } }) {
  const idx = aperturePractices.findIndex((p) => slugOf(p.short) === params.component);
  if (idx < 0) notFound();
  const p = aperturePractices[idx]!;
  const total = aperturePractices.length;
  const prev = aperturePractices[(idx - 1 + total) % total]!;
  const next = aperturePractices[(idx + 1) % total]!;
  const isAtlas = p.short === "Atlas";
  const hasMap = p.short === "Intelligence" || isAtlas;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-dark text-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 82% 30%, rgba(140,43,43,0.28), transparent 62%)",
          }}
        />
        <Container className="relative z-10 pb-16 pt-32 md:pb-20 md:pt-40">
          <Reveal className="max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <Logo tone="light" variant={p.short.toUpperCase()} className="text-[19px]" />
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
                {p.n} of {String(total).padStart(2, "0")}
                {p.cap ? ` · ${p.cap}` : ""}
              </span>
            </div>
            <h1 className="text-display font-semibold text-paper">{p.heading}</h1>
            <p className="mt-5 max-w-xl text-body-lg text-white/70">{p.line}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={primaryCta.href} className="btn--on-dark">
                {primaryCta.label}
              </Link>
              <Link href="/the-aperture-method" className="btn--ghost">
                See the full Method →
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* What it is */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading eyebrow={p.verb} title={`“${p.question}”`} />
          <p className="mt-6 text-body-lg text-body">{p.description}</p>
        </Reveal>
      </Section>

      {/* What you get */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <Reveal variant="right">
            <SectionHeading eyebrow="What you get" title="A tangible deliverable — yours to keep." />
          </Reveal>
          <Reveal variant="left" delay={90}>
            <div className="rounded-lg border border-line bg-paper p-8 shadow-card">
              <p className="text-overline font-semibold uppercase tracking-overline text-muted">
                Deliverable
              </p>
              <p className="mt-3 text-h3 font-semibold text-ink">{p.deliverable}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Frameworks (analytical components) */}
      {!isAtlas && p.frameworks.length > 0 && (
        <Section>
          <Reveal className="max-w-measure">
            <SectionHeading
              eyebrow="Under the hood"
              title={`The frameworks behind ${p.short}.`}
              lede="The same graduate-level business science big-company teams use — applied, in plain language, to your business."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {p.frameworks.map((f, i) => (
              <Reveal key={f.name} variant="up" delay={(i % 3) * 70}>
                <div className="h-full rounded-lg border border-line bg-paper p-6 hover-lift">
                  <h3 className="text-h4 font-semibold text-ink">{f.name}</h3>
                  <p className="mt-2 text-small text-muted">{f.what}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Live GIS / platform demo (Intelligence + Atlas) */}
      {hasMap && (
        <Section tone="dark">
          <Reveal className="max-w-measure">
            <p className="eyebrow eyebrow--on-dark mb-5">
              {isAtlas ? "The platform" : "Spatial intelligence"}
            </p>
            <h2 className="text-h2 font-semibold text-paper">
              {isAtlas ? "Where the analysis comes alive." : "Your market, on a map."}
            </h2>
            <p className="mt-6 text-body-lg text-white/75">
              {isAtlas
                ? "Aperture Atlas brings your performance and your market together on one live, interactive platform — the Scoreboard, Market Maps, drive-time trade areas, and forecasts, all current, all yours to keep."
                : "We map where your customers and competitors actually are — trade areas, drive-time rings, demographics, and demand — spatial intelligence most consultants don't offer."}
            </p>
          </Reveal>

          <Reveal variant="up" delay={120} className="mt-12">
            <figure className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
              <MarketMapLive tone="dark" className="block" />
              <figcaption className="border-t border-white/10 px-6 py-4 text-small text-white/60">
                A Market Map — trade areas, drive-time rings, and where demand actually clusters.
              </figcaption>
            </figure>
          </Reveal>

          {isAtlas && (
            <Reveal variant="up" delay={160} className="mt-6">
              <RevenueForecastLive />
              <p className="mt-3 text-small text-white/55">
                A live revenue forecast — Atlas continuously projects where the business is heading.
              </p>
            </Reveal>
          )}
        </Section>
      )}

      {/* Where it fits — arc nav */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="Where it fits"
            title="One component of a five-part method."
            lede="Every component is a complete engagement on its own — and a step in the larger arc. Take this one, or run the whole Method."
          />
        </Reveal>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <Link
            href={`/method/${slugOf(prev.short)}`}
            className="group flex flex-1 flex-col rounded-lg border border-line bg-paper p-6 hover-lift"
          >
            <span className="text-small text-muted">← Previous · {prev.n}</span>
            <span className="mt-1 text-h4 font-semibold text-ink group-hover:text-maroon">
              {prev.product}™
            </span>
          </Link>
          <Link
            href={`/method/${slugOf(next.short)}`}
            className="group flex flex-1 flex-col rounded-lg border border-line bg-paper p-6 text-right hover-lift"
          >
            <span className="text-small text-muted">Next · {next.n} →</span>
            <span className="mt-1 text-h4 font-semibold text-ink group-hover:text-maroon">
              {next.product}™
            </span>
          </Link>
        </div>
        <p className="mt-8">
          <LinkArrow href="/the-aperture-method">Explore the full Method</LinkArrow>
        </p>
      </Section>

      {/* CTA */}
      <Section tone="dark" className="border-t border-white/10">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                Not sure {p.product} is where to start?
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                Begin with a Business X-Ray — a fixed-fee diagnostic that shows you exactly which
                components will move the needle.
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
