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
        {/* 3D book — rotates to reveal front, spine, pages, and back */}
        <Reveal variant="right" className="flex justify-center py-6 lg:justify-start">
          <div className="book360" title="Hover to pause">
            <div className="book360__stage">
              {/* Front cover */}
              <div className="book360__face book360__front">
                <div className="book360__glow" aria-hidden="true" />
                <span className="book360__frame" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-icon-white.png" alt="" className="book360__mark" />
                <p className="book360__eyebrow">A Business Methodology</p>
                <h3 className="book360__title">
                  The
                  <br />
                  Aperture
                  <br />
                  Method<span className="book360__tm">™</span>
                </h3>
                <span className="book360__rule" aria-hidden="true" />
                <p className="book360__sub">
                  Big-company intelligence, built for the businesses everyone else ignores.
                </p>
                <div className="book360__foot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/fenwick-signature-black.png" alt="" className="book360__sig" />
                  <p className="book360__author">Fenwick How</p>
                </div>
              </div>

              {/* Back cover — photo + excerpt */}
              <div className="book360__face book360__back">
                <span className="book360__frame" aria-hidden="true" />
                <p className="book360__kicker">From the book</p>
                <p className="book360__excerpt">
                  Big companies don&apos;t outgrow you because they&apos;re smarter. They outgrow you
                  because they can <b>see</b> — their numbers, their customers, their market — while
                  you run on instinct. Your business already has the data. This book is about finally
                  turning it into decisions.
                </p>
                <div className="book360__authorbox">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/fenwick-how.jpg" alt="Fenwick How" className="book360__photo" />
                  <div>
                    <p className="book360__aname">Fenwick How</p>
                    <p className="book360__arole">Founder, The Aperture Method™</p>
                  </div>
                </div>
              </div>

              {/* Spine + edges */}
              <div className="book360__face book360__spine" aria-hidden="true">
                <span className="book360__spinetext">The Aperture Method™ · Fenwick How</span>
              </div>
              <div className="book360__face book360__pages" aria-hidden="true" />
              <div className="book360__face book360__top" aria-hidden="true" />
              <div className="book360__face book360__bottom" aria-hidden="true" />
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
