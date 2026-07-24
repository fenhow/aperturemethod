"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Inline Calendly booking widget. Uses Calendly's class-based embed
 * (`.calendly-inline-widget` + `data-url`) so their script auto-sizes the iframe
 * to the content height — no internal scrollbar. Loads the script/styles once.
 *
 * First visit: the script's onload auto-initializes this element. On later
 * client-side navigations (script already present) we init this fresh element
 * manually, since auto-init only runs on the initial load.
 */
export function CalendlyInline({ url, className }: { url: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !url) return;

    if (!document.getElementById("calendly-css")) {
      const link = document.createElement("link");
      link.id = "calendly-css";
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }

    const w = window as unknown as {
      Calendly?: { initInlineWidget: (o: { url: string; parentElement: HTMLElement }) => void };
    };

    if (w.Calendly) {
      // Script already loaded (client navigation) — init this new element.
      el.innerHTML = "";
      w.Calendly.initInlineWidget({ url, parentElement: el });
    } else if (!document.getElementById("calendly-js")) {
      // First load — the script auto-initializes elements with the class + data-url.
      const s = document.createElement("script");
      s.id = "calendly-js";
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [url]);

  return (
    <div
      ref={ref}
      className={cn("calendly-inline-widget", className)}
      data-url={url}
      style={{ minWidth: "320px", height: "760px" }}
    />
  );
}
