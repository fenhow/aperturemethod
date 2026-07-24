import { cn } from "@/lib/utils";

/**
 * Centered content container capped at 1280px with responsive gutters
 * (uses the Tailwind `.container` token from Stage 2).
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("container", className)}>{children}</div>;
}
