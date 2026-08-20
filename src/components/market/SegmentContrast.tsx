import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ALREADY_HAS, USUALLY_LACKS, SEGMENT } from "@/lib/marketContext";

/**
 * The position an established private business is in.
 *
 * The right-hand column is the whole argument, and its heading is doing more
 * work than it looks. "What almost nobody has at this size" says the absence
 * is a fact of scale, not a failure of management. An owner reading a list of
 * things their company lacks will close the page if the framing suggests they
 * should have built them. They should not have. Nobody at this size does.
 */
export function SegmentContrast({ tone = "surface" }: { tone?: "paper" | "surface" }) {
  return (
    <Section tone={tone}>
      <div className="max-w-measure">
        <Reveal>
          <p className="eyebrow mb-4">The position you are in</p>
          <h2 className="heading-gradient text-h2 font-semibold">
            You have the business. What you may not have is the department that reads it.
          </h2>
          <p className="mt-6 text-body-lg text-body">
            An established business between {SEGMENT.floor} and {SEGMENT.ceiling} sits in a specific
            place: past the point where instinct alone covers every decision, and short of the point
            where a finance and strategy function pays for itself in headcount.
          </p>
        </Reveal>
      </div>

      <Reveal delay={80} className="mt-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-paper p-7">
            <h3 className="text-h4 font-semibold text-ink">What you have already built</h3>
            <ul className="mt-5 space-y-2.5">
              {ALREADY_HAS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-body">
                  <span
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-maroon"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-line bg-paper p-7">
            <h3 className="text-h4 font-semibold text-ink">What almost nobody has at this size</h3>
            <ul className="mt-5 space-y-2.5">
              {USUALLY_LACKS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-muted">
                  <span
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full border border-line"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-8">
        <p className="max-w-measure border-l-2 border-maroon pl-6 text-h4 font-light leading-snug text-ink">
          That is not a gap in how the business is run. It is a gap in what a business this size can
          reasonably justify hiring for.
        </p>
      </Reveal>
    </Section>
  );
}
