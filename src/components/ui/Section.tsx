import { Container } from "./Container";
import { cn } from "@/lib/utils";

type Tone = "paper" | "surface" | "dark";

/**
 * Vertical section wrapper with consistent rhythm and a tone.
 * `dark` sets the paper-on-dark bookend context.
 */
export function Section({
  tone = "paper",
  id,
  className,
  containerClassName,
  children,
}: {
  tone?: Tone;
  id?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "surface"
      ? "bg-surface"
      : tone === "dark"
        ? "bg-dark text-paper"
        : "bg-paper";

  return (
    <section id={id} className={cn(toneClass, "py-section", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
