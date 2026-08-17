import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PreorderForm } from "@/components/forms/PreorderForm";
import { Book3D } from "@/components/home/Book3D";

/**
 * "The Book" segment: a 3D cover mockup of the forthcoming Aperture Method
 * book by Fenwick How, marked in progress. The cover is built in CSS (no image
 * asset yet) so it can evolve with the brand.
 */
export function BookSection() {
  return (
    <Section tone="surface" id="book">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        {/* 3D book: drag to spin; reveals front, spine, pages, and back */}
        <Reveal variant="right" className="flex flex-col items-center gap-3 py-6 lg:items-start">
          <Book3D />
          <p className="text-small text-muted">Drag the book to spin it →</p>
        </Reveal>

        {/* Copy */}
        <Reveal variant="left" delay={90}>
          <p className="eyebrow">The book · in progress</p>
          <h2 className="mt-4 text-h2 font-semibold text-ink">
            The methodology, written down.
          </h2>
          <p className="mt-6 max-w-measure text-body-lg text-body">
            The Aperture Method is becoming a book, the full system laid out end to end: why owner-run
            businesses are the last ones without real intelligence, and the five-component path that
            brings a business into focus, from the first honest assessment to a living platform you run
            the company from.
          </p>
          <p className="mt-4 max-w-measure text-body text-muted">
            Written by Fenwick How, founder of The Aperture Method. In progress now.
          </p>

          <div className="mt-8">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-small font-semibold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-maroon" aria-hidden="true" />
                Coming soon
              </span>
              <span className="text-small text-muted">Reserve your copy, no charge now.</span>
            </div>
            <PreorderForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
