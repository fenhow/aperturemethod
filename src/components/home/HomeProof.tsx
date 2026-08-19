import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { DocumentLightbox } from "@/components/ui/DocumentLightbox";

const REPORT = "/reports/Lumina-Aperture-Method-Example-Report.pdf";

/**
 * The proof block.
 *
 * The homepage carried one buried link to the example report and never named
 * the business, the numbers, or what was found. A reader deciding whether any
 * of this is real had nothing to check.
 *
 * The label matters as much as the numbers. Lumina is a worked example, not a
 * client, and saying so plainly on the page is both the honest thing and the
 * more persuasive one: a firm that marks its own examples is a firm you can
 * believe when it does have a client result to show.
 */
export function HomeProof() {
  return (
    <Section tone="surface">
      <div className="max-w-measure">
        <Reveal>
          <p className="eyebrow mb-4">The proof</p>
          <h2 className="heading-gradient text-h2 font-semibold">
            What does this look like on a real business?
          </h2>
        </Reveal>
      </div>

      <Reveal delay={80} className="mt-8">
        <div className="max-w-measure rounded-lg border border-line bg-paper p-7">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-maroon" aria-hidden="true" />
            Illustrative example
          </span>
          <h3 className="mt-4 text-h3 font-semibold text-ink">Lumina Medical Aesthetics</h3>
          <p className="mt-3 text-body text-body">
            A growing three-clinic med-spa. Revenue climbed 61% in three years while profit stayed
            essentially flat. All five phases ran end to end, and the constraint that explained it
            was new-patient retention, not pricing and not demand. The full report is attached so
            you can check the arithmetic rather than take the summary on trust.
          </p>
          <p className="mt-3 text-small text-muted">
            Lumina is a worked example built to demonstrate the Method, not a client engagement, and
            it is labelled that way everywhere it appears. No client work is published without
            written permission.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <DocumentLightbox
              href={REPORT}
              page={10}
              title="Example Report · The Aperture Method: Lumina Medical Aesthetics"
              triggerLabel="Read the full example report"
              triggerClassName="btn--secondary"
            />
            <LinkArrow href="/case-studies/lumina-medical-aesthetics">
              See the whole engagement
            </LinkArrow>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
