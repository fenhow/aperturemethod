import { coursework, PROGRAM } from "@/lib/coursework";
import { ProductName } from "@/components/brand/ProductName";

/**
 * The curriculum map: each graduate course and what it built into the Method.
 * Lives on /the-aperture-method (anchor #curriculum) under the frameworks provenance
 * paragraph; the Provenance lines on product pages link here.
 */
export function CurriculumMap() {
  return (
    <div id="curriculum" className="mt-10 scroll-mt-28 max-w-measure">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        Curriculum map · {PROGRAM}
      </p>
      <dl className="mt-4 divide-y divide-line border-y border-line">
        {coursework.map((c) => (
          <div key={c.code} className="grid gap-2 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
            <dt>
              <span className="block text-small font-semibold text-ink">{c.code}</span>
              <span className="block text-small text-muted">{c.title}</span>
            </dt>
            <dd className="text-small text-body">
              <div className="mb-1 flex flex-wrap gap-3 font-semibold text-ink">
                {c.products.map((s) => (
                  <ProductName key={s} short={s} tone="light" />
                ))}
              </div>
              {c.built}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
