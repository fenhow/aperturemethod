import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Faq } from "@/components/ui/Faq";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { LastReviewed } from "@/components/ui/LastReviewed";
import { DocumentLightbox } from "@/components/ui/DocumentLightbox";
import { Byline } from "@/components/insights/Byline";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { ldService, ldWebPage, ldBreadcrumb } from "@/lib/seo";
import type { LandingPage } from "@/lib/landing";

const REPORT = "/reports/Lumina-Aperture-Method-Example-Report.pdf";

/**
 * One landing page, rendered from its content.
 *
 * The block order here is the whole point of the component and is deliberately
 * not configurable. A landing page that lets each instance reorder itself
 * becomes five pages with five different arguments, which is the situation this
 * was built to get out of.
 *
 * Note the call-to-action count. There are exactly three, all identical, all
 * pointing at the same place. Every other link on the page is secondary and
 * looks it. That restraint is the difference between a landing page and a
 * homepage, and it is easy to erode one useful link at a time.
 */
export function LandingView({ page }: { page: LandingPage }) {
  const cta = (
    <Link href={page.ctaHref} className="btn">
      {page.ctaLabel}
    </Link>
  );

  return (
    <>
      <JsonLd
        data={[
          ldService({
            name: page.service.name,
            description: page.answer,
            path: page.slug,
            price: page.service.price,
            billingPeriod: page.service.billingPeriod,
            includes: page.service.includes,
          }),
          ldWebPage({
            title: page.meta.title,
            description: page.answer,
            path: page.slug,
            dateModified: page.reviewed,
          }),
          ldBreadcrumb([
            page.breadcrumbParent,
            { name: page.service.name, path: page.slug },
          ]),
        ]}
      />

      {/* The question, who is answering it, the outcome, the short answer */}
      <Section className="pt-28 md:pt-36">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-5">{page.eyebrow}</p>
            <h1 className="heading-gradient text-display font-semibold">{page.h1}</h1>
            <p className="mt-6 text-body-lg text-body">{page.sub}</p>
          </Reveal>

          <Reveal delay={80}>
            <Byline blurb={page.bylineBlurb} />
          </Reveal>

          <Reveal delay={120} className="mt-8">
            <div className="rounded-lg border-l-2 border-maroon bg-surface p-6">
              <h2 className="text-h4 font-semibold text-ink">{page.answerHeading}</h2>
              <p className="mt-3 text-body text-body">{page.answer}</p>
            </div>
          </Reveal>

          <Reveal delay={160} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {cta}
            <span className="text-small text-muted">{page.priceNote}</span>
          </Reveal>
        </div>
      </Section>

      {/* The problem, with its cost */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The problem</p>
            <h2 className="heading-gradient text-h2 font-semibold">{page.problem.heading}</h2>
          </Reveal>
          <Reveal delay={80}>
            {page.problem.paras.map((para, i) => (
              <p
                key={i}
                className={i === 0 ? "mt-6 text-body-lg text-body" : "mt-5 text-body text-body"}
              >
                {para}
              </p>
            ))}
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 border-l-2 border-maroon pl-6 text-h4 font-light leading-snug text-ink">
              {page.problem.pull}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* The solution, led by the outcome */}
      <Section>
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The solution</p>
            <h2 className="heading-gradient text-h2 font-semibold">{page.solution.heading}</h2>
            <p className="mt-6 text-body-lg text-body">{page.solution.lede}</p>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-10">
          <h3 className="eyebrow mb-4">{page.solution.cardsHeading}</h3>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.solution.cards.map((card, i) => (
              <li key={card.label} className="rounded-lg border border-line bg-paper p-5">
                <span className="text-small font-semibold tabular-nums text-maroon">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-body font-semibold text-ink">{card.label}</p>
                {card.note && <p className="mt-1.5 text-small text-muted">{card.note}</p>}
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="max-w-measure">
          <Reveal delay={120} className="mt-10">
            <h3 className="text-h4 font-semibold text-ink">{page.solution.walkAwayHeading}</h3>
            <ul className="mt-4 space-y-2.5">
              {page.solution.walkAway.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-body">
                  <span
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-maroon"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160} className="mt-8">
            <p className="text-body text-muted">{page.solution.howItRuns}</p>
            <p className="mt-6">{cta}</p>
          </Reveal>
        </div>
      </Section>

      {/* The proof */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The proof</p>
            <h2 className="heading-gradient text-h2 font-semibold">{page.proof.heading}</h2>
            <p className="mt-6 text-body-lg text-body">{page.proof.lede}</p>
          </Reveal>
        </div>

        {page.proof.blocks.map((block, i) => (
          <Reveal key={block.title} delay={80 + i * 40} className="mt-8">
            <div className="max-w-measure rounded-lg border border-line bg-paper p-7">
              {block.tag && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-maroon" aria-hidden="true" />
                  {block.tag}
                </span>
              )}
              <h3 className={"text-h3 font-semibold text-ink" + (block.tag ? " mt-4" : "")}>
                {block.title}
              </h3>
              <p className="mt-3 text-body text-body">{block.body}</p>
              {block.note && <p className="mt-3 text-small text-muted">{block.note}</p>}
              {(block.report || block.link) && (
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  {block.report && (
                    <DocumentLightbox
                      href={REPORT}
                      page={block.report.page}
                      title={`Example Report · The Aperture Method: Lumina Medical Aesthetics`}
                      triggerLabel={block.report.label}
                      triggerClassName="btn--secondary"
                    />
                  )}
                  {block.link && <LinkArrow href={block.link.href}>{block.link.label}</LinkArrow>}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </Section>

      {/* The alternatives */}
      <Section>
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">The alternatives</p>
            <h2 className="heading-gradient text-h2 font-semibold">{page.comparison.heading}</h2>
            <p className="mt-6 text-body-lg text-body">{page.comparison.lede}</p>
          </Reveal>
        </div>
        <Reveal delay={80}>
          <ComparisonTable />
        </Reveal>
      </Section>

      {/* The price */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-4">The price</p>
          <h2 className="text-h2 font-semibold text-paper">What does it cost?</h2>
          <p className="mt-5 text-h3 font-semibold text-paper">{page.price.headline}</p>
          <p className="mt-5 text-body-lg text-white/75">{page.price.body}</p>
          {page.price.footnote && (
            <p className="mt-4 text-small text-white/55">{page.price.footnote}</p>
          )}
          <p className="mt-8">
            <Link href={page.ctaHref} className="btn--on-dark">
              {page.ctaLabel}
            </Link>
          </p>
          <p className="mt-4 text-small text-white/55">
            Not ready to book?{" "}
            <Link href="/contact" className="underline hover:text-white">
              Ask a question first
            </Link>
            . Asking does not begin an engagement.
          </p>
        </Reveal>
      </Section>

      {/* The objections, and the date */}
      <Section tone="surface">
        <div className="max-w-measure">
          <Reveal>
            <p className="eyebrow mb-4">Before you book</p>
            <h2 className="heading-gradient text-h2 font-semibold">{page.faqHeading}</h2>
          </Reveal>
        </div>
        <Reveal delay={80} className="mt-10">
          <Faq items={page.faqs} />
        </Reveal>
        <Reveal delay={120} className="mt-8">
          <LastReviewed date={page.reviewed} />
        </Reveal>
      </Section>
    </>
  );
}
