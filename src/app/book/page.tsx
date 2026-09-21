import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PreorderForm } from "@/components/forms/PreorderForm";
import { Book3D } from "@/components/home/Book3D";
import { aperturePractices } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

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
              Big companies don&apos;t outgrow you because they&apos;re smarter. They outgrow you
              because they can see. This book lays out, end to end, how an owner-run business gets
              that same view: the questions, the measures, and the order to take them in.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-small font-semibold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-maroon" aria-hidden="true" />
                Being written now
              </span>
              <a href="#reserve" className="link-arrow text-small font-semibold">
                Reserve your copy
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Premise */}
      <Section tone="surface">
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="The premise"
            title="The last businesses without real intelligence."
          />
          <p className="mt-6 text-body-lg text-body">
            Large companies have analysts, finance teams and market data telling them where the
            money is made and lost. Owner-run businesses, which employ most of the country, usually
            have a bookkeeper, a bank balance and a gut feel. The gap isn&apos;t effort or talent. It
            is visibility.
          </p>
          <p className="mt-5 text-body text-muted">
            The Aperture Method closes that gap in five steps, each one answering a single question
            before the next begins. The book walks through every step in plain language, with the
            same tools used in the work itself.
          </p>
        </Reveal>
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

      {/* Who it's for */}
      <Section tone="surface">
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
      <Section id="reserve">
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
