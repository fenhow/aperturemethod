/**
 * "Last reviewed" line.
 *
 * A date is a promise. This one says a person opened the page on that date and
 * confirmed the claims on it were still true, so it is set by hand and only
 * moves when that actually happens. Wiring it to the build clock would make it
 * automatic and worthless, and worse, untrue.
 */
export function LastReviewed({ date, onDark = false }: { date: string; onDark?: boolean }) {
  const label = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return (
    <p className={"text-small " + (onDark ? "text-white/50" : "text-muted")}>
      Last reviewed <time dateTime={date}>{label}</time>. Fees and timings on this page are current
      as of that date.
    </p>
  );
}
