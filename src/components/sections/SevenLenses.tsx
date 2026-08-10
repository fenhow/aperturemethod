import { LENSES } from "@/lib/lenses";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The seven lenses, named and explained.
 *
 * The site claimed "seven lenses" in nine places and named them in none. This is the one
 * place they are set out; everything else links here rather than re-describing them, so the
 * marketing copy cannot drift from the instrument that produces the score.
 *
 * Weights are shown on purpose. A prospect comparing us to a firm that will not take their
 * call should be able to see that the instrument is weighted, reproducible and argued for —
 * that is the differentiation, and hiding it wastes it.
 */
export function SevenLenses() {
  return (
    <Section tone="surface">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="The seven lenses"
          title="What we actually look at."
        />
        <p className="mt-6 max-w-3xl text-body-lg text-body">
          Every business is read across the same seven lenses, in the same order, against the
          same criteria. That is what makes one X-Ray comparable to another — and what lets us
          re-score you later and prove the difference rather than assert it.
        </p>
        <p className="mt-4 max-w-3xl text-small text-muted">
          The lenses are weighted. The percentages below are the weights we use, and they are
          the same for every client — the order reflects what actually decides whether an
          owner-run business thrives.
        </p>

        <ol className="mt-12 space-y-px border-t border-line">
          {LENSES.map((lens, i) => (
            <li
              key={lens.id}
              className="grid gap-x-8 gap-y-4 border-b border-line py-8 md:grid-cols-[auto_1fr_auto]"
            >
              <div className="flex items-start gap-4 md:w-64">
                <span
                  aria-hidden="true"
                  className="mt-1 font-mono text-small tabular-nums text-maroon"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-h4 font-semibold text-ink">{lens.name}</h3>
                  <p className="mt-1 text-small italic text-muted">&ldquo;{lens.question}&rdquo;</p>
                </div>
              </div>

              <div className="max-w-2xl">
                <p className="text-body text-ink">{lens.lookAt}</p>
                <p className="mt-3 text-small text-muted">
                  <span className="font-semibold text-ink">Why it weighs what it does. </span>
                  {lens.why}
                </p>
                <p className="mt-2 text-small text-muted">
                  <span className="font-semibold text-ink">What we need. </span>
                  {lens.evidence}
                </p>
              </div>

              <div className="md:text-right">
                <div className="text-h3 font-semibold tabular-nums text-maroon">
                  {Math.round(lens.weight * 100)}
                  <span className="text-h4">%</span>
                </div>
                <div className="text-overline uppercase text-muted">of the score</div>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-3xl text-small text-muted">
          Where the evidence will not support a lens, we mark it insufficient rather than
          estimating it — and we say so on the face of the report. An honest gap is more useful
          than a furnished one, and it is usually the fastest thing to fix.
        </p>
      </div>
    </Section>
  );
}
