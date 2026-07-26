import { methodPhases } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The five-phase method as a numbered strip with the continuous
 * "Aperture platform" band beneath. Reused on the homepage and the Method page.
 */
export function MethodStrip({
  withDeliverables = false,
  className,
}: {
  withDeliverables?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
        {methodPhases.map((p) => (
          <div key={p.n} className="bg-paper p-6">
            <div className="text-h3 font-semibold leading-none text-maroon">{p.n}</div>
            <h3 className="mt-3 text-h4 font-semibold text-ink">{p.product}&trade;</h3>
            <p className="mt-1 text-overline font-semibold uppercase tracking-overline text-maroon">
              {p.verb} · {p.question}
            </p>
            <p className="mt-2 text-small leading-relaxed text-muted">{p.line}</p>
            {withDeliverables ? (
              <p className="mt-3 text-small font-semibold text-maroon">
                You get: {p.deliverable}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "mt-4 flex flex-col gap-1 rounded bg-dark px-6 py-4 text-paper sm:flex-row sm:items-center sm:justify-between"
        )}
      >
        <span className="flex items-center text-[15px] font-semibold">
          <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-maroon-soft" aria-hidden="true" />
          Aperture platform — the intelligence you keep
        </span>
        <span className="text-small text-white/50">
          Runs beneath all five phases · yours after the engagement
        </span>
      </div>
    </div>
  );
}
