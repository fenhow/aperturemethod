import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "The Aperture Method is a founder-led strategic consultancy that brings big-company analytics, technology, and rigor to owner-run businesses ($1M–$20M) — in plain language, at fixed fees, delivered by a senior partner.",
  path: "/about",
});

const principles = [
  {
    h: "One senior partner, start to finish.",
    p: "You work with the person doing the analysis, not a rotating junior team.",
  },
  {
    h: "Evidence before instinct.",
    p: "We start from your own data, not borrowed benchmarks.",
  },
  {
    h: "Plain language.",
    p: "You'll understand every number and every recommendation.",
  },
  {
    h: "Fixed, transparent fees.",
    p: "You see the price and decide at each step.",
  },
  {
    h: "You keep what we build.",
    p: "The models, the dashboards, and the playbooks are yours.",
  },
  {
    h: "We stay until it's working.",
    p: "Most firms stop at the recommendation. We don't.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-5">About</p>
          <h1 className="heading-gradient text-display font-semibold">
            A firm built for the businesses the big firms overlook.
          </h1>
          <p className="mt-6 text-body-lg text-body">
            The Aperture Method™ brings the analytics, technology, and strategic rigor of a large company to
            owner-run businesses — with the judgment of a senior partner and the plain language of
            someone who has actually run things.
          </p>
          <p className="mt-8">
            <LinkArrow href="/what-we-believe">Read what we believe</LinkArrow>
          </p>
        </Reveal>
      </Section>

      {/* What we are */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal variant="right" className="max-w-measure">
            <SectionHeading title="What we are." />
            <p className="mt-6 text-body-lg text-body">
              The Aperture Method is a strategic business consultancy for owner-run companies doing
              $1M–$20M. We turn the data a business already has into clear decisions, and we stay to
              help carry them out. The tools we use are the ones large companies rely on. What&apos;s
              different is who we bring them to, and how: sized for your business, in plain terms, at
              fixed and transparent fees.
            </p>
          </Reveal>
          <Reveal variant="left" delay={100} className="max-w-measure">
            <SectionHeading title="Why we exist." />
            <p className="mt-6 text-body-lg text-body">
              Most good businesses this size run on instinct and spreadsheets — not for lack of
              ambition, but because real analytics and modern technology have always been priced and
              built for someone larger. The big firms won&apos;t take a company your size. The local
              options rarely do the quantitative work. We built The Aperture Method to close that gap.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* How we work */}
      <Section>
        <Reveal>
          <SectionHeading eyebrow="How we work" title="How we work — and how we're different." />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((pr, i) => (
            <Reveal key={pr.h} variant="up" delay={(i % 3) * 90}>
              <div className="group h-full rounded border border-line bg-paper p-6 hover-lift">
                <h3 className="text-h4 font-semibold text-ink transition-colors duration-200 group-hover:text-maroon">
                  {pr.h}
                </h3>
                <p className="mt-2 text-body text-muted">{pr.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Founder-led */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <Reveal variant="right">
            <div className="relative aspect-[4/5] overflow-hidden rounded border border-line">
              <Image
                src="/fen4.jpg"
                alt="Fenwick How reviewing analytics at his desk"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>
          <Reveal variant="left" delay={100}>
            <SectionHeading eyebrow="Founder-led" title="When you work with the firm, you work with him." />
            <p className="mt-6 text-body-lg text-body">
              The Aperture Method was founded by Fenwick How — an entrepreneur and operator who has created
              and developed companies and led complex initiatives across a range of industries. The
              senior person who does the analysis is the person you talk to.
            </p>
            <p className="mt-8">
              <LinkArrow href="/founder">Read about the founder</LinkArrow>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Who we serve */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="Who we serve"
            title="Owner-run and family-owned businesses."
            lede="In industrial and manufacturing, retail and consumer, professional services, and healthcare — and data-rich companies in other sectors ready to run on evidence."
          />
          <p className="mt-8">
            <LinkArrow href="/industries">See the industries we serve</LinkArrow>
          </p>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">Start with a Business X-Ray.</h2>
              <p className="mt-4 text-body-lg text-white/70">
                A fixed-fee, low-risk first step that shows you where the opportunity is — before you
                commit to anything more.
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
