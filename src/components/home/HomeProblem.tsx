import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";

/**
 * The problem block.
 *
 * The homepage explained what the firm does and what it costs, and never once
 * said out loud what the owner is losing by not knowing. That is the block that
 * makes a reader feel spoken to rather than sold at, and it was simply missing.
 *
 * Kept short on purpose. The full version lives on the Business X-Ray landing
 * page, and this links there rather than repeating it: two pages arguing the
 * same point at the same length compete with each other.
 */
export function HomeProblem() {
  return (
    <Section>
      <div className="max-w-measure">
        <Reveal>
          <p className="eyebrow mb-4">The problem</p>
          <h2 className="heading-gradient text-h2 font-semibold">
            What is it costing you not to know?
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-6 text-body-lg text-body">
            You can tell me last month&apos;s revenue to the dollar. Now rank your products, your
            customers and your locations from most profitable to least, after the real cost of
            serving each one. Most owners cannot, and it has nothing to do with ability. Nobody ever
            built them the view.
          </p>
          <p className="mt-5 text-body text-body">
            That gap has a price. A long tail of products quietly loses money once you count the
            labour. Some of your most demanding customers cost more than they pay. The busiest
            location is often not the most profitable one, and it is usually the one the next
            expansion gets modelled on. None of it shows up in revenue, and the profit line at the
            bottom of the P&amp;L adds the winners and the losers together before you see them.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-8 border-l-2 border-maroon pl-6 text-h4 font-light leading-snug text-ink">
            A business can be profitable overall and still be profitable in spite of itself.
          </p>
          <p className="mt-6">
            <LinkArrow href="/business-x-ray">
              See how a Business X-Ray finds it
            </LinkArrow>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
