"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/**
 * Inline Calendly booking widget. Uses Calendly's class-based embed
 * (`.calendly-inline-widget` + `data-url`) so their script auto-sizes the iframe
 * to the content height — no internal scrollbar. Loads the script/styles once.
 *
 * First visit: the script's onload auto-initializes this element. On later
 * client-side navigations (script already present) we init this fresh element
 * manually, since auto-init only runs on the initial load.
 *
 * Calendly is blocked by a lot of content blockers — more often on phones than
 * on desktop — and when it is, an un-guarded embed leaves a blank 760px box
 * where the booking form should be. If the script errors or simply never
 * arrives, we swap in a plain way to get in touch instead.
 */

/** How long to wait for Calendly before showing the fallback. */
const LOAD_TIMEOUT_MS = 8000;

export function CalendlyInline({ url, className }: { url: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

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
      s.onerror = () => setFailed(true);
      document.body.appendChild(s);
    }

    // Blockers often stall the request rather than erroring it, so also give up
    // on a timer if no iframe has appeared.
    const t = window.setTimeout(() => {
      if (!ref.current?.querySelector("iframe")) setFailed(true);
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [url]);

  if (failed) {
    return (
      <div className={cn("rounded-lg border border-line bg-surface p-6 sm:p-8", className)}>
        <h3 className="text-h4 font-semibold text-ink">The booking calendar didn&rsquo;t load.</h3>
        <p className="mt-3 text-body text-muted">
          It is usually a privacy extension or a network blocking the scheduler. You can open it
          directly, or just send a note — either reaches Fenwick.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full justify-center sm:w-auto sm:px-8"
          >
            Open the calendar
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="btn--secondary w-full justify-center sm:w-auto sm:px-8"
          >
            Email instead
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("calendly-inline-widget", className)}
      data-url={url}
      // `maxWidth` matters: the 320px floor alone can push past a 360px phone
      // once page padding is taken off, which would scroll the page sideways.
      style={{ minWidth: "320px", maxWidth: "100%", height: "760px" }}
    />
  );
}
