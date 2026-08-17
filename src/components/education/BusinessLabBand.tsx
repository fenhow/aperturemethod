import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { businessLab } from "@/lib/businessLab";

/**
 * The band, the door to /business-lab. Used low on the homepage and
 * on About. Deliberately not in the primary nav: this is who the firm is, not
 * something it sells.
 */
export function BusinessLabBand({ tone = "surface" }: { tone?: "surface" | "paper" }) {
  return (
    <Section tone={tone} className="border-y border-line">
      <Reveal>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-measure">
            <p className="eyebrow mb-4">Free for schools · {businessLab.grades.toLowerCase()}</p>
            <h2 className="text-h2 font-semibold text-ink">{businessLab.nameTm}</h2>
            <p className="mt-3 text-body-lg font-semibold text-maroon">{businessLab.promise}</p>
            <p className="mt-5 text-body-lg text-muted">
              A 50-minute guest-speaker session for economics, business and career classes.
              Students get a card describing a real business and fifteen minutes to find the one
              thing holding it back, which is the same question we get paid to answer. No fee,
              nothing sold to students, any school that will have us.
            </p>
          </div>
          <div className="shrink-0">
            <Link href={businessLab.slug} className="btn">
              See the session
            </Link>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
