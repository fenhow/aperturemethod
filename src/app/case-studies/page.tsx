import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Reveal } from "@/components/ui/Reveal";
import { industries } from "@/lib/industries";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Case Studies",
  description:
    "Representative examples of the problems we solve and how The Aperture Method addresses them, across the industries we serve. Illustrative scenarios, clearly labeled.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-5">What the work looks like</p>
          <h1 className="heading-gradient text-display font-semibold">What the work looks like.</h1>
          <p className="mt-6 text-body-lg text-body">
            Representative examples of the problems we solve and how the Method addresses them — across
            the industries we serve.
          </p>
          <p className="mt-4 max-w-2xl text-small italic text-muted">
            Some examples below are illustrative scenarios, clearly labeled as such. As our client work
            matures, we replace them with real, permissioned case studies. We never present illustrative
            work as an actual client result.
          </p>
        </Reveal>
      </Section>

      {/* The illustrative case studies */}
      <Section tone="surface">
        <div className="grid gap-8 lg:grid-cols-2">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} variant="up" delay={(i % 2) * 90} className="flex flex-col">
              <p className="eyebrow mb-3">{ind.name}</p>
              <CaseStudy title={ind.caseStudy.title} body={ind.caseStudy.body} className="flex-1 bg-paper" />
              <p className="mt-3">
                <Link
                  href={ind.href}
                  className="text-[15px] font-semibold text-ink transition-colors hover:text-maroon"
                >
                  How we help {ind.name.toLowerCase()} →
                </Link>
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">See what this looks like for your business.</h2>
              <p className="mt-4 text-body-lg text-white/70">
                Start with the Business X-Ray — a fixed-fee, low-risk first step.
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
