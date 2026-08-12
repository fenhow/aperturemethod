import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { lookCloser } from "@/lib/lookCloser";

/**
 * The community band — the door to /look-closer. Used low on the homepage and
 * on About. Deliberately not in the primary nav: this is who the firm is, not
 * something it sells.
 */
export function LookCloserBand({ tone = "surface" }: { tone?: "surface" | "paper" }) {
  return (
    <Section tone={tone} className="border-y border-line">
      <Reveal>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-measure">
            <p className="eyebrow mb-4">{lookCloser.eyebrow}</p>
            <h2 className="text-h2 font-semibold text-ink">
              We teach this free in local schools.
            </h2>
            <p className="mt-5 text-body-lg text-muted">
              <span className="font-semibold text-ink">Look Closer</span> is a 50-minute session for{" "}
              {lookCloser.grades.toLowerCase()}. Students get a card describing a real-looking
              business in The Woodlands and fifteen minutes to find the one thing holding it back —
              the same question we get paid to answer. No cost, nothing sold, and the whole packet is
              free for any teacher to download and run.
            </p>
          </div>
          <div className="shrink-0">
            <Link href={lookCloser.slug} className="btn">
              See the session
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
