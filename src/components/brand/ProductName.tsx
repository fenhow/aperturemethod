import { cn } from "@/lib/utils";

/**
 * Compact display of an Aperture phase-product: the aperture iris mark used as a
 * monogram, followed by the product's distinct short word (e.g. ◉ Analytics).
 * The mark does the "Aperture" work visually, so repeated mentions across cards,
 * labels, and chips stay light. Use the full "Aperture X™" name for the first /
 * most-prominent mention on a page; use this everywhere it repeats.
 *
 * `tone="dark"` uses the white mark (for dark surfaces); default uses the black
 * mark (for light surfaces).
 */
export function ProductName({
  short,
  tone = "light",
  markSize = "0.92em",
  className,
}: {
  short: string;
  tone?: "light" | "dark";
  markSize?: string;
  className?: string;
}) {
  const icon = tone === "dark" ? "/logo-icon-white.png" : "/logo-icon-black.png";
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="inline-block shrink-0"
        style={{ height: markSize, width: markSize, objectFit: "contain" }}
      />
      <span>{short}</span>
    </span>
  );
}
