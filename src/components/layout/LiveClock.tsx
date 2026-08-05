"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Live date + time for the utility strip. Renders nothing until mounted (so
 * there's no server/client hydration mismatch), then ticks once a second in the
 * visitor's local timezone.
 */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    // reserve space, avoid layout shift + hydration mismatch
    return <span className={cn("tabular-nums opacity-0", className)}>—</span>;
  }

  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const time = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <span
      className={cn("inline-flex items-center gap-2 tabular-nums", className)}
      suppressHydrationWarning
      aria-label={`Current date and time: ${date}, ${time}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden="true" />
      {date} · {time}
    </span>
  );
}
