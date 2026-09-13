import { cn } from "@/lib/utils";

/**
 * Aperture family lockup: the six-blade aperture mark, "APERTURE", then the
 * variable word ("METHOD" for the parent; a component name like "ATLAS" for
 * the family). The two words are set as ONE NAME, separated by a word space,
 * exactly as the brand file `AM Black Horizontal.png` sets it. There is no
 * divider rule: a rule made it read as "Aperture, of the Method" rather than
 * as the name of the firm. Weight and tracking carry the distinction instead,
 * which is how the artwork does it. Rendered live (not flat art) so it stays crisp
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
        "inline-flex items-center whitespace-nowrap leading-none",
        tone === "dark" ? "text-ink" : "text-white",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ICON[tone]} alt="" className="mr-[0.16em] h-[1.35em] w-auto select-none" />
      <span className="font-semibold tracking-[0.06em]">APERTURE</span>
      <span className="ml-[0.26em] font-light tracking-[0.14em]">{variant}</span>
    </span>
  );
}
