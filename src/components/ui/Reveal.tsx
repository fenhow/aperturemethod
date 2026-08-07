"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. Children start slightly offset/transparent and animate
 * into place the first time they enter the viewport. Fully accessible:
 * - honors `prefers-reduced-motion` (shows content immediately, no motion),
 * - marked with `data-reveal` so a <noscript> style can force visibility when
 *   JavaScript is unavailable (see layout.tsx).
 *
 * `variant` sets the entrance; `delay` (ms) staggers items in a group.
 */
type Variant = "up" | "down" | "zoom" | "fade" | "left" | "right";

/*
 * The horizontal variants only apply from `sm` up. On a phone every column is
 * already full-bleed, so a 32px sideways offset pushes the document wider than
 * the viewport and the whole page rubber-bands sideways until the section
 * scrolls into view. Below `sm` they enter vertically instead.
 */
const PRE: Record<Variant, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  zoom: "scale-[0.96]",
  fade: "",
  left: "translate-y-8 sm:translate-y-0 sm:translate-x-8",
  right: "translate-y-8 sm:translate-y-0 sm:-translate-x-8",
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out will-change-transform motion-reduce:!transform-none motion-reduce:!transition-none",
        shown ? "translate-x-0 translate-y-0 scale-100 opacity-100" : cn("opacity-0", PRE[variant]),
        className
      )}
    >
      {children}
    </div>
  );
}
