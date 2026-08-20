import { SOURCES, FIGURES, type Figure } from "@/lib/marketContext";

/**
 * The source line under a set of figures.
 *
 * Every statistic on this site carries one. A number attributed to a federal
 * agency is the easiest thing on a page for a sceptical reader to check, so
 * the citation is a feature rather than small print: it invites the check.
 * The data year is included because most of these figures describe a year
 * earlier than the document that publishes them, and quietly implying
 * otherwise is the kind of thing that costs a firm its credibility once.
 */
export function Citation({
  figures,
  onDark = false,
}: {
  figures: (keyof typeof FIGURES)[];
  onDark?: boolean;
}) {
  const used = figures.map((k) => FIGURES[k]!).filter(Boolean) as Figure[];
  const sourceIds = Array.from(new Set(used.map((f) => f.source)));
  const years = Array.from(new Set(used.map((f) => f.dataYear ?? SOURCES[f.source]!.dataYear)));

  return (
    <p className={"text-small " + (onDark ? "text-white/50" : "text-muted")}>
      Source:{" "}
      {sourceIds.map((id, i) => {
        const source = SOURCES[id]!;
        return (
          <span key={id}>
            {i > 0 && "; "}
            {source.publisher},{" "}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={onDark ? "underline hover:text-white" : "link-inline"}
            >
              {source.title}
            </a>
          </span>
        );
      })}
      . Data year{years.length > 1 ? "s" : ""} {years.join(", ")}.
    </p>
  );
}
