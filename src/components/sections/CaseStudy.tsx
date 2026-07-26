import { cn } from "@/lib/utils";

/**
 * A labeled, illustrative case study (Step 11 proof system). The badge is
 * always visible; phase names are emphasized; the hedged "Illustratively…"
 * outcome is set apart. Real, permissioned case studies replace these later.
 */

const PHASES = [
  "Aperture Insights",
  "Aperture Analytics",
  "Aperture Intelligence",
  "Aperture Compass",
  "Aperture Live",
];

function renderBody(body: string) {
  const idx = body.indexOf("Illustratively");
  const main = idx >= 0 ? body.slice(0, idx) : body;
  const tail = idx >= 0 ? body.slice(idx) : "";
  const parts = main.split(new RegExp(`(${PHASES.join("|")})`, "g"));
  return (
    <>
      {parts.map((part, i) =>
        PHASES.includes(part) ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
      {tail ? <em className="text-muted">{tail}</em> : null}
    </>
  );
}

export function CaseStudy({
  title,
  body,
  className,
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded border border-line bg-surface p-6 md:p-8 hover-lift", className)}>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-maroon">
        Representative case study · Illustrative
      </p>
      <h3 className="text-h4 font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-body leading-relaxed text-body">{renderBody(body)}</p>
    </div>
  );
}
