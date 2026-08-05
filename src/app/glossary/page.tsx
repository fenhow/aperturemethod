import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { glossary } from "@/lib/glossary";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Data Dictionary — Every Aperture Term, Defined",
  description:
    "A plain-language glossary of every Aperture term and the analytics/GIS vocabulary — the Method, the five components, the deliverables, demographics, GIS, and more.",
  path: "/glossary",
});

export default function GlossaryPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-dark text-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(60% 70% at 80% 24%, rgba(140,43,43,0.22), transparent 62%)" }}
        />
        <div className="container relative z-10 pb-14 pt-32 md:pb-16 md:pt-40">
          <Reveal className="max-w-3xl">
            <p className="eyebrow eyebrow--on-dark mb-5">Reference</p>
            <h1 className="text-display font-semibold text-paper">Data dictionary.</h1>
            <p className="mt-5 max-w-xl text-body-lg text-white/70">
              Every Aperture term and the analytics and GIS vocabulary behind the Method — defined in
              plain language, so nothing is a black box.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Quick jump */}
      <div className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur-sm">
        <div className="container flex flex-wrap gap-x-6 gap-y-2 py-4">
          {glossary.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="text-small font-semibold text-muted transition-colors hover:text-maroon"
            >
              {g.title}
            </a>
          ))}
        </div>
      </div>

      {glossary.map((g, gi) => (
        <Section key={g.id} id={g.id} tone={gi % 2 === 1 ? "surface" : "paper"} className="scroll-mt-16">
          <Reveal>
            <h2 className="text-h3 font-semibold text-ink">{g.title}</h2>
          </Reveal>
          <dl className="mt-8 divide-y divide-line border-t border-line">
            {g.terms.map((t) => (
              <Reveal key={t.term}>
                <div className="grid gap-2 py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] md:gap-10">
                  <dt className="text-h4 font-semibold text-ink">{t.term}</dt>
                  <dd className="text-body text-body">{t.def}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Section>
      ))}
    </>
  );
}
