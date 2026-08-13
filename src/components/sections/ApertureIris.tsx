"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { aperturePractices } from "@/lib/content";
import { deliverables } from "@/lib/deliverables";
import { cn } from "@/lib/utils";

/**
 * The Aperture — a working five-blade iris that opens.
 *
 * Replaces the earlier tabs-based MethodExplorer. Same job (choose a component,
 * read what it is), but the control *is* the brand mark: five blades whose inner
 * edges form a pentagon that genuinely widens, with the lens light from the hero
 * photograph showing through the opening as it does.
 *
 * All copy comes from `content.ts` and `deliverables.ts` — nothing is retyped here.
 *
 * Interaction notes:
 * - Hover lifts a blade along its own bisector and cracks the aperture open.
 * - Selecting a *different* component shuts the iris completely first, then
 *   re-opens on the new one, so the mechanism stays legible.
 * - Blades are focusable buttons; Arrow keys move between them, Enter/Space
 *   selects, Escape closes. `prefers-reduced-motion` snaps instead of tweening.
 */

/* ── geometry ─────────────────────────────────────────────── */
const CX = 280;
const CY = 280;
const R = 228;
const T_SHUT = 66; // aperture (pentagon) circumradius, closed
const T_HOVER = 86;
const T_OPEN = 156;
const ROT_SHUT = 0; // the assembly twists as it opens, like a real iris
const ROT_HOVER = -5;
const ROT_OPEN = -16;
const GAP = 1.5; // angular gap between blades, degrees
const INSET = 0.045; // inner-edge inset, as a fraction of the pentagon side
const BASE = -126; // puts blade 01 centred at the top

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (a: number, r: number): [number, number] => [
  CX + r * Math.cos(rad(a)),
  CY + r * Math.sin(rad(a)),
];
const f = (n: number) => Math.round(n * 100) / 100;

function bladePath(k: number, t: number, rot: number) {
  const a0 = BASE + rot + k * 72;
  const a1 = a0 + 72;
  const v0 = pt(a0, t);
  const v1 = pt(a1, t);
  const ia: [number, number] = [
    v0[0] + (v1[0] - v0[0]) * INSET,
    v0[1] + (v1[1] - v0[1]) * INSET,
  ];
  const ib: [number, number] = [
    v0[0] + (v1[0] - v0[0]) * (1 - INSET),
    v0[1] + (v1[1] - v0[1]) * (1 - INSET),
  ];
  const oa = pt(a0 + GAP, R);
  const ob = pt(a1 - GAP, R);
  return (
    `M${f(ia[0])} ${f(ia[1])} L${f(ib[0])} ${f(ib[1])} L${f(ob[0])} ${f(ob[1])} ` +
    `A${R} ${R} 0 0 0 ${f(oa[0])} ${f(oa[1])} Z`
  );
}

/** MBA → GIS → DATA, the capability arc that rings the iris. */
const CAP_ARCS = [
  { from: BASE, to: BASE + 144, label: "MBA", stroke: "rgba(255,255,255,.20)", fill: "rgba(255,255,255,.48)" },
  { from: BASE + 144, to: BASE + 288, label: "GIS", stroke: "rgba(181,84,79,.42)", fill: "rgba(201,117,108,.62)" },
  { from: BASE + 288, to: BASE + 360, label: "DATA", stroke: "rgba(181,84,79,.68)", fill: "rgba(201,117,108,.85)" },
];
const RING_R = 256;

export function ApertureIris() {
  const [sel, setSel] = useState<number | null>(null);
  const [hov, setHov] = useState<number | null>(null);

  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const groupRefs = useRef<Array<SVGGElement | null>>([]);
  const btnRefs = useRef<Array<SVGGElement | null>>([]);
  const lensRef = useRef<SVGImageElement | null>(null);
  const maskRef = useRef<SVGRectElement | null>(null);
  const cur = useRef({ t: T_SHUT, rot: ROT_SHUT });
  const aim = useRef({ t: T_SHUT, rot: ROT_SHUT });
  const raf = useRef<number | null>(null);
  const pending = useRef<number | null>(null);

  const draw = useCallback(() => {
    const { t, rot } = cur.current;
    pathRefs.current.forEach((el, k) => el?.setAttribute("d", bladePath(k, t, rot)));
    // The lens light is sized to the opening, so it can never spill past the blades.
    const w = t * 2.06;
    const x = f(CX - w / 2);
    const y = f(CY - w / 2);
    for (const el of [lensRef.current, maskRef.current]) {
      if (!el) continue;
      el.setAttribute("x", String(x));
      el.setAttribute("y", String(y));
      el.setAttribute("width", String(f(w)));
      el.setAttribute("height", String(f(w)));
    }
    const openness = (t - T_SHUT) / (T_OPEN - T_SHUT);
    lensRef.current?.setAttribute(
      "opacity",
      (0.42 + 0.53 * Math.max(0, Math.min(1, openness))).toFixed(3),
    );
  }, []);

  /** Re-aim the tween whenever the selection or hover changes. */
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    aim.current = {
      t: sel !== null ? T_OPEN : hov !== null ? T_HOVER : T_SHUT,
      rot: sel !== null ? ROT_OPEN : hov !== null ? ROT_HOVER : ROT_SHUT,
    };

    if (reduce) {
      cur.current = { ...aim.current };
      draw();
      if (pending.current !== null) {
        const k = pending.current;
        pending.current = null;
        setSel(k);
      }
      return;
    }

    const tick = () => {
      const e = 0.14;
      cur.current.t += (aim.current.t - cur.current.t) * e;
      cur.current.rot += (aim.current.rot - cur.current.rot) * e;
      draw();
      if (
        Math.abs(aim.current.t - cur.current.t) > 0.05 ||
        Math.abs(aim.current.rot - cur.current.rot) > 0.03
      ) {
        raf.current = requestAnimationFrame(tick);
      } else {
        cur.current = { ...aim.current };
        draw();
        raf.current = null;
        // The blades have finished shutting — re-open on the queued component.
        if (pending.current !== null) {
          const k = pending.current;
          pending.current = null;
          setSel(k);
        }
      }
    };
    if (raf.current === null) raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
  }, [sel, hov, draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  const select = useCallback(
    (k: number | null) => {
      setSel((prev) => {
        const target = k === prev ? null : k;
        // Switching straight from one component to another: shut first, then re-open.
        if (prev !== null && target !== null && target !== prev) {
          pending.current = target;
          setHov(null);
          return null;
        }
        pending.current = null;
        setHov(null);
        return target;
      });
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sel !== null) select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, select]);

  const active = sel !== null ? sel : hov;
  const total = aperturePractices.length;
  const activeP = active !== null ? aperturePractices[active] : undefined;
  const chosen = sel !== null ? aperturePractices[sel] : undefined;
  const prevP = sel !== null ? aperturePractices[(sel + total - 1) % total] : undefined;
  const nextP = sel !== null ? aperturePractices[(sel + 1) % total] : undefined;
  const inside =
    chosen
      ? deliverables
          .filter((d) => d.componentSlug === chosen.short.toLowerCase())
          .flatMap((d) => d.inside)
          .slice(0, 4)
      : [];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-dark text-paper">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-12 lg:p-10">
        {/* ── the iris ───────────────────────────────────── */}
        <div>
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <svg
              viewBox="0 0 560 560"
              className="block h-full w-full overflow-visible"
              role="group"
              aria-label="The five components of The Aperture Method"
            >
              <defs>
                <radialGradient id="ap-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8c2b2b" stopOpacity=".55" />
                  <stop offset="55%" stopColor="#500000" stopOpacity=".22" />
                  <stop offset="100%" stopColor="#500000" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="ap-on" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8c2b2b" />
                  <stop offset="100%" stopColor="#500000" />
                </linearGradient>
                <linearGradient id="ap-off" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1c1c1c" />
                  <stop offset="100%" stopColor="#111" />
                </linearGradient>
                <linearGradient id="ap-dim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#151515" />
                  <stop offset="100%" stopColor="#0c0c0c" />
                </linearGradient>
                <radialGradient id="ap-fade" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                  <stop offset="58%" stopColor="#fff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                <mask id="ap-mask">
                  <rect ref={maskRef} x="180" y="180" width="200" height="200" fill="url(#ap-fade)" />
                </mask>
              </defs>

              {/* real lens light, seen through the opening as the blades pull back */}
              <g mask="url(#ap-mask)">
                <image
                  ref={lensRef}
                  href="/hero/lens-core.jpg"
                  x="180"
                  y="180"
                  width="200"
                  height="200"
                  preserveAspectRatio="xMidYMid slice"
                  opacity=".42"
                />
              </g>
              <circle cx={CX} cy={CY} r="250" fill="url(#ap-glow)" opacity=".55" />
              <circle cx={CX} cy={CY} r="243" fill="none" stroke="rgba(255,255,255,.09)" />
              <circle cx={CX} cy={CY} r="264" fill="none" stroke="rgba(255,255,255,.055)" />

              {/* capability arc — MBA → GIS → DATA */}
              <g aria-hidden="true">
                {CAP_ARCS.map((a, i) => {
                  const a0 = a.from + 2.6;
                  const a1 = a.to - 2.6;
                  const [x0, y0] = pt(a0, RING_R);
                  const [x1, y1] = pt(a1, RING_R);
                  const large = a1 - a0 > 180 ? 1 : 0;
                  const mid = (a.from + a.to) / 2;
                  const [lx, ly] = pt(mid, RING_R + 19);
                  const c = Math.cos(rad(mid));
                  return (
                    <g key={a.label}>
                      <path
                        d={`M${f(x0)} ${f(y0)} A${RING_R} ${RING_R} 0 ${large} 1 ${f(x1)} ${f(y1)}`}
                        fill="none"
                        stroke={a.stroke}
                        strokeWidth="1.5"
                      />
                      <text
                        x={f(lx)}
                        y={f(ly + 3.5)}
                        textAnchor={c > 0.25 ? "start" : c < -0.25 ? "end" : "middle"}
                        fontSize="10.5"
                        fontWeight="700"
                        letterSpacing="2.6"
                        fill={a.fill}
                      >
                        {a.label}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* blades */}
              <g>
                {aperturePractices.map((p, k) => {
                  const on = k === active;
                  const dimmed = active !== null && !on;
                  const mid = BASE + k * 72 + 36;
                  const [lx, ly] = pt(mid, R * 0.735);
                  const lift = on ? 9 : 0;
                  return (
                    <g
                      key={p.short}
                      ref={(el) => {
                        groupRefs.current[k] = el;
                        btnRefs.current[k] = el;
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={sel === k}
                      aria-label={`${p.n} ${p.product} — ${p.verb}`}
                      className="cursor-pointer outline-none transition-transform duration-500 ease-out"
                      style={{
                        transform: `translate(${f(Math.cos(rad(mid)) * lift)}px, ${f(
                          Math.sin(rad(mid)) * lift,
                        )}px)`,
                      }}
                      onMouseEnter={() => sel === null && setHov(k)}
                      onMouseLeave={() => sel === null && setHov(null)}
                      onFocus={() => sel === null && setHov(k)}
                      onBlur={() => sel === null && setHov(null)}
                      onClick={() => select(k)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          select(k);
                        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                          e.preventDefault();
                          btnRefs.current[(k + 1) % total]?.focus();
                        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                          e.preventDefault();
                          btnRefs.current[(k + total - 1) % total]?.focus();
                        }
                      }}
                    >
                      <path
                        ref={(el) => {
                          pathRefs.current[k] = el;
                        }}
                        d={bladePath(k, T_SHUT, ROT_SHUT)}
                        fill={on ? "url(#ap-on)" : dimmed ? "url(#ap-dim)" : "url(#ap-off)"}
                        stroke={on ? "rgba(255,255,255,.42)" : "rgba(255,255,255,.14)"}
                        strokeWidth="1"
                        className="transition-[fill,stroke] duration-300"
                      />
                      <text
                        x={f(lx)}
                        y={f(ly - 13)}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="700"
                        letterSpacing="1.6"
                        fill="rgba(255,255,255,.42)"
                        opacity={dimmed ? 0.42 : 1}
                      >
                        {p.n}
                      </text>
                      <text
                        x={f(lx)}
                        y={f(ly + 9)}
                        textAnchor="middle"
                        fontSize="17.5"
                        fontWeight="600"
                        letterSpacing="-.2"
                        fill="rgba(255,255,255,.88)"
                        opacity={dimmed ? 0.42 : 1}
                      >
                        {p.short}
                      </text>
                      <text
                        x={f(lx)}
                        y={f(ly + 27)}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="500"
                        letterSpacing="1.3"
                        fill="rgba(255,255,255,.40)"
                        opacity={dimmed ? 0.42 : 1}
                      >
                        {p.verb.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* centre hub — sits inside the opening */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div
                className="max-w-[38%] text-center transition-opacity duration-300"
                style={{ textShadow: "0 2px 16px rgba(0,0,0,.92)" }}
              >
                {!activeP ? (
                  <span className="text-[clamp(26px,3.2vw,42px)] leading-none text-maroon-soft opacity-90">
                    ◐
                  </span>
                ) : (
                  <>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-maroon-onDark">
                      {activeP.n}
                    </p>
                    <p className="mt-1 text-[clamp(15px,1.7vw,22px)] font-semibold uppercase leading-tight tracking-[.02em]">
                      {activeP.verb}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-small text-white/60">
              {!activeP
                ? "Understand · Quantify · Reveal · Navigate · Perform"
                : `“${activeP.question}”`}
            </p>
            <p className="mt-1.5 text-overline uppercase tracking-overline text-white/35">
              {!activeP
                ? "Hover a blade · click to open"
                : `${activeP.product}™ · ${activeP.cap ?? ""}`}
            </p>
          </div>
        </div>

        {/* ── the panel ──────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          {!chosen ? (
            <div className="flex min-h-[420px] flex-col justify-center">
              <p className="text-overline font-semibold uppercase tracking-overline text-maroon-onDark">
                Start here
              </p>
              <h3 className="mt-3 text-h3 font-semibold text-paper">Open the aperture.</h3>
              <p className="mt-4 max-w-measure-sm text-body text-white/60">
                Each blade is one component of the Method. Hover to see what it is; click to open
                it and read what it does, who it&apos;s for, and exactly what you walk away with.
              </p>
              <ul className="mt-7 grid gap-3">
                {[
                  "Every engagement starts with Aperture Insights — a fixed-fee read that names your #1 constraint.",
                  "It prescribes which components will actually move the needle — one, a few, or all five.",
                  "Aperture Atlas keeps it alive after the engagement ends.",
                ].map((li, i) => (
                  <li key={li} className="flex gap-3 text-small text-white/70">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-maroon-soft/15 text-[11px] font-bold text-maroon-onDark">
                      {i + 1}
                    </span>
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p className="text-overline font-semibold uppercase tracking-overline text-maroon-onDark">
                Component {chosen.n} of {String(total).padStart(2, "0")} · {chosen.verb}
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h3 className="text-h2 font-semibold text-paper">{chosen.product}™</h3>
                {chosen.cap && (
                  <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                    {chosen.cap}
                  </span>
                )}
              </div>
              <p className="mt-4 max-w-[44ch] text-body-lg font-medium text-white/85">
                {chosen.line}
              </p>
              <p className="mt-6 border-l-2 border-maroon-soft pl-5 text-h4 font-light leading-snug text-paper">
                “{chosen.question}”
              </p>

              <section className="mt-7 border-t border-white/10 pt-6">
                <h4 className="text-overline font-semibold uppercase tracking-overline text-white/45">
                  What it is
                </h4>
                <p className="mt-3 text-small leading-relaxed text-white/70">{chosen.description}</p>
              </section>

              {chosen.forYou && chosen.forYou.length > 0 && (
                <section className="mt-7 border-t border-white/10 pt-6">
                  <h4 className="text-overline font-semibold uppercase tracking-overline text-white/45">
                    What it&apos;s for
                  </h4>
                  <ul className="mt-3 grid gap-2.5">
                    {chosen.forYou.map((x) => (
                      <li key={x} className="flex gap-3 text-small text-white/75">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon-soft"
                        />
                        {x}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="mt-7 border-t border-white/10 pt-6">
                <h4 className="text-overline font-semibold uppercase tracking-overline text-white/45">
                  What you walk away with
                </h4>
                <div className="mt-3 rounded-lg border border-white/12 bg-black/25 p-5">
                  <p className="text-h4 font-semibold text-paper">{chosen.deliverable}</p>
                  {inside.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {inside.map((x) => (
                        <span
                          key={x}
                          className="rounded-full border border-white/15 px-3 py-1.5 text-[12.5px] text-white/65"
                        >
                          {x}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {chosen.frameworks.length > 0 && (
                <details className="group mt-7 border-t border-white/10 pt-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-overline font-semibold uppercase tracking-overline text-white/60">
                      Under the hood · {chosen.frameworks.length} frameworks
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[12px] font-semibold text-maroon-onDark transition-transform duration-300 group-open:rotate-90"
                    >
                      ›
                    </span>
                  </summary>
                  <p className="mt-3 text-small text-white/50">
                    The same graduate-level business science big-company teams use — applied, in
                    plain language, to your business.
                  </p>
                  <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
                    {chosen.frameworks.map((fw) => (
                      <div key={fw.name} className="bg-[#0d0d0d] px-4 py-3">
                        <p className="text-[14px] font-semibold text-paper">{fw.name}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-white/55">{fw.what}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => sel !== null && select((sel + total - 1) % total)}
                  className="rounded-sm border border-white/20 px-4 py-2 text-small text-white/80 transition-colors hover:border-maroon-soft hover:bg-maroon-soft/10 hover:text-paper"
                >
                  ← {prevP?.short}
                </button>
                <Link
                  href={`/method/${chosen.short.toLowerCase()}`}
                  className="text-small font-semibold text-maroon-onDark transition-colors hover:text-paper"
                >
                  Full {chosen.short} page →
                </Link>
                <button
                  type="button"
                  onClick={() => sel !== null && select((sel + 1) % total)}
                  className="rounded-sm border border-white/20 px-4 py-2 text-small text-white/80 transition-colors hover:border-maroon-soft hover:bg-maroon-soft/10 hover:text-paper"
                >
                  {nextP?.short} →
                </button>
              </div>
              <button
                type="button"
                onClick={() => select(null)}
                className={cn(
                  "mt-4 rounded-sm border border-white/20 px-4 py-2 text-small text-white/80",
                  "transition-colors hover:border-maroon-soft hover:bg-maroon-soft/10 hover:text-paper",
                )}
              >
                Close the aperture
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
