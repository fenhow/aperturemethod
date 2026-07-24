import { cn } from "@/lib/utils";

/**
 * Eyebrow + heading + optional lede — the standard section header.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  onDark = false,
  className,
  headingClassName,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  onDark?: boolean;
  className?: string;
  headingClassName?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-measure", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow mb-4", onDark && "eyebrow--on-dark")}>{eyebrow}</p>
      ) : null}
      <Heading
        className={cn(
          "text-h2 font-semibold",
          onDark ? "text-paper" : "heading-gradient",
          headingClassName
        )}
      >
        {title}
      </Heading>
      {lede ? (
        <p className={cn("mt-5 text-body-lg", onDark ? "text-white/70" : "text-muted")}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}
