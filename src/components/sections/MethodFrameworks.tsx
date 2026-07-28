import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProductName } from "@/components/brand/ProductName";
import { methodPhases } from "@/lib/content";

/**
 * "Under the hood" depth layer: the named frameworks and techniques applied in
 * each of the five phases. Proof of MBA-level rigor for the buyer who wants to
 * verify the substance — kept below the plain-language narrative on purpose.
 */
export function MethodFrameworks() {
  return (
    <Section tone="surface">
      <Reveal className="max-w-measure">
        <SectionHeading
          eyebrow="Under the hood"
          title="The frameworks behind the Method."
          lede="The same graduate-level (MBA) business science big-company strategy teams use — applied, in plain language, to your business. Here's the toolkit each phase draws on."
        />
      </Reveal>

      <div className="mt-12 space-y-px overflow-hidden rounded-lg border border-line bg-line">
        {methodPhases.map((p) => (
          <Reveal key={p.n}>
            <div className="grid gap-5 bg-paper p-6 md:grid-cols-[1fr_2fr] md:gap-10 md:p-8">
              <div>
                <p className="eyebrow">{p.verb}</p>
                <div className="mt-2">
                  <ProductName short={p.short} tone="light" />
                </div>
                <p className="mt-2 text-small text-muted">{p.question}</p>
              </div>
              <div className="flex flex-wrap gap-2 self-center">
                {p.frameworks.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-line bg-surface px-3 py-1.5 text-small font-medium text-body"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 max-w-measure text-small italic text-muted">
        You don&apos;t need to know these by name — that&apos;s our job. They run quietly underneath
        the plain-language work you actually see.
      </p>
    </Section>
  );
}
