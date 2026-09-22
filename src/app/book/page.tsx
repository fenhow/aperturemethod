import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PreorderForm } from "@/components/forms/PreorderForm";
import { Book3D } from "@/components/home/Book3D";
import { aperturePractices } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { bookContributors, bookExcerpt } from "@/lib/book";

/**
 * Book serif for the excerpt only (Source Serif 4, SIL OFL, self-hosted like
 * Inter). Loaded by this route alone, so no other page pays for it. The cover
 * and headings stay in Inter; the pages of a book are set in a serif.
 */
const bookSerif = localFont({
  src: "../fonts/SourceSerif4-Variable.woff2",
  weight: "200 900",
  display: "swap",
  variable: "--font-book",
});

export const metadata: Metadata = pageMeta({
  title: "The Book",
  description:
    "The Aperture Method is becoming a book by Fenwick How: why owner-run businesses are the last ones without real intelligence, and the five-component path that brings a business into focus. In progress. Reserve a copy, no charge.",
  path: "/book",
});

/**
 * /book: the forthcoming Aperture Method book.
 *
 * Deliberately honest about status: the book is being written, so there is no
 * publication date, page count or price here. The chapter outline is derived
 * from `aperturePractices`, so it can never drift from the five components the
 * rest of the site describes. When a sample chapter or a date exists, this page
 * earns a top-level nav slot; until then it lives under About and in the footer.
 */

const readers = [
  "Owners who run the business on instinct and a monthly P&L, and suspect they are missing something",
  "Second-generation and family owners who inherited a business and want to see it clearly",
  "Operators thinking about growth, a second location, or an eventual sale",
  "Advisors, bankers and board members who work alongside owner-run companies",
];

export default function BookPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal variant="right" className="flex flex-col items-center gap-3 py-6 lg:items-start">
            <Book3D />
          </Reveal>
          <Reveal variant="left" delay={90}>
            <p className="eyebrow">The book · in progress</p>
            <h1 className="heading-gradient mt-4 text-display font-semibold">
              The methodology, written down.
            </h1>
            <p className="mt-6 max-w-measure text-body-lg text-body">
              The Aperture Method, laid out end to end: how an owner-run business gets the same view
              of itself that big companies have, and the questions, measures and order to take them in.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-small font-semibold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-maroon" aria-hidden="true" />
                Being written now
              </span>
              <a href="#excerpt" className="link-arrow text-small font-semibold">
                Read an excerpt
              </a>
              <a href="#reserve" className="link-arrow text-small font-semibold">
                Reserve your copy
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Excerpt: replaces the old premise block, which said the same thing less well */}
      <Section tone="dark" id="excerpt">
        <div className="mx-auto max-w-measure">
          <Reveal>
            <p className="eyebrow eyebrow--on-dark">
              From {bookExcerpt.chapter} · {bookExcerpt.title}
            </p>
            <p className="mt-6 text-h2 font-semibold leading-tight text-paper">{bookExcerpt.lead}</p>
          </Reveal>
          <Reveal delay={80}>
            <div
              className={`${bookSerif.className} mt-10 space-y-6 text-[1.1875rem] leading-[1.75] text-white/85 md:text-[1.3rem]`}
            >
              {bookExcerpt.paragraphs.map((p, i) => (
                <p
                  key={p.slice(0, 24)}
                  className={
                    i === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.1em] first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-maroon-soft"
                      : undefined
                  }
                >
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-10 border-l-2 border-maroon pl-5 text-h4 font-semibold text-paper">
              {bookExcerpt.close}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a href="#reserve" className="link-arrow text-small font-semibold text-paper hover:text-maroon-soft">
                Reserve your copy
              </a>
              <span className="text-small text-white/50">Fenwick How · The Aperture Method</span>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Outline */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Planned outline"
            title="Five components, one path."
            lede="The working structure of the book. Chapters may shift as it is written; the path will not."
          />
        </Reveal>
        <ol className="mt-12 grid gap-5 md:grid-cols-2">
          <li className="rounded-2xl border border-line bg-paper p-6">
            <p className="text-small font-semibold text-maroon">Opening</p>
            <h3 className="mt-2 text-h4 font-semibold text-ink">The intelligence gap</h3>
            <p className="mt-2 text-body text-muted">
              Why size buys sight, what owner-run businesses are missing, and why more data is not
              the answer.
            </p>
          </li>
          {aperturePractices.map((p) => (
            <li key={p.n} className="rounded-2xl border border-line bg-paper p-6">
              <p className="text-small font-semibold text-maroon">
                Part {p.n} · {p.verb}
              </p>
              <h3 className="mt-2 text-h4 font-semibold text-ink">{p.heading}</h3>
              <p className="mt-1 text-small italic text-muted">{p.question}</p>
              <p className="mt-3 text-body text-muted">{p.line}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Contributors */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="Written with"
            title="Three experts, one method."
            lede="Fenwick is writing the book with contributing authors in the three disciplines an owner-run business leans on most."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {bookContributors.map((c) => (
            <div key={c.area} className="rounded-2xl border border-line bg-paper p-6">
              <p className="text-small font-semibold text-maroon">Contributing author · {c.area}</p>
              <h3 className="mt-2 text-h4 font-semibold text-ink">{c.name ?? "To be announced"}</h3>
              <p className="mt-3 text-body text-muted">{c.focus}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Who it's for */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Who it's for" title="Written for the person who signs the checks." />
            <ul className="mt-8 space-y-4">
              {readers.map((r) => (
                <li key={r} className="flex gap-3 text-body text-body">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={90}>
            <SectionHeading eyebrow="From the author" title="Why write it down." />
            <p className="mt-6 text-body text-body">
              I built The Aperture Method because the tools I was learning in an Executive MBA, and
              using in analytics and GIS work, kept pointing at the same problem: the businesses that
              need this thinking most are the ones nobody brings it to. Writing it down is the
              simplest way to hand the whole method to anyone who wants it, whether or not we ever
              work together.
            </p>
            <p className="mt-5 text-small font-semibold text-ink">Fenwick How</p>
            <p className="text-small text-muted">
              Founder, The Aperture Method · Executive MBA in progress, Mays Business School
            </p>
            <Link href="/about" className="link-arrow mt-5 inline-flex text-small font-semibold">
              More about Fenwick
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Reserve */}
      <Section id="reserve" tone="surface">
        <Reveal className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="Reserve a copy"
            title="Be first to read it."
            lede="No charge now. We will email you when a sample chapter is ready and again when the book is available. Nothing else."
          />
          <div className="mt-8">
            <PreorderForm />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
