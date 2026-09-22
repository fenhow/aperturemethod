import Link from "next/link";
import { cn } from "@/lib/utils";
import { CURRICULUM_ANCHOR, PROGRAM, coursesFor } from "@/lib/coursework";

/**
 * A quiet citation line: which graduate course a product's method is drawn from.
 * Reads like a footnote in a good report, not a badge. Renders nothing when the
 * product has no course attached.
 */
export function Provenance({ short, onDark = false, className }: { short: string; onDark?: boolean; className?: string }) {
  const courses = coursesFor(short);
  if (!courses.length) return null;
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t pt-4 text-[11px] font-semibold uppercase tracking-[0.14em]",
        onDark ? "border-white/10 text-white/55" : "border-line text-muted",
        className
      )}
    >
      <span className={onDark ? "text-maroon-onDark" : "text-maroon"}>Applied from</span>
      {courses.map((c, i) => (
        <Link
          key={c.code}
          href={CURRICULUM_ANCHOR}
          className={cn("underline-offset-4 transition-colors hover:underline", onDark ? "hover:text-white" : "hover:text-ink")}
        >
          {c.code} · {c.title}
          {i < courses.length - 1 ? "," : ""}
        </Link>
      ))}
      <span className="font-normal normal-case tracking-normal">· {PROGRAM}</span>
    </p>
  );
}
