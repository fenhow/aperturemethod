import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { ProductName } from "@/components/brand/ProductName";
import { coursework, PROGRAM } from "@/lib/coursework";

/**
 * Method Lab · Coursework in Practice.
 *
 * A running, dated log of each Executive MBA course and what it changed in the
 * Method, newest first. Built for sharing with the cohort and instructors, so it
 * is PUBLIC (allowlisted in src/middleware.ts and src/app/robots.ts) while the
 * rest of /method-lab stays gated. Not in the main nav; linked from the Method
 * Lab page and the curriculum map.
 *
 * Everything renders from src/lib/coursework.ts: add a course there and it
 * appears here, in the curriculum map, the provenance lines and the menu tags.
 * Credential rule: the MBA is in progress; no school logos; no implied endorsement.
 */

export const metadata: Metadata = {
  title: "Coursework in Practice, Method Lab",
  description:
    "How Executive MBA coursework is built into The Aperture Method, course by course: what each one changed, and where to see it live.",
};

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });

export default function Page() {
  const log = [...coursework].sort((a, b) => b.landed.localeCompare(a.landed));
  return (
    <>
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            <Link href="/method-lab" className="-my-1.5 inline-block py-2 hover:text-maroon">Method Lab</Link> · Coursework in Practice
          </p>
          <h1 className="mt-4 text-h1 font-semibold text-ink">The Method, as the coursework lands.</h1>
          <p className="mt-6 text-body-lg text-body">
            Fenwick is currently completing an Executive MBA at Texas A&amp;M University&apos;s Mays Business
            School. The Aperture Method is revised as each course lands: not as notes, but as working tools
            and analysis on this site. This is the running log, newest first.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-small text-muted">
            <span><b className="text-ink">{coursework.length}</b> courses built in</span>
            <span>
              <b className="text-ink">{new Set(coursework.flatMap((c) => c.products)).size}</b> of 5 components changed
            </span>
            <span>Last update <b className="text-ink">{fmt(log[0]!.landed)}</b></span>
          </div>
        </Reveal>
      </Section>

      <Section tone="surface">
        <ol className="relative space-y-10 border-l border-line pl-8 md:pl-12">
          {log.map((c, i) => (
            <li key={c.code} className="relative">
              <Reveal variant="up" delay={i * 80}>
              <span className="absolute -left-[39px] top-1 z-10 h-3 w-3 rounded-full border-2 border-maroon bg-paper md:-left-[53px]" aria-hidden="true" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-maroon">{fmt(c.landed)}</p>
              <div className="mt-3 rounded-lg border border-line bg-paper p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-h3 font-semibold text-ink">
                    {c.code} <span className="font-light text-muted">· {c.title}</span>
                  </h2>
                  <div className="flex flex-wrap gap-4 text-small font-semibold text-ink">
                    {c.products.map((s) => (
                      <ProductName key={s} short={s} tone="light" />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-body text-body">{c.built}</p>
                <ul className="mt-6 space-y-2.5">
                  {c.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-small text-body">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
                  {c.seeIt.map((l) => (
                    <Link key={l.href} href={l.href} className="btn--secondary !px-4 !py-2.5 !text-[13px]">
                      {l.label} &rarr;
                    </Link>
                  ))}
                </div>
              </div>
              </Reveal>
            </li>
          ))}
          <li className="relative">
            <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-dashed border-muted bg-surface md:-left-[53px]" aria-hidden="true" />
            <p className="text-small text-muted">Next course: added here when its work lands.</p>
          </li>
        </ol>
      </Section>

      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading
            eyebrow="How to read this"
            title="Cited for provenance, not decoration."
            lede="Each course is credited where its work shows up: a quiet line on the product page, a tag in the menu, and the curriculum map on the Method page. The analysis on those pages uses illustrative data for a fictional client; the methods are real."
          />
          <p className="mt-6 text-small text-muted">
            {PROGRAM} in progress · Mays Business School, Texas A&amp;M University. Course codes are cited to show where
            methods come from; this site is not affiliated with or endorsed by the university.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <LinkArrow href="/the-aperture-method#curriculum">The curriculum map</LinkArrow>
            <LinkArrow href="/the-aperture-method">The Aperture Method</LinkArrow>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
