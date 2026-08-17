import { cn } from "@/lib/utils";

/**
 * Bain-style "Read more" affordance: maroon label + arrow that slides right when
 * the parent card (a `.group`) is hovered or focused. Purely presentational; wrap it in the actual <Link>.
 */
export function ReadMore({
  label = "Read more",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[15px] font-semibold text-maroon",
        className
      )}
    >
      {label}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}
