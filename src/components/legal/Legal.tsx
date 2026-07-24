import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Shared, responsive shell + typographic primitives for legal / policy pages
 * (Privacy, Terms, Accessibility). Constrained reading measure, consistent
 * rhythm, no bespoke styling per page.
 */
export function LegalShell({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <Section className="pt-28 md:pt-36">
      <Reveal className="max-w-measure">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h1 className="heading-gradient text-h1 font-semibold">{title}</h1>
        <p className="mt-4 text-small text-muted">Last updated {updated}</p>
        {intro ? <p className="mt-6 text-body-lg text-body">{intro}</p> : null}
        <div className="mt-10">{children}</div>
      </Reveal>
    </Section>
  );
}

export function LegalH2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-12 text-h3 font-semibold text-ink">{children}</h2>;
}

export function LegalP({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-body leading-relaxed text-body">{children}</p>;
}

export function LegalUL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-body text-body">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
