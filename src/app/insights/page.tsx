import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import { articles, pillars } from "@/lib/insights";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Insights",
  description:
    "Plain, practical thinking on running an owner-run business by the numbers — profit and pricing, customers, practical AI, growth, and the owner's seat.",
  path: "/insights",
});

export default function InsightsPage() {
  const featured = articles.find((a) => a.featured) ?? articles[0]!;
  const rest = articles.filter((a) => a.slug !== featured.slug);

  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-5">Insights</p>
          <h1 className="heading-gradient text-display font-semibold">
            Plain thinking on running a business by the numbers.
          </h1>
          <p className="mt-6 text-body-lg text-body">
            Practical articles on pricing, customers, and using the data you already have to decide —
            no jargon, no hype. If you read one, change one thing, and never hire us, it did its job.
          </p>
        </Reveal>
      </Section>

      {/* Pillars */}
      <Section tone="surface" className="py-section-sm">
        <Reveal>
          <p className="eyebrow mb-8">What we write about</p>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((p, i) => (
            <Reveal key={p.name} variant="up" delay={(i % 5) * 70} className="border-t border-line pt-4">
              <h2 className="text-h4 font-semibold text-ink">{p.name}</h2>
              <p className="mt-2 text-small text-muted">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Featured + articles */}
      <Section>
        {/* Featured */}
        <Reveal variant="zoom">
        <Link
          href={`/insights/${featured.slug}`}
          className="group grid gap-8 overflow-hidden rounded border border-line hover-lift lg:grid-cols-2"
        >
          <ImagePlaceholder id={`INSIGHTS-FEATURED-${featured.slug}`} ratio="aspect-[16/10] lg:aspect-auto lg:h-full" label={`${featured.title} — image`} />
          <div className="flex flex-col justify-center p-8">
            <p className="eyebrow">{featured.pillar}</p>
            <h2 className="mt-3 text-h2 font-semibold text-ink group-hover:text-maroon">{featured.title}</h2>
            <p className="mt-4 text-body-lg text-muted">{featured.excerpt}</p>
            <p className="mt-6 text-small text-muted">
              {featured.date} · {featured.readingTime}
            </p>
          </div>
        </Link>
        </Reveal>

        {/* The rest */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {rest.map((a, i) => (
            <Reveal key={a.slug} variant="up" delay={(i % 2) * 90}>
              <Link
                href={`/insights/${a.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded border border-line hover-lift sm:flex-row"
              >
                <ImagePlaceholder id={`INSIGHTS-${a.slug}`} ratio="aspect-[16/10] sm:aspect-auto sm:w-48 sm:shrink-0" label={`${a.title} — image`} />
                <div className="flex flex-1 flex-col justify-center p-6">
                  <p className="eyebrow">{a.pillar}</p>
                  <h3 className="mt-2 text-h4 font-semibold text-ink group-hover:text-maroon">{a.title}</h3>
                  <p className="mt-3 text-small text-muted">
                    {a.date} · {a.readingTime}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Newsletter — "In Focus" */}
      <Section tone="dark" className="py-section-sm">
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow eyebrow--on-dark mb-4">In Focus</p>
            <h2 className="text-h3 font-semibold text-paper">
              One practical idea for your business, about once a month.
            </h2>
            <p className="mt-3 text-body text-white/70">
              A short note from Fenwick — one idea you can use, one number worth knowing, one link worth
              your time. No spam, unsubscribe anytime.
            </p>
          </div>
          <NewsletterForm />
        </Reveal>
      </Section>
    </>
  );
}
