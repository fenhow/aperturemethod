import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Faq } from "@/components/ui/Faq";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { Byline } from "@/components/insights/Byline";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { industries, getIndustry } from "@/lib/industries";
import { primaryCta } from "@/lib/site";
import { pageMeta, ldBreadcrumb, ldWebPage } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ind = getIndustry(params.slug);
  if (!ind) return {};
  return pageMeta({
    title: `${ind.name}: Analytics & Strategy`,
    description: ind.seoDescription,
    path: ind.href,
  });
}

export default function IndustryPage({ params }: { params: { slug: string } }) {
  const ind = getIndustry(params.slug);
  if (!ind) notFound();

  return (
    <>
      <JsonLd
        data={[
          ldWebPage({
            title: ind.question,
            description: ind.seoDescription,
            path: ind.href,
            dateModified: ind.reviewed,
          }),
          ldBreadcrumb([
            { name: "Industries", path: "/industries" },
            { name: ind.name, path: ind.href },
          ]),
        ]}
      />
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-5">
            <Link href="/industries" className="transition-colors hover:text-maroon-hover">
              Industries
            </Link>{" "}
            / {ind.name}
          </p>
          {/*
            The question is the H1 and the promise becomes the line beneath it.
            A sector page is found by someone typing the question, not by
            someone searching for our phrasing of the answer.
          */}
          <h1 className="heading-gradient text-display font-semibold">{ind.question}</h1>
          <p className="mt-6 text-body-lg text-body">
            <span className="font-semibold text-ink">{ind.promise}</span> {ind.sub}
          </p>
          <Byline blurb="BBA in Project Management, certified PMP, currently pursuing an MBA at Texas A&M. He does the work himself, start to finish." />
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/business-x-ray" className="btn">
              Start with a Business X-Ray
            </Link>
            <LinkArrow href="/the-aperture-method">See the whole Method</LinkArrow>
          </div>
        </Reveal>
      </Section>

      {/* Who this is for */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal variant="right">
            <SectionHeading eyebrow="Who this is for" title="Built for businesses like yours." />
            <p className="mt-6 text-body-lg text-body">{ind.buyer}</p>
            {ind.privacyNote ? (
              <p className="mt-5 rounded border border-line bg-paper p-4 text-small text-muted">
                {ind.privacyNote}
              </p>
            ) : null}
          </Reveal>
          <Reveal variant="left" delay={100}>
            <ImagePlaceholder
              id={`INDUSTRY-${ind.slug}`}
              ratio="aspect-[4/3]"
              className="rounded border border-line hover-lift"
              label={`${ind.name} environment: photography to be added`}
            />
          </Reveal>
        </div>
      </Section>

      {/* The problems we solve */}
      <Section>
        <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading eyebrow="The problems we solve" title="Sound familiar?" />
          <ul className="space-y-4">
            {ind.problems.map((p) => (
              <li key={p} className="flex gap-3 border-b border-line pb-4 text-body-lg text-body">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* How we help */}
      <Section tone="surface">
        <Reveal className="max-w-measure">
          <SectionHeading eyebrow="How we help" title="The offer." lede={ind.offer} />
          <p className="mt-6 text-small text-muted">The Aperture Method phases: {ind.phases}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {ind.deliverables.map((d) => (
              <li
                key={d}
                className="rounded-sm border border-line bg-paper px-3 py-1.5 text-small font-medium text-ink transition-colors hover:border-maroon hover:text-maroon"
              >
                {d}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* Illustrative case study */}
      <Section>
        <Reveal variant="zoom" className="max-w-3xl">
          <SectionHeading title="What the work looks like." className="mb-8 max-w-none" />
          <CaseStudy title={ind.caseStudy.title} body={ind.caseStudy.body} />
        </Reveal>
      </Section>

      {/* What you'd learn first */}
      <Section tone="surface">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-4">What you&apos;d learn first</p>
          <p className="text-h3 font-medium text-ink">{ind.firstQuestion}</p>
          <p className="mt-6 text-body text-muted">
            The Business X-Ray is a fixed-fee, low-risk first step. It answers exactly this before you
            commit to anything more.
          </p>
          <p className="mt-8">
            <Link href={primaryCta.href} className="btn">
              {primaryCta.label}
            </Link>
          </p>
        </Reveal>
      </Section>

      {/* The objections, sector by sector. Emits FAQPage schema. */}
      <Section>
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">Before you book</p>
            <h2 className="heading-gradient text-h2 font-semibold">
              Questions {ind.name.toLowerCase()} owners ask.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={80} className="mt-10">
          <Faq items={ind.faqs} />
        </Reveal>
        <Reveal delay={120} className="mt-8 max-w-measure">
          <p className="text-body text-muted">
            The position an established private business is in is not specific to your sector, even
            though the questions are.
          </p>
          <p className="mt-4">
            <LinkArrow href="/the-intelligence-gap">Why a firm like this exists</LinkArrow>
          </p>
          <div className="mt-8">
            <LastReviewed date={ind.reviewed} />
          </div>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                See your business clearly. Then watch the strategy run.
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                Start with the Business X-Ray, a fixed-fee, low-risk first step.
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
