"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive "Market Map" — a restrained, editorial illustration of spatial
 * intelligence (GIS) that behaves like a live analytics instrument:
 *  - radar sweep, cycling analysis readout, live forecast panel;
 *  - demographic labels fading over customer clusters;
 *  - points that spawn and retire to signal real-time activity;
 *  - refined "+" nodes you can click for plain-English explanations, each with
 *    its click target centred exactly on the node;
 *  - a pause / play control.
 * Cycling text freezes while a popup is open. Reduced-motion users get a calm,
 * static, still-explorable version.
 */

type Dot = { id: number; x: number; y: number; spawned: boolean; leaving?: boolean };
type Popup = { title: string; lines: string[]; ax: number; ay: number };
type Poi = { title: string; info: string; x: number; y: number };

const BASE: [number, number][] = [
  [250, 120], [268, 138], [235, 150], [285, 128], [300, 160], [262, 170],
  [520, 210], [540, 195], [505, 225], [560, 220], [532, 240], [575, 205],
  [180, 250], [640, 120], [660, 140], [120, 180], [430, 90], [410, 300],
  [150, 300], [470, 250], [350, 300],
];

const CHIPS: { px: number; py: number; lx: number; ly: number; title: string; info: string; values: string[] }[] = [
  {
    px: 272, py: 106, lx: 250, ly: 56,
    title: "Core customer",
    info: "A young professional in your trade area — mid-income and digitally engaged. Segments like this respond to loyalty offers and drive the bulk of repeat visits.",
    values: ["Female · 26", "Male · 41", "HH $88k", "Age 34"],
  },
  {
    px: 232, py: 150, lx: 150, ly: 116,
    title: "High-value loyalist",
    info: "Your most valuable repeat customers — worth roughly $1,240 over their lifetime. Keeping them loyal costs far less than winning new ones.",
    values: ["$1,240 LTV", "Loyal", "2.3 mi", "4 visits"],
  },
  {
    px: 430, py: 90, lx: 430, ly: 48,
    title: "High-intent prospect",
    info: "A new mover with strong household income and clear buying signals — prime for a first-visit offer before a competitor captures them.",
    values: ["Male · 47", "High intent", "HH $102k", "New mover"],
  },
  {
    px: 590, py: 178, lx: 636, ly: 156,
    title: "At-risk customer",
    info: "Spend per visit and frequency are slipping — a churn-risk flag so you can win them back with a targeted offer before they're gone.",
    values: ["Female · 38", "Churn risk", "$58 / visit", "Visits ↓"],
  },
  {
    px: 205, py: 250, lx: 152, ly: 268,
    title: "Emerging segment",
    info: "An older, established household nearby — steady, reliable spenders who are often overlooked and worth targeting for growth.",
    values: ["Male · 63", "HH $71k", "Age 51", "Female · 29"],
  },
];

// Clickable map features. (x, y) is BOTH the visible node and the centre of the
// click target — so a click always lands on the "+".
const POIS: Poi[] = [
  { title: "Primary location", info: "Your business, anchored to its trade area and drive-time reach.", x: 300, y: 128 },
  { title: "Opportunity zone", info: "An underserved cluster where demand outpaces local competition.", x: 553, y: 200 },
  { title: "Customer hot-spot", info: "Where your most valuable customers concentrate — measured by value, not just volume.", x: 322, y: 176 },
  { title: "Drive-time rings", info: "5-, 10-, and 15-minute reach from your front door.", x: 196, y: 126 },
];

const COMPETITOR = {
  title: "Competitor",
  info: "A rival location about 2.1 miles away. We map where competitors win and lose, so you can defend your base and target the customers they underserve.",
  px: 416, py: 182, lx: 416, ly: 220, label: "Competitor · 2.1 mi",
};

const TECH: { name: string; info: string }[] = [
  { name: "Regression", info: "Isolates which factors actually move a result — like what drives a sale — and by how much. It tells you which levers are worth pulling, so you invest where it counts instead of guessing." },
  { name: "Forecasting", info: "Projects demand, revenue, and cost from your history and market signals. You can staff, stock, and budget ahead of what's coming instead of always reacting to it." },
  { name: "Lifetime value", info: "Estimates what a customer is worth over the whole relationship, not one sale. It tells you how much it's worth spending to win and keep the right customers." },
  { name: "Segmentation", info: "Groups your customers by behavior and value. Your marketing and offers reach the right people with the right message instead of everyone at once." },
  { name: "Cohort analysis", info: "Follows groups of customers over time to reveal who stays, who leaves, and when. It points to exactly what to fix to keep customers longer." },
  { name: "EBITDA margin", info: "Shows core operating profitability, stripped of financing and accounting noise. You see how much each part of the business truly earns, and where margin leaks." },
  { name: "Break-even", info: "Pinpoints the sales volume where you finally cover your costs. It's the number every location, product, or price change has to clear to make money." },
  { name: "Elasticity", info: "Measures how demand responds to price. You can raise prices where it won't cost you volume — and know where holding the line protects sales." },
  { name: "Optimization", info: "Finds the best mix of price, spend, and inventory within your real constraints. Limited time and money go where they return the most." },
  { name: "Propensity score", info: "Ranks each customer by how likely they are to buy, churn, or upgrade next. Your team spends its effort where it will actually pay off." },
  { name: "Hot-spot analysis", info: "Maps where demand clusters most densely across your market. You aim marketing, staffing, and expansion at where the customers actually are." },
  { name: "Sensitivity", info: "Tests how the outcome shifts when a key assumption changes. You learn which risks matter most and how much room for error you really have." },
];

// Everyday context signals — cycled to show the breadth of what we watch.
const SIGNALS: { k: string; v: string }[] = [
  { k: "LOCAL TIME", v: "3:42 PM" },
  { k: "WEATHER", v: "Clear · 72°F" },
  { k: "DATE", v: "Fri, Jul 24" },
  { k: "FOOT TRAFFIC", v: "+6% vs. average" },
  { k: "MARKET NEWS", v: "Rates held steady" },
  { k: "SEASONALITY", v: "Peak week" },
  { k: "NEARBY EVENT", v: "Festival Saturday" },
  { k: "COMPETITOR", v: "New site 2.1 mi" },
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function wrap(text: string, max = 36): string[] {
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
  const line = dark ? "rgba(255,255,255,0.08)" : "rgba(20,20,20,0.08)";
  const dotColor = dark ? "rgba(255,255,255,0.42)" : "rgba(20,20,20,0.34)";
  const chipBg = dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)";
  const panel = dark ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.92)";
  const hair = dark ? "rgba(255,255,255,0.14)" : "rgba(20,20,20,0.12)";
  const labelText = dark ? "rgba(255,255,255,0.92)" : "#141414";
  const muted = dark ? "rgba(255,255,255,0.5)" : "rgba(20,20,20,0.5)";
  const micro = dark ? "rgba(255,255,255,0.42)" : "rgba(20,20,20,0.42)";
  const accent = "#b5544f";
  const accentText = dark ? "#cf8078" : "#7a2020";
  const popupBg = dark ? "#17110f" : "#ffffff";
  const nodeBg = dark ? "#1a1210" : "#ffffff";
  const upColor = dark ? "#5cba85" : "#2f8f57";
  const downColor = dark ? "#e0736a" : "#b23b30";

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

  useEffect(() => {
    if (!playing || reduced || popup) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 3200);
    return () => window.clearInterval(id);
  }, [playing, reduced, popup]);

  useEffect(() => {
    if (!playing || reduced) return;
    // an open spot that avoids the HUD panels
    const spot = (): [number, number] => {
      let x = 400;
      let y = 180;
      for (let t = 0; t < 24; t++) {
        x = 40 + Math.random() * 720;
        y = 40 + Math.random() * 280;
        const inChart = x > 556 && y > 244;
        const inReadout = x < 296 && y < 42;
        const inPause = x > 690 && y < 42;
        const inSignals = x > 286 && x < 512 && y > 292;
        if (!inChart && !inReadout && !inPause && !inSignals) break;
      }
      return [x, y];
    };
    const id = window.setInterval(() => {
      const [x, y] = spot();
      const nd: Dot = { id: nextId.current++, x, y, spawned: true };
      setDots((prev) => {
        // drift a few existing points so the field is always shifting
        let arr = prev.map((d) =>
          !d.leaving && Math.random() < 0.28
            ? { ...d, x: clamp(d.x + (Math.random() - 0.5) * 46, 40, 760), y: clamp(d.y + (Math.random() - 0.5) * 40, 40, 316) }
            : d
        );
        arr = [...arr, nd];
        const spawned = arr.filter((d) => d.spawned && !d.leaving);
        if (spawned.length > 13) {
          const oldest = spawned[0]!;
          window.setTimeout(() => setDots((p) => p.filter((d) => d.id !== oldest.id)), 700);
          return arr.map((d) => (d.id === oldest.id ? { ...d, leaving: true } : d));
        }
        return arr;
      });
    }, 1800);
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
  const sig = reduced ? SIGNALS[0]! : SIGNALS[tick % SIGNALS.length]!;
  const fadeKey = reduced ? "static" : tick;

  const cardW = 246;
  const cardH = popup ? 32 + popup.lines.length * 15 + 12 : 0;
  const cardX = popup ? clamp(popup.ax - cardW / 2, 12, 800 - cardW - 12) : 0;
  const cardYRaw = popup ? popup.ay - cardH - 18 : 0;
  const cardY = popup ? (cardYRaw < 12 ? clamp(popup.ay + 18, 12, 360 - cardH - 12) : cardYRaw) : 0;

  const openPoi = (p: Poi) => setPopup({ title: p.title, lines: wrap(p.info), ax: p.x, ay: p.y });

  // The single, consistent "clickable" marker used for every interactive point —
  // same size and colour everywhere, with a gently pulsing halo so it reads as a
  // button. Brighter coral than the static data so it clearly stands out.
  const Node = ({ x, y }: { x: number; y: number }) => (
    <g pointerEvents="none">
      <circle cx={x} cy={y} r="13" fill="none" stroke={labelText} strokeWidth="1" opacity="0.4">
        {!reduced && <animate attributeName="opacity" values="0.55;0.18;0.55" dur="2.6s" repeatCount="indefinite" />}
      </circle>
      <circle cx={x} cy={y} r="7.5" fill={nodeBg} stroke={labelText} strokeWidth="1.3" />
      <path d={`M${x - 3.3} ${y} H${x + 3.3} M${x} ${y - 3.3} V${y + 3.3}`} stroke={labelText} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 360"
      aria-label="Interactive market map: select a point to learn what the analysis shows"
      className={cn("h-auto w-full", className)}
      onClick={() => setPopup(null)}
    >
      <defs>
        <pattern id="mml-streets" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0H0V44" fill="none" stroke={line} strokeWidth="1" />
        </pattern>
        <radialGradient id="mml-heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c2626" stopOpacity="0.62" />
          <stop offset="48%" stopColor="#500000" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#500000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mml-sweep" cx="278" cy="145" r="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mml-sweep2" cx="540" cy="215" r="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={accent} stopOpacity="0.20" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mml-scan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="70%" stopColor={accent} stopOpacity="0.07" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.13" />
        </linearGradient>
      </defs>

      <rect width="800" height="360" fill="url(#mml-streets)" />
      <path d="M0 300 L800 60" stroke={line} strokeWidth="1.5" fill="none" />
      <path d="M120 0 L520 360" stroke={line} strokeWidth="1.5" fill="none" />

      <circle cx="292" cy="150" r="132" fill="url(#mml-heat)" />
      <circle cx="540" cy="215" r="108" fill="url(#mml-heat)" />

      {!reduced && (
        <path d="M292 150 L442 150 A150 150 0 0 1 427.9 213.4 Z" fill="url(#mml-sweep)">
          <animateTransform attributeName="transform" type="rotate" from="0 292 150" to="360 292 150" dur="16s" repeatCount="indefinite" />
        </path>
      )}

      {/* second radar over the growth / opportunity cluster */}
      {!reduced && (
        <path d="M540 215 L635 215 A95 95 0 0 1 626.1 255.2 Z" fill="url(#mml-sweep2)">
          <animateTransform attributeName="transform" type="rotate" from="360 540 215" to="0 540 215" dur="11s" repeatCount="indefinite" />
        </path>
      )}

      {[48, 88, 128].map((r) => (
        <circle key={r} cx="292" cy="150" r={r} fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 7" opacity={0.5 - r / 520} />
      ))}
      {[36, 66].map((r) => (
        <circle key={`g${r}`} cx="540" cy="215" r={r} fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 7" opacity={0.42 - r / 520} />
      ))}

      {/* data-collection scan sweeping the whole grid */}
      {!reduced && (
        <g>
          <rect x="0" y="0" width="78" height="360" fill="url(#mml-scan)" />
          <rect x="76" y="0" width="1.4" height="360" fill={accent} opacity="0.35" />
          <animateTransform attributeName="transform" type="translate" from="-80 0" to="800 0" dur="7.5s" repeatCount="indefinite" />
        </g>
      )}

      {/* customer points */}
      {dots.map((d) => (
        <g key={d.id}>
          {d.spawned && !d.leaving && !reduced && (
            <circle cx={d.x} cy={d.y} r="2.5" fill="none" stroke={accent} strokeWidth="1">
              <animate attributeName="r" from="2.5" to="12" dur="1.4s" repeatCount="1" fill="freeze" />
              <animate attributeName="opacity" from="0.55" to="0" dur="1.4s" repeatCount="1" fill="freeze" />
            </circle>
          )}
          <circle
            cx={d.x}
            cy={d.y}
            r={d.spawned ? 2.6 : 2}
            fill={d.spawned ? accent : dotColor}
            style={reduced ? undefined : { transition: "cx 1.3s ease, cy 1.3s ease" }}
          >
            {d.spawned && !d.leaving && !reduced && <animate attributeName="opacity" from="0" to="1" dur="0.6s" repeatCount="1" fill="freeze" />}
            {d.leaving && !reduced && <animate attributeName="opacity" from="1" to="0" dur="0.7s" repeatCount="1" fill="freeze" />}
          </circle>
        </g>
      ))}

      {/* demographic labels — each a clickable customer profile */}
      {CHIPS.map((c, i) => (
        <g
          key={i}
          role="button"
          tabIndex={0}
          aria-label={`${c.title} — details`}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            setPopup({ title: c.title, lines: wrap(c.info), ax: c.lx, ay: c.ly });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setPopup({ title: c.title, lines: wrap(c.info), ax: c.lx, ay: c.ly });
            }
          }}
        >
          <line x1={c.px} y1={c.py} x2={c.lx} y2={c.ly} stroke={hair} strokeWidth="1" />
          <Node x={c.px} y={c.py} />
          <g transform={`translate(${c.lx} ${c.ly})`}>
            <rect x="-50" y="-12" width="100" height="24" rx="4" fill={chipBg} stroke={hair} />
            <text key={fadeKey} className={reduced ? undefined : "animate-fade"} y="1" textAnchor="middle" dominantBaseline="middle" fontSize="11.5" fontWeight={500} letterSpacing="0.01em" fill={labelText}>
              {reduced ? c.values[0] : val(c.values, i)}
            </text>
          </g>
        </g>
      ))}

      {/* competitor callout */}
      <g
        role="button"
        tabIndex={0}
        aria-label="Competitor — details"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setPopup({ title: COMPETITOR.title, lines: wrap(COMPETITOR.info), ax: COMPETITOR.lx, ay: COMPETITOR.ly });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPopup({ title: COMPETITOR.title, lines: wrap(COMPETITOR.info), ax: COMPETITOR.lx, ay: COMPETITOR.ly });
          }
        }}
      >
        <line x1={COMPETITOR.px} y1={COMPETITOR.py} x2={COMPETITOR.lx} y2={COMPETITOR.ly} stroke={hair} strokeWidth="1" />
        <Node x={COMPETITOR.px} y={COMPETITOR.py} />
        <g transform={`translate(${COMPETITOR.lx} ${COMPETITOR.ly})`}>
          <rect x="-54" y="-12" width="108" height="24" rx="4" fill={chipBg} stroke={hair} />
          <text y="1" textAnchor="middle" dominantBaseline="middle" fontSize="10.5" fontWeight={500} letterSpacing="0.01em" fill={downColor}>
            {COMPETITOR.label}
          </text>
        </g>
      </g>

      {/* primary + secondary pins (drawn under the click nodes) */}
      <g transform="translate(292 150)">
        <circle r="6.5" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.6" />
        <circle r="2.4" fill={accent} />
      </g>
      <g transform="translate(540 215)">
        <circle r="2.2" fill={accent} opacity="0.85" />
      </g>

      {/* clickable feature nodes — hit target centred on the node */}
      {POIS.map((p) => (
        <g
          key={p.title}
          role="button"
          tabIndex={0}
          aria-label={`${p.title} — details`}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            openPoi(p);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPoi(p);
            }
          }}
        >
          <circle cx={p.x} cy={p.y} r="18" fill="transparent" />
          <Node x={p.x} y={p.y} />
        </g>
      ))}

      {/* analysis readout — top left, clickable */}
      <g
        role="button"
        tabIndex={0}
        aria-label={`Analytics: ${tech.name} — what it means`}
        style={{ cursor: "pointer" }}
        transform="translate(20 20)"
        onClick={(e) => {
          e.stopPropagation();
          setPopup({ title: tech.name, lines: wrap(tech.info), ax: 148, ay: 40 });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPopup({ title: tech.name, lines: wrap(tech.info), ax: 148, ay: 40 });
          }
        }}
      >
        <rect x="0" y="-14" width="258" height="28" rx="4" fill={chipBg} stroke={hair} />
        <circle cx="15" cy="0" r="2.8" fill={accent}>
          {!reduced && <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite" />}
        </circle>
        <text x="26" y="1" dominantBaseline="middle" fontSize="10.5" fontWeight={500} letterSpacing="0.07em">
          <tspan fill={micro}>ANALYZING&nbsp;&nbsp;·&nbsp;&nbsp;</tspan>
          <tspan key={fadeKey} className={reduced ? undefined : "animate-fade"} fill={upColor}>{tech.name.toUpperCase()}</tspan>
        </text>
        <Node x={243} y={0} />
      </g>

      {/* pause / play — top right */}
      {!reduced && (
        <g
          role="button"
          tabIndex={0}
          aria-label={playing ? "Pause the animation" : "Play the animation"}
          style={{ cursor: "pointer" }}
          transform="translate(704 8)"
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
          <rect x="0" y="0" width="76" height="26" rx="4" fill={chipBg} stroke={hair} />
          {playing ? (
            <g fill={labelText}>
              <rect x="14" y="8.5" width="2.4" height="9" rx="0.6" />
              <rect x="18.5" y="8.5" width="2.4" height="9" rx="0.6" />
            </g>
          ) : (
            <path d="M14 8.5 L21 13 L14 17.5 Z" fill={labelText} />
          )}
          <text x="46" y="13.5" textAnchor="middle" dominantBaseline="middle" fontSize="9.5" fontWeight={500} letterSpacing="0.08em" fill={muted}>
            {playing ? "PAUSE" : "PLAY"}
          </text>
        </g>
      )}

      {/* live signals — bottom centre, content centred */}
      <g transform="translate(294 298)">
        <rect x="0" y="0" width="212" height="46" rx="6" fill={panel} stroke={hair} />
        <circle cx="14" cy="23" r="2.6" fill={upColor}>
          {!reduced && <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite" />}
        </circle>
        <text x="106" y="17" textAnchor="middle" fontSize="9" fontWeight={500} letterSpacing="0.09em" fill={micro}>
          <tspan>LIVE SIGNALS&nbsp;&nbsp;·&nbsp;&nbsp;</tspan>
          <tspan key={`sk-${fadeKey}`} className={reduced ? undefined : "animate-fade"} fill={muted}>{sig.k}</tspan>
        </text>
        <text key={`sv-${fadeKey}`} className={reduced ? undefined : "animate-fade"} x="106" y="35" textAnchor="middle" fontSize="12" fontWeight={600} fill={labelText}>
          {sig.v}
        </text>
      </g>

      {/* hint */}
      {!popup && (
        <text x="20" y="340" fontSize="9.5" letterSpacing="0.09em" fill={micro}>
          SELECT A POINT TO EXPLORE
        </text>
      )}

      {/* explanation popup */}
      {popup && (
        <g>
          <line x1={popup.ax} y1={popup.ay} x2={clamp(popup.ax, cardX + 14, cardX + cardW - 14)} y2={cardY < popup.ay ? cardY + cardH : cardY} stroke={hair} strokeWidth="1" />
          <rect x={cardX} y={cardY} width={cardW} height={cardH} rx="6" fill={popupBg} stroke={hair} />
          <rect x={cardX} y={cardY} width="3" height={cardH} rx="1.5" fill={accent} />
          <text x={cardX + 16} y={cardY + 21} fontSize="12.5" fontWeight={600} letterSpacing="0.01em" fill={accentText}>{popup.title}</text>
          {popup.lines.map((l, i) => (
            <text key={i} x={cardX + 16} y={cardY + 40 + i * 15} fontSize="11.5" fill={muted}>{l}</text>
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
            <rect x={cardX + cardW - 28} y={cardY + 8} width="20" height="20" rx="4" fill="transparent" />
            <path
              d={`M${cardX + cardW - 22} ${cardY + 14} l8 8 M${cardX + cardW - 14} ${cardY + 14} l-8 8`}
              stroke={muted}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        </g>
      )}
    </svg>
  );
}
