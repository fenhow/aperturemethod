import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { articles, getArticle, type Block } from "@/lib/insights";
import { FiveStatements } from "@/components/insights/FiveStatements";
import { Byline } from "@/components/insights/Byline";
import { primaryCta } from "@/lib/site";
import { pageMeta, ldArticle, ldBreadcrumb } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: "Insight not found" };
  return pageMeta({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
    type: "article",
    image: article.ogImage,
  });
}

/**
 * Figures are registered rather than inlined, so an article body stays plain
 * data. One entry today; the switch is what stops the second one from being
 * pasted into the page.
 */
const figures = {
  "five-statements": FiveStatements,
} as const;

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "figure": {
      const Figure = figures[block.figure];
      return <Figure />;
    }
    case "h2":
      return <h2 className="mt-12 text-h3 font-semibold text-ink">{block.text}</h2>;
    case "pull":
      return (
        <p className="my-10 border-l-2 border-maroon pl-6 text-h4 font-light leading-snug text-ink">
          {block.text}
        </p>
      );
    case "note":
      return (
        <p className="mt-8 rounded-sm border border-line bg-surface px-5 py-3 text-small italic text-muted">
          {block.text}
        </p>
      );
    case "p":
    default:
      return <p className="mt-6 text-body-lg leading-relaxed text-body">{block.text}</p>;
  }
}

export default function ArticlePage({ params }: { params: Params }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          ldArticle({
            title: article.title,
            description: article.excerpt,
            path: `/insights/${article.slug}`,
            section: article.pillar,
            datePublished: article.published,
            dateModified: article.updated,
            image: article.ogImage,
          }),
          ldBreadcrumb([
            { name: "Insights", path: "/insights" },
            { name: article.title, path: `/insights/${article.slug}` },
          ]),
        ]}
      />
      {/* Header */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="mb-5">
            <Link
              href="/insights"
              className="eyebrow text-maroon transition-colors hover:text-maroon-hover"
            >
              {article.pillar}
            </Link>
          </p>
          <h1 className="heading-gradient text-h1 font-semibold">{article.title}</h1>
          <Byline
            published={article.published}
            updated={article.updated}
            readingTime={article.readingTime}
          />
        </Reveal>
      </Section>

      {/* Lead image */}
      <Section className="py-0">
        <Reveal variant="zoom">
          <ImagePlaceholder
            id={`ARTICLE-${article.slug}-LEAD`}
            ratio="aspect-[21/9]"
            className="rounded border border-line"
            label={`${article.title} image`}
          />
        </Reveal>
      </Section>

      {/* Body */}
      <Section>
        <Reveal>
          <article className="max-w-measure">
            {article.body.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}

            <hr className="mt-14 border-line" />
            <p className="mt-6">
              <LinkArrow href="/insights">Back to all insights</LinkArrow>
            </p>
          </article>
        </Reveal>
      </Section>

      {/* Closing CTA */}
      <Section tone="dark" className="py-section-sm">
        <Reveal variant="zoom" className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-h2 font-semibold text-paper">
              Want this view of your own business?
            </h2>
            <p className="mt-4 text-body-lg text-white/70">
              Start with the Business X-Ray, a fixed-fee, low-risk first step that shows you where the
              opportunity is.
            </p>
          </div>
          <Link href={primaryCta.href} className="btn--on-dark shrink-0">
            {primaryCta.label}
          </Link>
        </Reveal>
      </Section>

      {/* Related */}
      {related.length > 0 && (
        <Section tone="surface">
          <Reveal>
            <p className="eyebrow mb-8">Keep reading</p>
          </Reveal>
          <div className="grid gap-8 lg:grid-cols-2">
            {related.map((a, i) => (
              <Reveal key={a.slug} variant="up" delay={(i % 2) * 90}>
              <Link
                href={`/insights/${a.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded border border-line bg-paper hover-lift sm:flex-row"
              >
                <ImagePlaceholder
                  id={`ARTICLE-REL-${a.slug}`}
                  ratio="aspect-[16/10] sm:aspect-auto sm:w-48 sm:shrink-0"
                  label={`${a.title} image`}
                />
                <div className="flex flex-1 flex-col justify-center p-6">
                  <p className="eyebrow">{a.pillar}</p>
                  <h3 className="mt-2 text-h4 font-semibold text-ink group-hover:text-maroon">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-small text-muted">
                    {a.date} · {a.readingTime}
                  </p>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
