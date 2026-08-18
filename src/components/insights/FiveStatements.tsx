import Image from "next/image";
import {
  statementPanels,
  statementConnections,
  statementCycle,
  statementFigure,
  type StatementPanel,
  type StatementGroup,
} from "@/lib/fiveStatements";

/**
 * The five financial statements, as a figure inside an article.
 *
 * Two renderings of the same content, chosen by viewport. On a wide screen the
 * printed artwork is the better thing to look at: it was designed as one image
 * and it reads as one. Below that width the artwork is 1402px of small type on
 * a 390px screen, which is not a figure, it is a wall. So the same content is
 * rebuilt as stacked panels that a person can actually read on a phone.
 *
 * Both come from src/lib/fiveStatements.ts. Change wording in one and change it
 * in the other, or the page starts contradicting itself.
 */

function Rows({ group }: { group: StatementGroup }) {
  const hasOps = group.rows.some((r) => r.op);
  return (
    <div className="mt-3">
      {group.title && (
        <p className="text-small font-semibold uppercase tracking-wide text-maroon">{group.title}</p>
      )}
      <ul className="mt-1.5 border-t border-line">
        {group.rows.map((r) => (
          <li key={r.label} className="flex gap-3 border-b border-line py-2">
            {hasOps && (
              <span className="w-4 shrink-0 text-small font-bold text-maroon" aria-hidden={!r.op}>
                {r.op ?? ""}
              </span>
            )}
            <span className="text-small text-ink">
              {r.label}
              {r.sub && <span className="block text-[13px] leading-snug text-muted">{r.sub}</span>}
            </span>
          </li>
        ))}
      </ul>
      {group.total && <p className="mt-2 text-small font-semibold text-ink">{group.total}</p>}
    </div>
  );
}

function Panel({ panel }: { panel: StatementPanel }) {
  const band = panel.tone === "maroon" ? "bg-maroon" : "bg-dark";
  return (
    <div className="overflow-hidden rounded border border-line bg-paper">
      <div className={`flex items-start gap-3 px-4 py-3 ${band}`}>
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-[13px] font-bold text-paper">
          {panel.n}
        </span>
        <div>
          <p className="text-body font-semibold leading-tight text-paper">{panel.title}</p>
          <p className="mt-0.5 text-[13px] text-white/70">{panel.when}</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <p className="text-small text-muted">{panel.shows}</p>
        <p className="eyebrow mt-5 text-maroon">{panel.blockTitle}</p>
        {panel.equation && (
          <p className="mt-2 text-small font-semibold text-ink">{panel.equation}</p>
        )}
        {panel.groups.map((g, i) => (
          <Rows key={g.title ?? i} group={g} />
        ))}
        {panel.footer && <p className="mt-4 text-small italic text-muted">{panel.footer}</p>}
      </div>

      <div className={`px-4 py-3 ${band}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">Question</p>
        <p className="mt-1 text-small italic text-paper">{panel.question}</p>
      </div>
    </div>
  );
}

export function FiveStatements() {
  return (
    /*
     * The article column is capped at a reading measure, which is right for
     * prose and far too narrow for this artwork. From lg up the figure breaks
     * out to the full container width so the printed graphic is legible at the
     * size it was drawn for.
     */
    <figure className="my-12 lg:w-[min(1152px,calc(100vw-8rem))]">
      {/* Wide screens: the artwork itself. */}
      <div className="hidden lg:block">
        <a
          href={statementFigure.src}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded border border-line transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
        >
          <Image
            src={statementFigure.src}
            alt={statementFigure.alt}
            width={statementFigure.width}
            height={statementFigure.height}
            sizes="(max-width: 1023px) 100vw, (max-width: 1279px) calc(100vw - 8rem), 1152px"
            className="h-auto w-full rounded"
            priority={false}
          />
        </a>
      </div>

      {/* Narrow screens: the same thing, readable. */}
      <div className="lg:hidden">
        <div className="space-y-4">
          {statementPanels.map((p) => (
            <Panel key={p.n} panel={p} />
          ))}
        </div>

        <div className="mt-8 rounded border border-line bg-surface p-5">
          <p className="eyebrow text-maroon">The big picture: how they connect</p>
          <ol className="mt-4 space-y-3">
            {statementConnections.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon text-[13px] font-bold text-paper">
                  {i + 1}
                </span>
                <span className="text-small text-body">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 rounded bg-dark p-5">
          <p className="text-body font-semibold text-paper">{statementCycle.title}</p>
          <p className="mt-2 text-small text-white/70">{statementCycle.body}</p>
          <ul className="mt-4 space-y-2">
            {statementCycle.points.map((pt) => (
              <li key={pt} className="flex gap-3 text-small text-white/85">
                <span className="text-maroon-onDark" aria-hidden="true">
                  ✓
                </span>
                {pt}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figcaption className="mt-5 max-w-measure text-small text-muted">
        {statementFigure.caption}{" "}
        <a
          href={statementFigure.src}
          target="_blank"
          rel="noopener noreferrer"
          className="link-inline"
        >
          Open the full-size graphic
        </a>
        .
      </figcaption>
    </figure>
  );
}
