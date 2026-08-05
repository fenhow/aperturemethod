import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { PreorderForm } from "@/components/forms/PreorderForm";

/**
 * "The Book" segment — a 3D cover mockup of the forthcoming Aperture Method
 * book by Fenwick How, marked in progress. The cover is built in CSS (no image
 * asset yet) so it can evolve with the brand.
 */
export function BookSection() {
  return (
    <Section tone="surface" id="book">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        {/* 3D book mockup */}
        <Reveal variant="right" className="flex justify-center lg:justify-start">
          <div className="book3d">
            <div className="book3d__inner">
              {/* Front cover */}
              <div className="book3d__cover">
                <div className="book3d__glow" aria-hidden="true" />
                <span className="book3d__frame" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-icon-white.png" alt="" className="book3d__mark" />
                <p className="book3d__eyebrow">A Business Methodology</p>
                <h3 className="book3d__title">
                  The
                  <br />
                  Aperture
                  <br />
                  Method
                </h3>
                <span className="book3d__rule" aria-hidden="true" />
                <p className="book3d__sub">
                  Big-company intelligence, built for the businesses everyone else ignores.
                </p>
                <div className="book3d__foot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/fenwick-signature-black.png" alt="" className="book3d__sig" />
                  <p className="book3d__author">Fenwick How</p>
                </div>
              </div>
              {/* Page block + spine */}
              <div className="book3d__pages" aria-hidden="true" />
              <div className="book3d__spine" aria-hidden="true" />
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal variant="left" delay={90}>
          <p className="eyebrow">The book · in progress</p>
          <h2 className="mt-4 text-h2 font-semibold text-ink">
            The methodology, written down.
          </h2>
          <p className="mt-6 max-w-measure text-body-lg text-body">
            The Aperture Method is becoming a book — the full system laid out end to end: why owner-run
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
              <span className="text-small text-muted">Reserve your copy — no charge now.</span>
            </div>
            <PreorderForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
