import { cn } from "@/lib/utils";

/**
 * Aperture family lockup: the six-blade aperture mark, "APERTURE", a hairline
 * divider, then the variable word ("METHOD" for the parent; a component name
 * like "ATLAS" for the family). Rendered live (not flat art) so it stays crisp
 * at any size, flips for dark backgrounds, and flexes across the family.
 *
 * Sized by FONT-SIZE: the caller passes a text utility (e.g. `text-[19px]` or a
 * fluid `text-[clamp(...)]`); the icon and divider scale in `em`. `tone="light"`
 * renders for dark backgrounds.
 */

const ICON = {
  dark: "/logo-icon-black.png", // dark blades for light backgrounds
  light: "/logo-icon-white.png", // white blades for dark backgrounds
  onred: "/logo-icon-white.png",
} as const;

export function Logo({
  className,
  tone = "dark",
  variant = "METHOD",
}: {
  className?: string;
  tone?: "dark" | "light" | "onred";
  variant?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.5em] whitespace-nowrap leading-none",
        tone === "dark" ? "text-ink" : "text-white",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ICON[tone]} alt="" className="h-[1.35em] w-auto select-none" />
      <span className="font-semibold tracking-[0.06em]">APERTURE</span>
      <span
        aria-hidden="true"
        className="mx-[0.15em] inline-block h-[0.95em] w-px bg-current opacity-30"
      />
      <span className="font-light tracking-[0.14em]">{variant}</span>
    </span>
  );
}
