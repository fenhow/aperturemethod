import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ReadMore } from "@/components/ui/ReadMore";
import { Reveal } from "@/components/ui/Reveal";
import { industries } from "@/lib/industries";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Industries",
  description:
    "The Aperture Method serves owner-run and family-owned businesses ($5M–$20M) in industrial & manufacturing, retail & consumer, professional services, and healthcare, turning their own data into clear decisions.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <div className="max-w-measure">
          <p className="eyebrow mb-5">Who we help</p>
          <h1 className="heading-gradient text-display font-semibold">
            Built for owner-run businesses, whatever you do.
          </h1>
          <p className="mt-6 text-body-lg text-body">
            We work with founders and families who&apos;ve built something real, in the $5M–$20M range,
            and are ready to run it on evidence instead of instinct. The industries below are where our
            approach tends to pay off fastest: examples, not limits. If you don&apos;t see yours, we
            very likely still work with you.
          </p>
        </div>
      </Section>

      {/* Why owner-run + the industry grid */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="Why us"
          title="Why owner-run and family-owned."
          lede="A big firm is built for a company several sizes larger. We're built for you: one senior partner, plain language, fixed and transparent fees, and a method that turns the data you already have into decisions. The sectors below are a few we know especially well: examples, not limits."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} variant="up" delay={(i % 2) * 90}>
              <Link
                href={ind.href}
                className="group flex h-full flex-col overflow-hidden rounded border border-line bg-paper hover-lift"
              >
                <div className="relative overflow-hidden">
                  <ImagePlaceholder id={`INDUSTRIES-${ind.slug}`} label={`${ind.name}: photography to be added`} />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/90 via-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <p className="translate-y-2 p-5 text-small leading-snug text-white/95 transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      {ind.sub}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow">{ind.name}</p>
                  <h3 className="mt-2 text-h4 font-semibold text-ink">{ind.hook}</h3>
                  <ReadMore label="See how we help" className="mt-4" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Different data, same method */}
      <Section>
        <div className="max-w-measure">
          <SectionHeading
            title="Different data. The same method."
            lede="Every industry keeps its data in different places: an ERP, a POS, a practice-management system. What stays the same is The Aperture Method™: we bring the business into focus, put numbers to it, understand the customers, choose the moves that matter, and help you execute. The tools change; the rigor doesn't."
          />
        </div>
      </Section>

      {/* Don't see yours: CTA */}
      <Section tone="dark">
        <div className="max-w-2xl">
          <h2 className="text-h2 font-semibold text-paper">Don&apos;t see your industry?</h2>
          <p className="mt-4 text-body-lg text-white/70">
            We work with data-rich, owner-run businesses across many sectors. If your business runs on
            real transactional data and you&apos;re ready to use it, the method applies. The simplest way
            to find out is to start with a Business X-Ray.
          </p>
          <p className="mt-8">
            <Link href={primaryCta.href} className="btn--on-dark">
              {primaryCta.label}
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
