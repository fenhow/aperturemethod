"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive "Market Map" — an on-brand illustration of spatial intelligence
 * (GIS) that behaves like a live analytics instrument:
 *  - radar sweep, cycling MBA analysis readout, live forecast chart;
 *  - demographic tags fading over customer clusters;
 *  - dots that spawn (with a ping) and retire to signal real-time activity;
 *  - "+" markers you can click for plain-English explanations (map features and
 *    the current MBA technique);
 *  - a pause / play control.
 * Cycling text pauses while a popup is open. Reduced-motion users get a calm,
 * static, still-explorable version.
 */

type Dot = { id: number; x: number; y: number; spawned: boolean; leaving?: boolean };
type Popup = { title: string; lines: string[]; ax: number; ay: number };

const BASE: [number, number][] = [
  [250, 120], [268, 138], [235, 150], [285, 128], [300, 160], [262, 170],
  [520, 210], [540, 195], [505, 225], [560, 220], [532, 240], [575, 205],
  [180, 250], [640, 120], [660, 140], [120, 180], [430, 90], [410, 300],
  [150, 300], [470, 250], [350, 300],
];

const CHIPS: { px: number; py: number; lx: number; ly: number; values: string[] }[] = [
  { px: 300, py: 112, lx: 250, ly: 58, values: ["Female · 26", "Male · 41", "HH $88k", "Age 34"] },
  { px: 232, py: 150, lx: 150, ly: 118, values: ["$1,240 LTV", "Loyal ★", "2.3 mi", "Repeat ×4"] },
  { px: 430, py: 90, lx: 430, ly: 50, values: ["Male · 47", "High intent", "HH $102k", "New mover"] },
  { px: 560, py: 195, lx: 636, ly: 158, values: ["Female · 38", "Churn risk", "$/visit $58", "Growth ▲7%"] },
  { px: 205, py: 252, lx: 152, ly: 300, values: ["Male · 63", "HH $71k", "Age 51", "Female · 29"] },
];

// Clickable map features. bx/by = where the "+" marker sits.
const POIS: { title: string; info: string; hx: number; hy: number; r: number; bx: number; by: number }[] = [
  { title: "Primary location", info: "Your business, anchored to its trade area and drive-time reach.", hx: 278, hy: 145, r: 16, bx: 293, by: 130 },
  { title: "Opportunity zone", info: "An underserved cluster where demand outpaces local competition.", hx: 540, hy: 215, r: 15, bx: 553, by: 201 },
  { title: "Customer hot-spot", info: "Where your most valuable customers concentrate — measured by value, not just volume.", hx: 300, hy: 165, r: 15, bx: 322, by: 176 },
  { title: "Drive-time rings", info: "5-, 10-, and 15-minute reach from your front door.", hx: 194, hy: 145, r: 13, bx: 194, by: 128 },
];

const FORECAST_INFO = "Modeled from your data and market signals — it updates as inputs change.";

// MBA techniques + plain-English explanations (click the readout to read them).
const TECH: { name: string; info: string }[] = [
  { name: "Regression", info: "Finds which factors actually drive an outcome — and by how much." },
  { name: "Forecasting", info: "Projects future demand, revenue, or cost from historical patterns." },
  { name: "Lifetime value", info: "What a customer is worth over the whole relationship, not one sale." },
  { name: "Segmentation", info: "Groups customers by behavior and value so you target the right ones." },
  { name: "Cohort analysis", info: "Tracks groups over time to see retention — and what changes it." },
  { name: "EBITDA margin", info: "Core operating profitability, before financing and accounting noise." },
  { name: "Break-even", info: "The volume where revenue finally covers your costs." },
  { name: "Elasticity", info: "How sensitive demand is to a change in price." },
  { name: "Optimization", info: "The best allocation of price, spend, or inventory under real constraints." },
  { name: "Propensity score", info: "The probability a given customer buys, churns, or converts next." },
  { name: "Hot-spot analysis", info: "Where demand clusters most densely across the map." },
  { name: "Sensitivity", info: "How the outcome shifts when a key assumption changes." },
];

const DELTAS = ["▲ 12.4%", "▲ 8.1%", "▲ 15.2%", "▲ 9.7%", "▲ 11.3%"];
const SPARK = "M14 74 L45 64 L76 68 L107 52 L138 44 L167 30 L196 24";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function wrap(text: string, max = 34): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function MarketMapLive({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const dark = tone === "dark";
  const line = dark ? "rgba(255,255,255,0.10)" : "rgba(20,20,20,0.10)";
  const dotColor = dark ? "rgba(255,255,255,0.5)" : "rgba(20,20,20,0.4)";
  const pill = dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.85)";
  const panel = dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)";
  const pillStroke = dark ? "rgba(255,255,255,0.18)" : "rgba(20,20,20,0.12)";
  const labelText = dark ? "#ffffff" : "#141414";
  const muted = dark ? "rgba(255,255,255,0.6)" : "rgba(20,20,20,0.55)";
  const accentText = dark ? "#c9756c" : "#500000";
  const popupBg = dark ? "#141414" : "#ffffff";
  const badgeBg = dark ? "#1c1413" : "#ffffff";

  const svgRef = useRef<SVGSVGElement>(null);
  const nextId = useRef(1000);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const [dots, setDots] = useState<Dot[]>(() => BASE.map(([x, y], i) => ({ id: i, x, y, spawned: false })));
  const [popup, setPopup] = useState<Popup | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // label / readout cycling — slower, and paused while a popup is open
  useEffect(() => {
    if (!playing || reduced || popup) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 3000);
    return () => window.clearInterval(id);
  }, [playing, reduced, popup]);

  // spawn + retire dots (real-time activity)
  useEffect(() => {
    if (!playing || reduced) return;
    const id = window.setInterval(() => {
      let x = 400;
      let y = 180;
      for (let t = 0; t < 24; t++) {
        x = 40 + Math.random() * 720;
        y = 40 + Math.random() * 280;
        const inChart = x > 556 && y > 244;
        const inReadout = x < 284 && y < 44;
        const inPause = x > 676 && y < 44;
        if (!inChart && !inReadout && !inPause) break;
      }
      const nd: Dot = { id: nextId.current++, x, y, spawned: true };
      setDots((prev) => {
        const arr = [...prev, nd];
        const spawned = arr.filter((d) => d.spawned && !d.leaving);
        if (spawned.length > 9) {
          const oldest = spawned[0]!;
          window.setTimeout(() => setDots((p) => p.filter((d) => d.id !== oldest.id)), 700);
          return arr.map((d) => (d.id === oldest.id ? { ...d, leaving: true } : d));
        }
        return arr;
      });
    }, 2400);
    return () => window.clearInterval(id);
  }, [playing, reduced]);

  const togglePlay = () => {
    setPlaying((p) => {
      const np = !p;
      const svg = svgRef.current;
      if (svg) np ? svg.unpauseAnimations() : svg.pauseAnimations();
      return np;
    });
  };

  const val = (values: string[], offset: number) => values[(tick + offset) % values.length]!;
  const tech = reduced ? TECH[0]! : TECH[tick % TECH.length]!;
  const delta = reduced ? DELTAS[0]! : DELTAS[tick % DELTAS.length]!;
  const fadeKey = reduced ? "static" : tick;

  const cardW = 244;
  const cardH = popup ? 34 + popup.lines.length * 16 + 12 : 0;
  const cardX = popup ? clamp(popup.ax - cardW / 2, 12, 800 - cardW - 12) : 0;
  const cardYRaw = popup ? popup.ay - cardH - 18 : 0;
  const cardY = popup ? (cardYRaw < 12 ? clamp(popup.ay + 18, 12, 360 - cardH - 12) : cardYRaw) : 0;

  const Marker = ({ bx, by }: { bx: number; by: number }) => (
    <g pointerEvents="none">
      <circle cx={bx} cy={by} r="9" fill={badgeBg} stroke="#b5544f" strokeWidth="1.25">
        {!reduced && <animate attributeName="opacity" values="1;0.55;1" dur="3.4s" repeatCount="indefinite" />}
      </circle>
      <path d={`M${bx - 4} ${by} H${bx + 4} M${bx} ${by - 4} V${by + 4}`} stroke="#c9756c" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 360"
      aria-label="Interactive market map: click the plus markers to learn what the analysis shows"
      className={cn("h-auto w-full", className)}
      onClick={() => setPopup(null)}
    >
      <defs>
        <pattern id="mml-streets" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={line} strokeWidth="1" />
        </pattern>
        <radialGradient id="mml-heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8c2b2b" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#500000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#500000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mml-sweep" cx="278" cy="145" r="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b5544f" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#b5544f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="360" fill="url(#mml-streets)" />
      <path d="M0 300 L800 60" stroke={line} strokeWidth="2" fill="none" />
      <path d="M120 0 L520 360" stroke={line} strokeWidth="2" fill="none" />

      <circle cx="278" cy="145" r="130" fill="url(#mml-heat)" />
      <circle cx="540" cy="215" r="110" fill="url(#mml-heat)" />

      {!reduced && (
        <path d="M278 145 L428 145 A150 150 0 0 1 413.9 208.4 Z" fill="url(#mml-sweep)">
          <animateTransform attributeName="transform" type="rotate" from="0 278 145" to="360 278 145" dur="13s" repeatCount="indefinite" />
        </path>
      )}

      {[46, 84, 122].map((r) => (
        <circle key={r} cx="278" cy="145" r={r} fill="none" stroke="#b5544f" strokeWidth="1.25" strokeDasharray="4 6" opacity={0.7 - r / 400} />
      ))}

      {/* customer points (base + live) */}
      {dots.map((d) => (
        <g key={d.id}>
          {d.spawned && !d.leaving && !reduced && (
            <circle cx={d.x} cy={d.y} r="3" fill="none" stroke="#b5544f" strokeWidth="1.5">
              <animate attributeName="r" from="3" to="14" dur="1.2s" repeatCount="1" fill="freeze" />
              <animate attributeName="opacity" from="0.7" to="0" dur="1.2s" repeatCount="1" fill="freeze" />
            </circle>
          )}
          <circle cx={d.x} cy={d.y} r={d.spawned ? 3 : 2.5} fill={d.spawned ? "#c9756c" : dotColor}>
            {d.spawned && !d.leaving && !reduced && <animate attributeName="opacity" from="0" to="1" dur="0.5s" repeatCount="1" fill="freeze" />}
            {d.leaving && !reduced && <animate attributeName="opacity" from="1" to="0" dur="0.7s" repeatCount="1" fill="freeze" />}
          </circle>
        </g>
      ))}

      {/* demographic chips */}
      {CHIPS.map((c, i) => (
        <g key={i}>
          <line x1={c.px} y1={c.py} x2={c.lx} y2={c.ly} stroke={pillStroke} strokeWidth="1" />
          <circle cx={c.px} cy={c.py} r="3.5" fill="#b5544f" />
          <g transform={`translate(${c.lx} ${c.ly})`}>
            <rect x="-48" y="-13" width="96" height="26" rx="13" fill={pill} stroke={pillStroke} />
            <text key={fadeKey} className={reduced ? undefined : "animate-fade"} y="1" textAnchor="middle" dominantBaseline="middle" fontSize="12.5" fontWeight={500} fill={labelText}>
              {reduced ? c.values[0] : val(c.values, i)}
            </text>
          </g>
        </g>
      ))}

      {/* clickable map features with + markers */}
      {POIS.map((p) => (
        <g
          key={p.title}
          role="button"
          tabIndex={0}
          aria-label={`${p.title} — details`}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            setPopup({ title: p.title, lines: wrap(p.info), ax: p.bx, ay: p.by });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setPopup({ title: p.title, lines: wrap(p.info), ax: p.bx, ay: p.by });
            }
          }}
        >
          <circle cx={p.hx} cy={p.hy} r={p.r} fill="transparent" />
          <Marker bx={p.bx} by={p.by} />
        </g>
      ))}

      {/* MBA analysis readout — top left, clickable */}
      <g
        role="button"
        tabIndex={0}
        aria-label={`Analytics: ${tech.name} — what it means`}
        style={{ cursor: "pointer" }}
        transform="translate(22 24)"
        onClick={(e) => {
          e.stopPropagation();
          setPopup({ title: tech.name, lines: wrap(tech.info), ax: 150, ay: 42 });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPopup({ title: tech.name, lines: wrap(tech.info), ax: 150, ay: 42 });
          }
        }}
      >
        <rect x="0" y="-15" width="268" height="30" rx="15" fill={pill} stroke={pillStroke} />
        <rect x="14" y="-4" width="8" height="8" fill="#8c2b2b">
          {!reduced && <animate attributeName="opacity" values="1;0.25;1" dur="1.8s" repeatCount="indefinite" />}
        </rect>
        <text x="32" y="1" dominantBaseline="middle" fontSize="11.5" fontWeight={500} letterSpacing="0.06em">
          <tspan fill={muted}>ANALYZING&nbsp;·&nbsp;</tspan>
          <tspan key={fadeKey} className={reduced ? undefined : "animate-fade"} fill={accentText}>{tech.name}</tspan>
        </text>
        <circle cx="252" cy="0" r="8" fill={badgeBg} stroke="#b5544f" strokeWidth="1.25" />
        <text x="252" y="1" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight={700} fill="#c9756c">?</text>
      </g>

      {/* pause / play control — top right */}
      {!reduced && (
        <g
          role="button"
          tabIndex={0}
          aria-label={playing ? "Pause the animation" : "Play the animation"}
          style={{ cursor: "pointer" }}
          transform="translate(688 10)"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePlay();
            }
          }}
        >
          <rect x="0" y="0" width="88" height="28" rx="14" fill={pill} stroke={pillStroke} />
          <text x="44" y="15" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight={500} fill={labelText}>
            {playing ? "❚❚ Pause" : "▶ Play"}
          </text>
        </g>
      )}

      {/* live forecast chart — bottom right (whole panel is clickable) */}
      <g
        role="button"
        tabIndex={0}
        aria-label="Revenue forecast — details"
        style={{ cursor: "pointer" }}
        transform="translate(566 250)"
        onClick={(e) => {
          e.stopPropagation();
          setPopup({ title: "Revenue forecast", lines: wrap(FORECAST_INFO), ax: 671, ay: 250 });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPopup({ title: "Revenue forecast", lines: wrap(FORECAST_INFO), ax: 671, ay: 250 });
          }
        }}
      >
        <rect x="0" y="0" width="210" height="94" rx="12" fill={panel} stroke={pillStroke} />
        <text x="14" y="20" fontSize="11" fontWeight={500} letterSpacing="0.04em" fill={muted}>REVENUE FORECAST</text>
        <text key={`d-${fadeKey}`} className={reduced ? undefined : "animate-fade"} x="196" y="20" textAnchor="end" fontSize="12" fontWeight={600} fill={accentText}>{delta}</text>
        <line x1="14" y1="82" x2="196" y2="82" stroke={pillStroke} strokeWidth="1" />
        <path d={`${SPARK} L196 82 L14 82 Z`} fill="#500000" fillOpacity="0.18" transform="translate(0 6)" />
        <path d={SPARK} fill="none" stroke="#b5544f" strokeWidth="2" transform="translate(0 6)" />
        {!reduced ? (
          <circle r="3.5" fill="#fff" stroke="#500000" strokeWidth="1" transform="translate(0 6)" pointerEvents="none">
            <animateMotion dur="5.5s" repeatCount="indefinite" path={SPARK} />
          </circle>
        ) : (
          <circle cx="196" cy="30" r="3.5" fill="#fff" stroke="#500000" strokeWidth="1" />
        )}
        {/* + affordance in the panel corner */}
        <circle cx="192" cy="74" r="9" fill={badgeBg} stroke="#b5544f" strokeWidth="1.25" pointerEvents="none" />
        <path d="M188 74 H196 M192 70 V78" stroke="#c9756c" strokeWidth="1.5" strokeLinecap="round" pointerEvents="none" />
      </g>

      {/* pins */}
      <g transform="translate(278 145)">
        <circle r="9" fill="#500000" />
        <circle r="3.5" fill="#fff" />
      </g>
      <g transform="translate(540 215)">
        <circle r="7" fill="#8c2b2b" />
        <circle r="2.8" fill="#fff" />
      </g>

      {/* hint */}
      {!popup && (
        <text x="24" y="344" fontSize="11" fill={muted} opacity="0.8">
          Click a ＋ marker to explore ↗
        </text>
      )}

      {/* explanation popup */}
      {popup && (
        <g>
          <line x1={popup.ax} y1={popup.ay} x2={clamp(popup.ax, cardX + 12, cardX + cardW - 12)} y2={cardY < popup.ay ? cardY + cardH : cardY} stroke={pillStroke} strokeWidth="1" />
          <rect x={cardX} y={cardY} width={cardW} height={cardH} rx="12" fill={popupBg} stroke={pillStroke} />
          <text x={cardX + 16} y={cardY + 22} fontSize="13.5" fontWeight={600} fill={labelText}>{popup.title}</text>
          {popup.lines.map((l, i) => (
            <text key={i} x={cardX + 16} y={cardY + 42 + i * 16} fontSize="12" fill={muted}>{l}</text>
          ))}
          <g
            role="button"
            tabIndex={0}
            aria-label="Close"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              setPopup(null);
            }}
          >
            <rect x={cardX + cardW - 30} y={cardY + 8} width="22" height="22" rx="6" fill="transparent" />
            <text x={cardX + cardW - 19} y={cardY + 20} textAnchor="middle" dominantBaseline="middle" fontSize="15" fill={muted}>×</text>
          </g>
        </g>
      )}
    </svg>
  );
}
