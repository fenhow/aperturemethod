import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Aperture Method horizontal wordmark (the six-blade aperture mark with its
 * signature maroon blade, followed by "APERTURE METHOD"). Uses the official
 * brand artwork.
 *
 * Sized by HEIGHT: the caller passes a height utility (e.g. `h-7` or a fluid
 * `h-[clamp(...)]`) and the width scales automatically. Sizing by height keeps
 * the wide (~10.5:1) wordmark from crowding neighbours or overflowing on small
 * phones. `tone="light"` renders the white artwork for dark backgrounds.
 */

const ART = {
  dark: { src: "/logo-horizontal-black-v3.png", w: 1759, h: 167 },
  light: { src: "/logo-horizontal-white-v3.png", w: 1782, h: 170 },
  onred: { src: "/logo-horizontal-red.png", w: 1783, h: 172 },
} as const;

export function Logo({
  className,
  tone = "dark",
  priority = false,
}: {
  className?: string;
  tone?: "dark" | "light" | "onred";
  priority?: boolean;
}) {
  const art = ART[tone];
  return (
    <Image
      src={art.src}
      width={art.w}
      height={art.h}
      alt="The Aperture Method"
      priority={priority}
      className={cn("w-auto", className)}
    />
  );
}
