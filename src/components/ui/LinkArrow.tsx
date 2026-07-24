import Link from "next/link";
import { ArrowRight } from "./icons";
import { cn } from "@/lib/utils";

/**
 * Standalone "Read more →" style link. The arrow nudges on hover
 * (see `.link-arrow` in globals.css).
 */
export function LinkArrow({
  href,
  children,
  onDark = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "link-arrow",
        onDark && "text-paper hover:text-maroon-soft",
        className
      )}
    >
      {children}
      <ArrowRight className="arrow h-[1.05em] w-[1.05em]" />
    </Link>
  );
}
