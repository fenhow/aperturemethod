"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { methodPhases } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Interactive aperture dial. The five method phases sit on the blade directions
 * of the aperture; selecting one rotates the mark so its signature maroon blade
 * points at that step, the lens "irises" closed and open, and an explanation
 * animates in.
 *
 * - Auto-advances (pauses on hover/focus; disabled for reduced motion).
 * - Fully keyboard operable (arrows / Home / End); a live region announces each
 *   step for screen readers.
 * - Centered layout gives the ring labels room so they never clip.
 */

const STEP = 360 / methodPhases.length; // 72°
const NODE_R = 40; // node ring radius (% of dial)
const AUTO_MS = 4200;

// Precompute node coordinates (0° = top, clockwise) and label placement.
const NODES = methodPhases.map((_, i) => {
  const rad = (i * STEP * Math.PI) / 180;
  const x = 50 + NODE_R * Math.sin(rad);
  const y = 50 - NODE_R * Math.cos(rad);
  const label =
    i === 0
      ? { transform: "translate(-50%, calc(-100% - 16px))", textAlign: "center" as const }
      : i === 1 || i === 2
        ? { transform: "translate(34px, -50%)", textAlign: "left" as const }
        : { transform: "translate(calc(-100% - 34px), -50%)", textAlign: "right" as const };
  return { x, y, label };
});

export function MethodAperture() {
  const [active, setActive] = useState(0);
  const [rot, setRot] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const select = useCallback((next: number) => {
    setActive((prev) => {
      let delta = (next - prev + methodPhases.length) % methodPhases.length;
      if (delta > methodPhases.length / 2) delta -= methodPhases.length;
      setRot((r) => r + delta * STEP);
      return next;
    });
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => select((active + dir + methodPhases.length) % methodPhases.length),
    [active, select]
  );

  useEffect(() => {
    if (!playing || reduced) return;
    const id = window.setInterval(() => {
      setActive((prev) => {
        setRot((r) => r + STEP);
        return (prev + 1) % methodPhases.length;
      });
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [playing, reduced]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      select(0);
    } else if (e.key === "End") {
      e.preventDefault();
      select(methodPhases.length - 1);
    }
  }

  const phase = methodPhases[active]!;
  const rotationStyle = useMemo(() => ({ transform: `rotate(${rot}deg)` }), [rot]);

  return (
    <div
      className="mx-auto max-w-5xl rounded-2xl border border-line bg-surface px-6 py-10 shadow-card sm:px-10 sm:py-12"
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      onFocusCapture={() => setPlaying(false)}
      onBlurCapture={() => setPlaying(true)}
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
      {/* Dial */}
      <div
        role="group"
        aria-label="The five phases of The Aperture Method"
        onKeyDown={onKeyDown}
        className="relative mx-auto aspect-square w-full max-w-[380px]"
      >
        {/* concentric guide rings */}
        <div className="absolute inset-[8%] rounded-full border border-line/80" />
        <div className="absolute inset-[20%] rounded-full border border-line/60" />

        {/* Center mark — rotates so the maroon blade points to the active step */}
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={`Aperture mark, pointing to step ${phase.n}, ${phase.product}. Activate for the next step.`}
          className="group absolute left-1/2 top-1/2 grid h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none"
        >
          <span
            className="absolute inset-[-18%] rounded-full bg-maroon/[0.07] blur-2xl transition-opacity group-hover:bg-maroon/[0.12]"
            aria-hidden="true"
          />
          <div
            style={rotationStyle}
            className={cn(
              "relative h-full w-full",
              !reduced && "transition-transform duration-[820ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            )}
          >
            <Image
              key={active}
              src="/logo-icon-black.png"
              alt=""
              width={316}
              height={316}
              className={cn("h-full w-full object-contain", !reduced && "aperture-iris")}
            />
          </div>
        </button>

        {/* Step nodes + labels */}
        {NODES.map((node, i) => {
          const isActive = i === active;
          const p = methodPhases[i]!;
          return (
            <div
              key={p.n}
              className="absolute"
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <span
                aria-hidden="true"
                style={{ transform: node.label.transform, textAlign: node.label.textAlign }}
                className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 hidden whitespace-nowrap text-[13px] font-semibold tracking-tight transition-colors duration-300 sm:block",
                  isActive ? "text-maroon" : "text-muted"
                )}
              >
                {p.verb}
              </span>

              <button
                type="button"
                onClick={() => select(i)}
                aria-pressed={isActive}
                aria-label={`Step ${p.n}: ${p.product} — ${p.verb}`}
                className={cn(
                  "relative grid h-10 w-10 place-items-center rounded-full border text-[13px] font-semibold tabular-nums transition-all duration-300",
                  isActive
                    ? "scale-110 border-maroon bg-maroon text-paper shadow-[0_0_0_5px_rgba(80,0,0,0.10)]"
                    : "border-line bg-paper text-muted hover:border-maroon hover:text-maroon"
                )}
              >
                {isActive && !reduced && (
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-maroon/25 motion-reduce:hidden"
                    aria-hidden="true"
                  />
                )}
                <span className="relative">{p.n}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Detail */}
      <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
        <div key={active} className="animate-fade-up">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <span className="text-display font-semibold leading-none text-maroon">{phase.n}</span>
            <div className="text-left">
              <h3 className="text-h3 font-semibold text-ink">{phase.product}&trade;</h3>
              <p className="eyebrow mt-1">{phase.verb} · &ldquo;{phase.question}&rdquo;</p>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-md text-body-lg text-body lg:mx-0">{phase.line}</p>

          <div className="mx-auto mt-8 max-w-md border-t border-line pt-6 text-left lg:mx-0">
            <p className="text-overline font-semibold uppercase tracking-overline text-muted">You get</p>
            <p className="mt-1 text-body font-medium text-ink">{phase.deliverable}</p>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          Step {phase.n} of {methodPhases.length}: {phase.product}. {phase.line}
        </p>

        {/* Controls */}
        <div className="mt-9 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous step"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-maroon hover:text-maroon"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next step"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-maroon hover:text-maroon"
          >
            →
          </button>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="ml-2 text-small font-medium text-muted transition-colors hover:text-ink"
              aria-label={playing ? "Pause auto-rotation" : "Play auto-rotation"}
            >
              {playing ? "Pause" : "Play"}
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
