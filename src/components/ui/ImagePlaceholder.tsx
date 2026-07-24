import Image from "next/image";
import { cn } from "@/lib/utils";
import { getSlotImage } from "@/lib/slot-images";

/**
 * Branded stand-in for photography until commissioned images are added.
 * Renders a tonal block with the official aperture icon as a faint watermark.
 *
 * Pass `id` to show a visible slot code (e.g. "HOME-PLATFORM") plus the label,
 * so it's easy to map real photography to each slot before launch. Swap for
 * <Image> with a real photo when one exists.
 */
export function ImagePlaceholder({
  className,
  tone = "light",
  ratio = "aspect-[3/2]",
  label = "Photography to be added",
  id,
}: {
  className?: string;
  tone?: "light" | "dark";
  ratio?: string;
  label?: string;
  id?: string;
}) {
  // If a real photo is registered for this slot, render it instead.
  const real = getSlotImage(id);
  if (real) {
    return (
      <div className={cn("relative overflow-hidden", ratio, className)}>
        <Image
          src={real.src}
          alt={real.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }

  const bg = tone === "dark" ? "bg-gray-900" : "bg-gray-100";
  const icon =
    tone === "dark"
      ? { src: "/logo-icon-white.png", w: 261, h: 261 }
      : { src: "/logo-icon-black.png", w: 316, h: 316 };
  const codeText = tone === "dark" ? "text-white/70" : "text-ink/60";

  return (
    <div
      role="img"
      aria-label={id ? `${label} (slot ${id})` : label}
      className={cn("relative overflow-hidden", bg, ratio, className)}
    >
      <Image
        src={icon.src}
        alt=""
        aria-hidden="true"
        width={icon.w}
        height={icon.h}
        className="absolute left-1/2 top-1/2 h-1/3 w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.09]"
      />
      {id ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
          <span className="rounded bg-maroon px-2.5 py-1 font-mono text-[12px] font-bold uppercase tracking-wide text-paper">
            {id}
          </span>
          <span className={cn("max-w-[92%] text-[11px] font-medium leading-tight", codeText)}>
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
