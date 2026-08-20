import { Reveal } from "@/components/ui/Reveal";
import { Citation } from "@/components/market/Citation";
import { FIGURES } from "@/lib/marketContext";

/**
 * A band of published figures, with its citation attached.
 *
 * The citation is not optional and is not a prop. Every place these numbers
 * appear, the source appears with them, because a statistic separated from its
 * source is the thing this file exists to prevent.
 */
export function MarketFigures({
  keys = ["count", "shareOfBusinesses", "employees", "shareOfGdp"],
  className = "",
}: {
  keys?: (keyof typeof FIGURES)[];
  className?: string;
}) {
  return (
    <div className={className}>
      <Reveal>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((k) => {
            const f = FIGURES[k];
            return (
              <div key={k} className="rounded-lg border border-line bg-paper p-6">
                <dt className="text-h3 font-semibold text-maroon">{f.value}</dt>
                <dd className="mt-2 text-small text-muted">{f.label}</dd>
              </div>
            );
          })}
        </dl>
      </Reveal>
      <Reveal delay={80} className="mt-5 max-w-measure">
        <Citation figures={keys} />
      </Reveal>
    </div>
  );
}
