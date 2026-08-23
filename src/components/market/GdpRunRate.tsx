"use client";

import { useEffect, useRef } from "react";
import { SMALL_BUSINESS_GDP_PER_SECOND } from "@/lib/marketContext";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const STATIC_NUMBER = usd.format(SMALL_BUSINESS_GDP_PER_SECOND);
const STATIC_LABEL = "of US GDP produced by American small business, every second.";
const LIVE_LABEL =
  "of US GDP produced by American small business since you opened this page.";

/**
 * The small business share of US output, accruing from the moment the page
 * opened.
 *
 * Read the note above GDP_RUN_RATE in marketContext.ts before touching this.
 * The counter is arithmetic on the last published quarter, not a live feed,
 * and the wording here is load-bearing. What renders on the server, and what a
 * reduced-motion or no-JS visitor sees, is the honest static sentence: a rate
 * per second. Only once we know the visitor accepts motion does the label
 * become "since you opened this page" and the number start moving.
 *
 * The ticking value is written straight to the DOM rather than held in state.
 * At sixty frames a second a React re-render per frame is waste, and the
 * number is decoration around a fact rather than application state.
 */
export function GdpRunRate({
  onDark = false,
  variant = "block",
}: {
  onDark?: boolean;
  /** "block" for the dialog, "inline" for the thin homepage strip. */
  variant?: "block" | "inline";
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const num = numRef.current;
    const label = labelRef.current;
    if (!num || !label) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    label.textContent = LIVE_LABEL;
    const start = performance.now();
    let frame = 0;
    const paint = (t: number) => {
      num.textContent = usd.format(((t - start) / 1000) * SMALL_BUSINESS_GDP_PER_SECOND);
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, []);

  const numberClass = (extra: string) =>
    `${extra} font-semibold tabular-nums ${onDark ? "text-paper" : "text-ink"}`;

  if (variant === "inline") {
    return (
      <p className={onDark ? "text-small text-white/80" : "text-small text-body"}>
        <span ref={numRef} className={numberClass("")}>
          {STATIC_NUMBER}
        </span>{" "}
        <span ref={labelRef}>{STATIC_LABEL}</span>
      </p>
    );
  }

  return (
    <div>
      <p className={numberClass("text-h2")}>
        <span ref={numRef}>{STATIC_NUMBER}</span>
      </p>
      <p className={"mt-2 text-small " + (onDark ? "text-white/70" : "text-muted")}>
        <span ref={labelRef}>{STATIC_LABEL}</span>
      </p>
    </div>
  );
}
