/**
 * @illustrative-figures: every number in this component is demonstration data for the
 * fictional client Lumina Medical Aesthetics, not Aperture fees or real market data.
 */
"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ANALYSIS_CSS, AtlasAnalysis, HOLIDAY_LIFT_PCT, WEEKLY_MODEL, weatherImpactPct } from "./AtlasAnalysis";

/**
 * Aperture Atlas "Market Map": a map-first dashboard in the style of an ArcGIS
 * Experience Builder app, with a dark and a light view.
 *  - Market layers: hex-binned customer density, drive-time bands, customers,
 *    competitors.
 *  - Influence layers (what moves buyer behaviour): live weather with a visit
 *    impact card, traffic volume (AADT), billboard inventory, new housing
 *    permits and ACS income.
 *  - The time slider plays twelve months: customers appear, density deepens,
 *    penetration climbs, competitors open and the weather changes.
 *  - Hexes and billboards open a popup with their figures.
 *  - Reduced-motion users start paused on the latest month with no drift.
 * The map is drawn in an 800x500 viewBox with preserveAspectRatio "meet" inside
 * an 8:5 box, so HTML overlays can be placed in exact percentages.
 */

const W = 800;
const H = 500;
const MI = 55; // viewBox units per mile
const STORE = { x: 330, y: 235 };
const HOT = [
  { x: 330, y: 235, s: 95, w: 1 },
  { x: 575, y: 315, s: 70, w: 0.65 },
  { x: 470, y: 130, s: 55, w: 0.4 },
];
const MONTHS = ["Sep 25", "Oct", "Nov", "Dec", "Jan 26", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep 26"];
const LAST = MONTHS.length - 1;
// Spring, TX: Saturday forecast high (°F) and chance of rain, by month.
const WX_TEMP = [92, 84, 72, 64, 58, 66, 74, 82, 88, 97, 103, 105, 96];
const WX_RAIN = [20, 30, 25, 40, 70, 35, 45, 75, 85, 40, 5, 5, 30];
function wxCondition(t: number, rain: number) {
  if (rain >= 75) return { label: "Thunderstorms", icon: "storm" as const };
  if (rain >= 50) return { label: "Rain", icon: "rain" as const };
  if (t >= 100) return { label: "Extreme heat", icon: "sun" as const };
  if (t >= 95) return { label: "Hot & sunny", icon: "sun" as const };
  if (rain >= 35) return { label: "Chance of rain", icon: "cloud" as const };
  return { label: t < 65 ? "Cool & clear" : "Clear", icon: "sun" as const };
}
// Next holiday per slider month; weight scales the modelled event-study lift.
const HOLIDAYS = [
  { name: "Halloween", when: "in 5 wks", rel: -3, w: 0.3 },
  { name: "Black Friday", when: "in 4 wks", rel: -3, w: 1.2 },
  { name: "Black Friday", when: "in 9 days", rel: -1, w: 1.2 },
  { name: "Holiday gifting", when: "this week", rel: 0, w: 1.6 },
  { name: "New Year resolutions", when: "this week", rel: 0, w: 0.7 },
  { name: "Valentine's Day", when: "in 6 days", rel: -1, w: 1 },
  { name: "Spring break", when: "in 2 wks", rel: -2, w: 0.5 },
  { name: "Mother's Day", when: "in 3 wks", rel: -3, w: 1.8 },
  { name: "Mother's Day", when: "in 4 days", rel: -1, w: 1.8 },
  { name: "July 4th", when: "in 3 wks", rel: -3, w: 0.4 },
  { name: "Back-to-school", when: "in 4 wks", rel: -3, w: 0.3 },
  { name: "Labor Day", when: "in 2 wks", rel: -2, w: 0.5 },
  { name: "Halloween", when: "in 5 wks", rel: -3, w: 0.3 },
];
const VENUES = [
  { id: "V1", x: 455, y: 250, name: "Town Center Pavilion", crowd: 18 },
  { id: "V2", x: 296, y: 178, name: "Waterway Market", crowd: 9 },
  { id: "V3", x: 540, y: 272, name: "Riverside Park", crowd: 6 },
];
const EVENTS = ["Fall concert series", "Fall festival", "Holiday market opens", "Holiday lights", "Resolution 5K", "Valentine's market",
  "Spring art fair", "Farmers market", "Mother's Day brunch walk", "Summer concerts", "Movie nights", "Back-to-school fair", "Fall concert series"];
const EVENT_COLOR = "#9b7bff";
const TRAFFIC = ["#f2d43d", "#f29b3d", "#e0533d"];
const BILLBOARD = "#e8b04a";
const HOUSING = "#4fb3a9";
const RAIN_COLOR = "#3fbf5f";

type Theme = {
  land: string; water: string; minor: string; casing: string; major: string; shield: string; shieldTx: string;
  place: string; ramp: string[]; income: string[]; dot: string; ink: string; accent: string; pos: string; neg: string;
  vars: Record<string, string>;
};
const THEMES: Record<"dark" | "light", Theme> = {
  dark: {
    land: "#0f0f11", water: "#0c161d", minor: "#1a1a1d", casing: "#08080a", major: "#2a2a2e", shield: "#28282c", shieldTx: "#f2f2f2",
    place: "#8a8a90", ramp: ["#2a1214", "#5c1a1f", "#8c2b2b", "#b5544f", "#e8a598"], income: ["#121820", "#1b2a3a", "#26405a", "#35597c"],
    dot: "#e6e6e6", ink: "#f2f2f2", accent: "#c9756c", pos: "#2ECC71", neg: "#ff6b5e",
    vars: { "--bg": "#0f0f11", "--pn": "rgba(18,18,20,.94)", "--bd": "#2a2a2e", "--tx": "#f2f2f2", "--mu": "#8b8b92", "--pop": "#141416", "--acc": "#c9756c", "--on": "#8c2b2b", "--off": "#333", "--attr": "rgba(10,10,11,.88)", "--attrtx": "#6f6f76", "--row": "#b8b8be" },
  },
  light: {
    land: "#f2f1ed", water: "#bcd6ea", minor: "#e2e0da", casing: "#d2cfc7", major: "#ffffff", shield: "#ffffff", shieldTx: "#1d2733",
    place: "#5b6470", ramp: ["#f4dcd9", "#e2a9a3", "#c46b62", "#8c2b2b", "#500000"], income: ["#eef3f8", "#cfdcea", "#a8c0d9", "#7d9fc4"],
    dot: "#2b2b2b", ink: "#1d2733", accent: "#8c2b2b", pos: "#1a8f5a", neg: "#c0392b",
    vars: { "--bg": "#f2f1ed", "--pn": "rgba(255,255,255,.96)", "--bd": "#dcdfe4", "--tx": "#1d2733", "--mu": "#667085", "--pop": "#ffffff", "--acc": "#8c2b2b", "--on": "#8c2b2b", "--off": "#cfd3d9", "--attr": "rgba(255,255,255,.9)", "--attrtx": "#667085", "--row": "#4a5563" },
  },
};

type Pt = [number, number];
const ROADS: { name: string; p: [Pt, Pt, Pt, Pt]; v: number; aadt: string }[] = [
  { name: "SH 242", p: [[-10, 150], [200, 170], [380, 120], [820, 200]], v: 0.55, aadt: "94k" },
  { name: "I-45", p: [[360, -10], [340, 150], [390, 330], [330, 520]], v: 1, aadt: "212k" },
  { name: "Woodlands Pkwy", p: [[-10, 330], [250, 300], [500, 360], [820, 280]], v: 0.72, aadt: "118k" },
  { name: "Research Forest", p: [[650, -10], [600, 150], [700, 330], [620, 520]], v: 0.4, aadt: "46k" },
];
const roadD = (p: Pt[]) => `M${p[0]![0]} ${p[0]![1]} C${p[1]![0]} ${p[1]![1]} ${p[2]![0]} ${p[2]![1]} ${p[3]![0]} ${p[3]![1]}`;
function onRoad(p: Pt[], t: number, off = 0): Pt {
  const u = 1 - t;
  const b = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  const d = [-3 * u * u, 3 * u * u - 6 * u * t, 6 * u * t - 3 * t * t, 3 * t * t];
  const x = b.reduce((s, k, i) => s + k * p[i]![0], 0);
  const y = b.reduce((s, k, i) => s + k * p[i]![1], 0);
  const dx = d.reduce((s, k, i) => s + k * p[i]![0], 0);
  const dy = d.reduce((s, k, i) => s + k * p[i]![1], 0);
  const n = Math.hypot(dx, dy) || 1;
  return [x - (dy / n) * off, y + (dx / n) * off];
}

const COMPETITORS = [
  { x: 520, y: 210, m: 0, name: "Northside Medspa" },
  { x: 610, y: 360, m: 0, name: "Riverstone Skin" },
  { x: 250, y: 330, m: 0, name: "Cedar Laser Studio" },
  { x: 700, y: 250, m: 0, name: "Market St. Aesthetics" },
  { x: 190, y: 190, m: 0, name: "Creekside Wellness" },
  { x: 430, y: 90, m: 5, name: "Glow Aesthetics Co." },
  { x: 400, y: 285, m: 9, name: "Pure Face Bar" },
];
const BILLBOARDS = [
  { road: 1, t: 0.2, id: "B-01", face: "I-45 southbound", imp: 182, status: "Booked · Lumina", ours: true },
  { road: 1, t: 0.64, id: "B-02", face: "I-45 northbound", imp: 164, status: "Available Nov", ours: false },
  { road: 0, t: 0.6, id: "B-03", face: "SH 242 eastbound", imp: 71, status: "Available now", ours: false },
  { road: 2, t: 0.33, id: "B-04", face: "Woodlands Pkwy westbound", imp: 88, status: "Competitor ad", ours: false },
  { road: 2, t: 0.8, id: "B-05", face: "Woodlands Pkwy eastbound", imp: 79, status: "Available Jan", ours: false },
  { road: 3, t: 0.28, id: "B-06", face: "Research Forest", imp: 34, status: "Available now", ours: false },
].map((b) => {
  const [x, y] = onRoad(ROADS[b.road]!.p, b.t, 12);
  return { ...b, x, y, mi: Math.hypot(x - STORE.x, y - STORE.y) / MI };
});
const HOUSING_AREAS = [
  { pts: "700,286 770,278 792,330 748,362 706,346", lx: 748, ly: 322, label: "+420 homes" },
  { pts: "92,352 176,340 206,392 150,418 96,400", lx: 150, ly: 382, label: "+260 homes" },
];
const RAIN_CELLS: [number, number, number, number][] = [[190, 120, 115, 72], [620, 390, 95, 60], [540, 70, 70, 44]];

const LAYER_GROUPS = [
  { title: "Market", items: [
    { key: "density", label: "Customer density" },
    { key: "drive", label: "Drive-time bands" },
    { key: "customers", label: "Customers" },
    { key: "competitors", label: "Competitors" },
  ] },
  { title: "Buyer influences", items: [
    { key: "weather", label: "Weather" },
    { key: "traffic", label: "Traffic volume" },
    { key: "billboards", label: "Key billboards" },
    { key: "holidays", label: "Holidays & events" },
    { key: "housing", label: "New housing" },
    { key: "income", label: "Income (ACS)" },
  ] },
] as const;
type LayerKey = (typeof LAYER_GROUPS)[number]["items"][number]["key"];

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const density = (x: number, y: number) =>
  HOT.reduce((s, h) => s + h.w * Math.exp(-((x - h.x) ** 2 + (y - h.y) ** 2) / (2 * h.s * h.s)), 0);
const income = (x: number, y: number) =>
  0.5 + 0.35 * Math.sin(x / 140 + 0.6) * Math.cos(y / 110) + 0.2 * Math.exp(-((x - 180) ** 2 + (y - 110) ** 2) / 12000);
function ramp(stops: string[], v: number) {
  const c = Math.max(0, Math.min(0.999, v)) * (stops.length - 1);
  const i = Math.floor(c);
  const f = c - i;
  const a = stops[i]!.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const b = stops[i + 1]!.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  return `rgb(${a.map((x, k) => Math.round(x + (b[k]! - x) * f)).join(",")})`;
}
const f1 = (n: number) => n.toFixed(1);

type Hex = { id: string; cx: number; cy: number; pts: string; v: number; hh: number; inc: number };
type Popup = { key: string; x: number; y: number; title: string; rows: [string, string, string?][] };

function buildGeometry() {
  const r = rng(7);
  const minorX: number[] = [];
  const minorY: number[] = [];
  for (let x = -200; x < 1000; x += 30 + r() * 14) minorX.push(Math.round(x));
  for (let y = -200; y < 700; y += 30 + r() * 14) minorY.push(Math.round(y));

  const hexes: Hex[] = [];
  const R = 15;
  const hw = R * Math.sqrt(3);
  for (let j = 0; j * 1.5 * R < H + R; j++)
    for (let i = 0; i * hw < W + hw; i++) {
      const cx = i * hw + ((j % 2) * hw) / 2;
      const cy = j * 1.5 * R;
      const v = density(cx, cy);
      if (v < 0.1) continue;
      let pts = "";
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 180) * (60 * k - 30);
        pts += `${f1(cx + R * Math.cos(a))},${f1(cy + R * Math.sin(a))} `;
      }
      hexes.push({
        id: `8C-${String(j * 40 + i).padStart(3, "0")}`,
        cx, cy, pts, v,
        hh: Math.round(380 + 260 * r() + 120 * v),
        inc: Math.round(70 + 60 * income(cx, cy) + 8 * r()),
      });
    }

  const tracts: { x: number; y: number; v: number }[] = [];
  for (let x = 0; x < W; x += 80) for (let y = 0; y < H; y += 72) tracts.push({ x, y, v: income(x + 40, y + 36) });

  const customers: { x: number; y: number; m: number }[] = [];
  for (let k = 0; k < 190; k++) {
    const h = r() < 0.55 ? HOT[0]! : r() < 0.7 ? HOT[1]! : HOT[2]!;
    const u = Math.sqrt(-2 * Math.log(r() + 1e-9)) * h.s * 0.7;
    const a = r() * Math.PI * 2;
    customers.push({ x: h.x + u * Math.cos(a), y: h.y + u * Math.sin(a), m: r() < 0.5 ? 0 : 1 + Math.floor(r() * LAST) });
  }

  const rings = [150, 100, 55].map((b, n) => {
    let pts = "";
    for (let a = 0; a < 6.3; a += 0.12) {
      const rr = b * (1 + 0.14 * Math.sin(3 * a + n) + 0.07 * Math.cos(5 * a + 7));
      pts += `${f1(STORE.x + rr * Math.cos(a))},${f1(STORE.y + rr * 0.85 * Math.sin(a))} `;
    }
    return { pts, label: `${[15, 10, 5][n]} min`, lx: STORE.x + b * 1.02, ly: STORE.y + 5 - b * 0.1, dashed: n > 0 };
  });
  return { minorX, minorY, hexes, tracts, customers, rings };
}

const SHIELDS: [string, number, number][] = [["I-45", 352, 60], ["SH 242", 262, 150], ["Woodlands Pkwy", 560, 322]];
const PLACES: [string, number, number][] = [["THE WOODLANDS", 250, 290], ["SPRING", 96, 428], ["OAK RIDGE N.", 372, 30], ["CREEKSIDE", 36, 300]];

function WxIcon({ kind }: { kind: "sun" | "cloud" | "rain" | "storm" }) {
  const cloud = <path d="M9 22h15a5 5 0 0 0 0-10 7 7 0 0 0-13.5 1.5A4.5 4.5 0 0 0 9 22z" fill="#9aa4b2" />;
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
      {kind === "sun" && (
        <g stroke="#ffb21a" strokeWidth="2" strokeLinecap="round">
          <circle cx="17" cy="17" r="6.5" fill="#ffb21a" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={17 + 10 * Math.cos(a)} y1={17 + 10 * Math.sin(a)} x2={17 + 13.5 * Math.cos(a)} y2={17 + 13.5 * Math.sin(a)} />;
          })}
        </g>
      )}
      {kind === "cloud" && (<><circle cx="22" cy="11" r="5" fill="#ffb21a" />{cloud}</>)}
      {(kind === "rain" || kind === "storm") && (
        <>
          {cloud}
          <g stroke="#5fb3ff" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="25" x2="10" y2="30" /><line x1="18" y1="25" x2="16" y2="30" /><line x1="24" y1="25" x2="22" y2="30" /></g>
          {kind === "storm" && <path d="M19 21l-4 6h3l-2 5 5-7h-3l2-4z" fill="#ffd43d" />}
        </>
      )}
    </svg>
  );
}

export function AtlasMarketMap({ className, showAnalysis = true }: { className?: string; showAnalysis?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const geo = useMemo(buildGeometry, []);
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const [month, setMonth] = useState(LAST);
  const [playing, setPlaying] = useState(false);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    density: true, drive: true, customers: true, competitors: true,
    weather: true, traffic: false, billboards: true, holidays: true, housing: false, income: false,
  });
  const [pop, setPop] = useState<Popup | null>(null);
  const [clock, setClock] = useState("");
  const th = THEMES[mode];

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      setMonth(0);
      setPlaying(true);
    }
    const tickClock = () => setClock(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tickClock();
    const id = window.setInterval(tickClock, 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!playing || pop) return;
    const id = window.setTimeout(() => setMonth((m) => (m >= LAST ? 0 : m + 1)), month >= LAST ? 5500 : 2600);
    return () => window.clearTimeout(id);
  }, [playing, month, pop]);

  const growth = 0.55 + (0.45 * month) / LAST;
  const penetration = 3.9 + month * 0.21;
  const customers = Math.round(1900 + month * 105);
  const compOpen = COMPETITORS.filter((c) => c.m <= month);
  const compNew = compOpen.filter((c) => c.m > 0).length;
  const temp = WX_TEMP[month]!;
  const rain = WX_RAIN[month]!;
  const cond = wxCondition(temp, rain);
  const impact = weatherImpactPct(temp, rain);
  const wxNote = rain >= 50 ? "Rain keeps walk-ins home" : temp >= 100 ? "Heat pushes visits to evenings" : temp >= 95 ? "Hot: mornings and evenings fill first" : "Good weather for walk-ins";
  const hol = HOLIDAYS[month]!;
  const holLift = HOLIDAY_LIFT_PCT[[-3, -2, -1, 0, 1].indexOf(hol.rel)]! * hol.w;
  const hot = temp >= 95;
  const wet = rain >= 50;
  const toggle = (k: LayerKey) => setLayers((l) => ({ ...l, [k]: !l[k] }));

  const kpis = [
    { k: "Households", v: "48.2k", d: null },
    { k: "Customers", v: customers.toLocaleString("en-US"), d: null },
    { k: "Penetration", v: `${penetration.toFixed(1)}%`, d: month ? { t: `▲${(month * 0.21).toFixed(1)}`, c: th.pos } : null },
    { k: "Competitors", v: String(compOpen.length), d: compNew ? { t: `▲${compNew}`, c: th.neg } : null },
  ];

  const openHex = (h: Hex) => {
    if (pop?.key === h.id) return setPop(null);
    const c = Math.round(h.hh * (0.03 + 0.1 * h.v) * growth);
    setPop({ key: h.id, x: h.cx, y: h.cy, title: `Hex ${h.id}`, rows: [
      ["Households", h.hh.toLocaleString("en-US")],
      ["Customers", String(c)],
      ["Penetration", `${((c / h.hh) * 100).toFixed(1)}%`, th.pos],
      ["Median income", `$${h.inc}k`],
      ["Drive time", `${Math.max(1, Math.round((Math.hypot(h.cx - STORE.x, h.cy - STORE.y) / MI) * 2.6))} min`],
    ] });
  };
  const openVenue = (v: (typeof VENUES)[number]) => {
    if (pop?.key === v.id) return setPop(null);
    setPop({ key: v.id, x: v.x, y: v.y, title: v.name, rows: [
      ["Event", EVENTS[month]!],
      ["Expected crowd", `${v.crowd}k / weekend`],
      ["From client", `${(Math.hypot(v.x - STORE.x, v.y - STORE.y) / MI).toFixed(1)} mi`],
      ["Walk-in lift", `+${(v.crowd * 0.6).toFixed(0)}%`, th.pos],
    ] });
  };
  const openBoard = (b: (typeof BILLBOARDS)[number]) => {
    if (pop?.key === b.id) return setPop(null);
    setPop({ key: b.id, x: b.x, y: b.y, title: `Key billboard ${b.id}`, rows: [
      ["Facing", b.face],
      ["Weekly impressions", `${b.imp}k`],
      ["From client", `${b.mi.toFixed(1)} mi`],
      ["Status", b.status, b.ours ? th.pos : b.status === "Competitor ad" ? th.neg : undefined],
    ] });
  };

  const legendRows: { icon: React.ReactElement; label: string }[] = [
    { icon: <circle cx="6" cy="6" r="4.5" fill={th.accent} stroke="#fff" strokeWidth="1.5" />, label: "Client location" },
  ];
  if (layers.competitors) legendRows.push({ icon: <rect x="2.5" y="2.5" width="7" height="7" transform="rotate(45 6 6)" fill="none" stroke={th.ink} strokeWidth="1.5" />, label: "Competitor" });
  if (layers.drive) legendRows.push({ icon: <line x1="0" y1="6" x2="12" y2="6" stroke={th.accent} strokeDasharray="3 2" strokeWidth="1.5" />, label: "Drive-time band" });
  if (layers.billboards) legendRows.push({ icon: <rect x="1" y="3" width="10" height="6" rx="1" fill={BILLBOARD} />, label: "Key billboard" });
  if (layers.traffic) legendRows.push({ icon: <line x1="0" y1="6" x2="12" y2="6" stroke={TRAFFIC[2]} strokeWidth="3" />, label: "Traffic volume (AADT)" });
  if (layers.holidays) legendRows.push({ icon: <circle cx="6" cy="6" r="4.5" fill={EVENT_COLOR} stroke="#fff" strokeWidth="1.2" />, label: "Event venue" });
  if (layers.weather && wet) legendRows.push({ icon: <circle cx="6" cy="6" r="5" fill={RAIN_COLOR} opacity=".6" />, label: "Rain (radar)" });
  if (layers.weather && hot) legendRows.push({ icon: <circle cx="6" cy="6" r="5" fill="#ff7a1a" opacity=".55" />, label: "Heat index" });
  if (layers.housing) legendRows.push({ icon: <rect x="1" y="1" width="10" height="10" fill={`url(#${uid}-hatch)`} stroke={HOUSING} />, label: "New housing permits" });

  return (
    <div className={cn("atl", className)} style={th.vars as React.CSSProperties}>
      <style>{CSS + ANALYSIS_CSS}</style>
      <div className="atl-stage">
        <div className="atl-mapwrap">
          <svg className="atl-map" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img"
            aria-label="Illustrative Aperture Atlas market map of The Woodlands, Texas: customer density by hexagon, drive-time bands, competitors, billboards, traffic, weather and new housing">
            <defs>
              <radialGradient id={`${uid}-rain`}>
                <stop offset="0" stopColor="#f29b3d" stopOpacity=".85" />
                <stop offset=".35" stopColor="#f2d43d" stopOpacity=".7" />
                <stop offset=".7" stopColor={RAIN_COLOR} stopOpacity=".55" />
                <stop offset="1" stopColor={RAIN_COLOR} stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`${uid}-heat`}>
                <stop offset="0" stopColor="#ff5a1a" stopOpacity=".55" />
                <stop offset=".55" stopColor="#ff9a1a" stopOpacity=".25" />
                <stop offset="1" stopColor="#ffb21a" stopOpacity="0" />
              </radialGradient>
              <pattern id={`${uid}-streak`} width="20" height="20" patternUnits="userSpaceOnUse">
                <line x1="13" y1="0" x2="9" y2="11" stroke={mode === "dark" ? "#9fd3ff" : "#3b78b5"} strokeWidth="1" opacity={mode === "dark" ? 0.6 : 0.35} />
              </pattern>
              <pattern id={`${uid}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke={HOUSING} strokeWidth="2" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill={th.land} />
            {layers.income && geo.tracts.map((t) => (
              <rect key={`${t.x}-${t.y}`} x={t.x} y={t.y} width={80} height={72} fill={ramp(th.income, t.v)} stroke={th.land} strokeWidth={1.5} />
            ))}
            <path d="M-20 420 C150 380 250 480 420 440 S700 390 820 450 L820 520 L-20 520Z" fill={th.water} />
            <path d="M430 440 C460 380 520 360 540 300 S600 220 640 180" fill="none" stroke={th.water} strokeWidth={5} />
            <g transform="rotate(-9 400 250)" stroke={th.minor} strokeWidth={0.9}>
              {geo.minorX.map((x) => <line key={`x${x}`} x1={x} y1={-200} x2={x} y2={700} />)}
              {geo.minorY.map((y) => <line key={`y${y}`} x1={-200} y1={y} x2={1000} y2={y} />)}
            </g>
            {ROADS.map((rd, i) => (
              <g key={rd.name} fill="none">
                <path d={roadD(rd.p)} stroke={th.casing} strokeWidth={i === 1 ? 7 : 5} />
                <path d={roadD(rd.p)} stroke={th.major} strokeWidth={i === 1 ? 4.5 : 3} />
              </g>
            ))}
            {layers.density && geo.hexes.map((h) => (
              <polygon key={h.id} points={h.pts} fill={ramp(th.ramp, ((h.v - 0.1) / 0.95) * growth)} fillOpacity={0.62}
                stroke={pop?.key === h.id ? th.ink : th.land} strokeWidth={pop?.key === h.id ? 2 : 1}
                className="atl-hex" onClick={() => openHex(h)} />
            ))}
            {layers.housing && HOUSING_AREAS.map((a) => (
              <polygon key={a.label} points={a.pts} fill={`url(#${uid}-hatch)`} stroke={HOUSING} strokeWidth={1.2} opacity={0.8} />
            ))}
            {layers.traffic && ROADS.map((rd) => (
              <path key={rd.name} d={roadD(rd.p)} fill="none" stroke={ramp(TRAFFIC, rd.v)}
                strokeWidth={2 + rd.v * 3} strokeLinecap="round" strokeDasharray="6 5" className="atl-flow" pointerEvents="none" />
            ))}
            {layers.drive && geo.rings.map((g) => (
              <g key={g.label} pointerEvents="none">
                <polygon points={g.pts} fill="none" stroke={th.accent} strokeWidth={1.3} strokeDasharray={g.dashed ? "5 4" : undefined} opacity={0.85} />
                <text x={g.lx} y={g.ly} fontSize={10} fontWeight={600} fill={th.accent} stroke={th.land} strokeWidth={3} paintOrder="stroke">{g.label}</text>
              </g>
            ))}
            {layers.customers && (
              <g pointerEvents="none">
                {geo.customers.map((c, i) => (
                  <circle key={i} cx={f1(c.x)} cy={f1(c.y)} r={1.8} fill={th.dot}
                    className={c.m === month && month > 0 ? "atl-new" : undefined} opacity={c.m <= month ? 0.75 : 0} />
                ))}
              </g>
            )}
            {layers.competitors && compOpen.map((c) => (
              <g key={c.name} pointerEvents="none" className={c.m === month && month > 0 ? "atl-new" : undefined}>
                <rect x={c.x - 5} y={c.y - 5} width={10} height={10} transform={`rotate(45 ${c.x} ${c.y})`} fill={th.land} stroke={th.ink} strokeWidth={1.6} />
              </g>
            ))}
            {layers.weather && hot && (
              <g pointerEvents="none">
                <ellipse cx={400} cy={250} rx={170 + (temp - 95) * 12} ry={110 + (temp - 95) * 8} fill={`url(#${uid}-heat)`} className="atl-shimmer" />
                <text x={400} y={250 + (110 + (temp - 95) * 8) * 0.72} fontSize={10.5} fontWeight={700} textAnchor="middle" fill="#ff8a3d" stroke={th.land} strokeWidth={3} paintOrder="stroke">
                  Heat index {Math.round(temp + (temp - 88) * 0.6)}°F
                </text>
              </g>
            )}
            {layers.weather && rain >= 25 && (
              <g pointerEvents="none" className="atl-drift" opacity={0.2 + rain / 160}>
                {RAIN_CELLS.map(([x, y, rx, ry]) => (
                  <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={rx * (0.6 + rain / 120)} ry={ry * (0.6 + rain / 120)} fill={`url(#${uid}-rain)`} />
                ))}
              </g>
            )}
            {layers.weather && wet && (
              <rect x={-40} y={-40} width={W + 80} height={H + 80} fill={`url(#${uid}-streak)`} className="atl-rainfall" pointerEvents="none" />
            )}
            <g pointerEvents="none">
              <circle cx={STORE.x} cy={STORE.y} r={9} fill={th.accent} className="atl-pulse" />
              <circle cx={STORE.x} cy={STORE.y} r={7} fill={th.accent} stroke="#fff" strokeWidth={2} />
              {SHIELDS.map(([n, x, y]) => (
                <g key={n}>
                  <rect x={x - n.length * 3.3 - 5} y={y - 8} width={n.length * 6.6 + 10} height={15} rx={3} fill={th.shield} stroke={th.casing} />
                  <text x={x} y={y + 3} fontSize={9.5} textAnchor="middle" fill={th.shieldTx} fontWeight={600}>{n}</text>
                </g>
              ))}
              {layers.traffic && ROADS.map((rd) => {
                const [x, y] = onRoad(rd.p, rd.name === "I-45" ? 0.14 : 0.86, -14);
                return (
                  <text key={rd.name} x={x} y={y} fontSize={9.5} fontWeight={700} textAnchor="middle" fill={ramp(TRAFFIC, rd.v)} stroke={th.land} strokeWidth={3} paintOrder="stroke">
                    {rd.aadt}/day
                  </text>
                );
              })}
              {layers.housing && HOUSING_AREAS.map((a) => (
                <text key={a.label} x={a.lx} y={a.ly} fontSize={10} fontWeight={700} textAnchor="middle" fill={HOUSING} stroke={th.land} strokeWidth={3} paintOrder="stroke">{a.label}</text>
              ))}
              {PLACES.map(([n, x, y]) => (
                <text key={n} x={x} y={y} fontSize={11} letterSpacing={2.5} fill={th.place} stroke={th.land} strokeWidth={3} paintOrder="stroke" fontWeight={600}>{n}</text>
              ))}
            </g>
            {layers.billboards && BILLBOARDS.map((b) => (
              <g key={b.id} transform={`translate(${f1(b.x)} ${f1(b.y)})`} className="atl-bb" onClick={() => openBoard(b)}>
                <rect x={-12} y={-12} width={24} height={24} fill="transparent" />
                <line x1={0} y1={0} x2={0} y2={7} stroke={th.ink} strokeWidth={1.4} />
                <rect x={-8} y={-7} width={16} height={9} rx={1.5} fill={b.ours ? th.accent : BILLBOARD}
                  stroke={pop?.key === b.id ? th.ink : th.casing} strokeWidth={pop?.key === b.id ? 1.8 : 1} />
              </g>
            ))}
            {layers.holidays && VENUES.map((v) => (
              <g key={v.id} transform={`translate(${v.x} ${v.y})`} className="atl-bb" onClick={() => openVenue(v)}>
                <circle r={12} fill="transparent" />
                <circle r={9} fill={EVENT_COLOR} opacity={0.25} className="atl-pulse" />
                <circle r={5.5} fill={EVENT_COLOR} stroke={pop?.key === v.id ? th.ink : "#fff"} strokeWidth={1.4} />
              </g>
            ))}
          </svg>

          <div className="atl-brand" aria-label="Aperture Atlas">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mode === "dark" ? "/logo-icon-white.png" : "/logo-icon-black.png"} alt="" />
            <span className="atl-b1">APERTURE</span><span className="atl-b2">ATLAS</span><sup>™</sup>
          </div>

          {pop && (
            <div className="atl-pop" style={{ left: `${(pop.x / W) * 100}%`, top: `${(pop.y / H) * 100}%` }}>
              <div className="atl-pop-h">{pop.title}<button type="button" onClick={() => setPop(null)} aria-label="Close">✕</button></div>
              <dl>
                {pop.rows.map(([k, v, c]) => (
                  <div key={k}><dt>{k}</dt><dd style={c ? { color: c } : undefined}>{v}</dd></div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="atl-fl atl-title">
          <div>
            <div className="atl-eyebrow"><i />Live · {clock || "—"}</div>
            <div className="atl-t">Market Map · The Woodlands, TX</div>
          </div>
          <div className="atl-seg" role="group" aria-label="Map theme">
            {(["dark", "light"] as const).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{m === "dark" ? "Dark" : "Light"}</button>
            ))}
          </div>
        </div>

        <div className="atl-fl atl-kpis">
          {kpis.map((k) => (
            <div key={k.k}><div className="atl-k">{k.k}</div><div className="atl-v">{k.v}{k.d && <em style={{ color: k.d.c }}>{k.d.t}</em>}</div></div>
          ))}
        </div>

        {(layers.weather || layers.holidays) && (
          <div className="atl-side">
            {layers.weather && (
              <div className="atl-fl atl-card">
                <div className="atl-h">Weather · Saturday</div>
                <div className="atl-wx-main">
                  <WxIcon kind={cond.icon} />
                  <span className="atl-wx-t" style={{ color: temp >= 100 ? "#ff8a3d" : undefined }}>{temp}°F</span>
                  <span>{cond.label}<br /><small>Rain {rain}%</small></span>
                </div>
                <div className="atl-wx-i"><span>Sales vs ideal day</span><b style={{ color: impact <= -2 ? th.neg : th.pos }}>{impact > -0.5 ? "±0" : impact.toFixed(0)}%</b></div>
                <div className="atl-wx-n">{wxNote}</div>
              </div>
            )}
            {layers.holidays && (
              <div className="atl-fl atl-card">
                <div className="atl-h">Next holiday</div>
                <div className="atl-hol"><b>{hol.name}</b><span>{hol.when}</span></div>
                <div className="atl-wx-i"><span>Expected lift</span><b style={{ color: th.pos }}>+{holLift.toFixed(0)}%</b></div>
                <div className="atl-wx-n">Book staff and stock gift cards early</div>
              </div>
            )}
          </div>
        )}


        <div className="atl-fl atl-layers">
          {LAYER_GROUPS.map((g) => (
            <div key={g.title} className="atl-grp">
              <div className="atl-h">{g.title}</div>
              {g.items.map((l) => (
                <button key={l.key} type="button" onClick={() => toggle(l.key)} aria-pressed={layers[l.key]}>
                  {l.label}<span className={cn("atl-tg", !layers[l.key] && "off")} />
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="atl-fl atl-legend">
          <b>{layers.income ? "Median income (ACS)" : "Customers per hex"}</b>
          <div className="atl-grad" style={{ background: `linear-gradient(90deg,${(layers.income ? th.income : th.ramp).join(",")})` }} />
          <div className="atl-lh"><span>Low</span><span>High</span></div>
          {legendRows.map((r) => (
            <div key={r.label} className="atl-row"><svg width="12" height="12" aria-hidden>{r.icon}</svg>{r.label}</div>
          ))}
        </div>

        <div className="atl-fl atl-slider">
          <div className="atl-sh">
            <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause playback" : "Play twelve months of growth"}>
              {playing ? "❚❚" : "▶"}
            </button>
            <span>Customer growth</span>
            <span className="atl-m">{MONTHS[month]}</span>
          </div>
          <input type="range" min={0} max={LAST} value={month} aria-label="Month"
            onChange={(e) => { setPlaying(false); setMonth(Number(e.target.value)); }}
            style={{ ["--p" as string]: `${(month / LAST) * 100}%` }} />
          <div className="atl-ts"><span>Sep 25</span><span>Jan 26</span><span>May 26</span><span>Sep 26</span></div>
        </div>

        <div className="atl-attr">Sources: U.S. Census ACS 5-yr, client POS, NOAA, TxDOT AADT, county permits, OOH inventory · illustrative client · model R² {WEEKLY_MODEL.r2.toFixed(2)}</div>
      </div>
      {showAnalysis && <AtlasAnalysis month={month} monthLabel={MONTHS[month]!} temp={temp} rain={rain} holRel={hol.rel} holName={hol.name}
        c={{ ink: th.ink, mu: th.vars["--mu"]!, bd: th.vars["--bd"]!, accent: th.accent, pos: th.pos, neg: th.neg, dot: th.dot }} />}
    </div>
  );
}

const CSS = `
.atl,.atl *{box-sizing:border-box}
.atl{color:var(--tx);background:var(--bg);font-variant-numeric:tabular-nums;transition:background .3s}
.atl-stage{position:relative;aspect-ratio:8/5;overflow:hidden}
.atl-mapwrap{position:absolute;inset:0}
.atl-map{position:absolute;inset:0;width:100%;height:100%;display:block}
.atl-hex{cursor:pointer;transition:fill 1.8s ease}
.atl-hex:hover{fill-opacity:.9}
.atl-bb{cursor:pointer}
.atl circle{transition:opacity 1.4s ease}
.atl-new{animation:atlIn 2s ease-out}
@keyframes atlIn{0%{opacity:0}40%{opacity:1}}
.atl-pulse{animation:atlPulse 2.4s ease-out infinite;transform-origin:center;transform-box:fill-box}
@keyframes atlPulse{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(3.2)}}
.atl-flow{animation:atlFlow 1.2s linear infinite}
@keyframes atlFlow{to{stroke-dashoffset:-22}}
.atl-drift{animation:atlDrift 22s ease-in-out infinite alternate}
@keyframes atlDrift{from{transform:translate(-60px,20px)}to{transform:translate(90px,-25px)}}
.atl-fl{position:absolute;background:var(--pn);border:1px solid var(--bd);border-radius:8px}
.atl-title{top:14px;left:14px;padding:10px 12px 10px 14px;display:flex;align-items:center;gap:16px}
.atl-eyebrow{display:flex;align-items:center;gap:7px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--acc)}
.atl-eyebrow i{width:7px;height:7px;border-radius:50%;background:#2ECC71;animation:atlLive 2s infinite}
@keyframes atlLive{0%{box-shadow:0 0 0 0 rgba(46,204,113,.6)}100%{box-shadow:0 0 0 8px rgba(46,204,113,0)}}
.atl-t{font-size:15px;font-weight:600;margin-top:3px}
.atl-seg{display:flex;border:1px solid var(--bd);border-radius:6px;overflow:hidden}
.atl-seg button{all:unset;cursor:pointer;font-size:11px;font-weight:600;padding:6px 10px;color:var(--mu)}
.atl-seg button[aria-pressed=true]{background:var(--on);color:#fff}
.atl-kpis{top:14px;right:14px;display:flex}
.atl-kpis>div{padding:9px 15px;border-left:1px solid var(--bd)}
.atl-kpis>div:first-child{border:0}
.atl-k{font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.1em}
.atl-v{font-size:19px;font-weight:600;margin-top:2px;white-space:nowrap}
.atl-v em{font-style:normal;font-size:11px;margin-left:5px}
.atl-side{position:absolute;top:86px;right:14px;width:222px;display:flex;flex-direction:column;gap:8px}
.atl-card{position:static;padding:10px 13px;font-size:12px}
.atl-hol{display:flex;justify-content:space-between;align-items:baseline;margin:4px 0 7px}.atl-hol b{font-size:15px}.atl-hol span{color:var(--mu);font-size:11px}
.atl-brand{position:absolute;left:14px;bottom:26px;display:flex;align-items:center;white-space:nowrap;line-height:1;font-size:17px;color:var(--tx);pointer-events:none;text-shadow:0 0 6px var(--bg)}
.atl-brand img{width:44px;height:44px;margin-right:9px}
.atl-b1{font-weight:600;letter-spacing:.06em}
.atl-b2{font-weight:300;letter-spacing:.14em;margin-left:.3em}
.atl-brand sup{font-size:.5em;margin-left:2px;align-self:flex-start;margin-top:12px}
.atl-shimmer{animation:atlShimmer 3s ease-in-out infinite alternate}
@keyframes atlShimmer{from{opacity:.75}to{opacity:1}}
.atl-rainfall{animation:atlRain .45s linear infinite}
@keyframes atlRain{to{transform:translate(-7px,20px)}}
.atl-wx-main{display:flex;align-items:center;gap:10px;margin:4px 0 8px;line-height:1.3}
.atl-wx-main svg{flex:none}
.atl-wx-main small{color:var(--mu);font-size:11px}
.atl-wx-t{font-size:23px;font-weight:600;letter-spacing:-.02em}
.atl-wx-i{display:flex;justify-content:space-between;border-top:1px solid var(--bd);padding-top:7px}
.atl-wx-i span{color:var(--mu)}
.atl-wx-n{color:var(--mu);font-size:11px;margin-top:3px}
.atl-layers{top:86px;left:14px;width:200px;padding:10px 13px}
.atl-grp+.atl-grp{margin-top:8px;padding-top:8px;border-top:1px solid var(--bd)}
.atl-h{font-size:10px;letter-spacing:.14em;color:var(--mu);text-transform:uppercase;margin-bottom:2px}
.atl-layers button{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;width:100%;min-height:27px;font-size:12.5px}
.atl button:focus-visible{outline:2px solid var(--acc);outline-offset:2px;border-radius:4px}
.atl-tg{margin-left:auto;width:26px;height:14px;border-radius:8px;background:var(--on);position:relative;transition:background .2s}
.atl-tg:after{content:"";position:absolute;left:14px;top:2px;width:10px;height:10px;border-radius:50%;background:#fff;transition:left .2s}
.atl-tg.off{background:var(--off)}.atl-tg.off:after{left:2px}
.atl-legend{right:14px;bottom:30px;width:176px;padding:9px 11px;font-size:11px}
.atl-legend b{font-weight:600}
.atl-grad{height:7px;border-radius:2px;margin:6px 0 2px}
.atl-lh{display:flex;justify-content:space-between;color:var(--mu);font-size:10px}
.atl-row{display:flex;align-items:center;gap:7px;margin-top:5px;color:var(--row)}
.atl-slider{left:50%;transform:translateX(-50%);bottom:30px;width:min(440px,40%);padding:9px 15px 8px;font-size:11px;color:var(--mu)}
.atl-sh{display:flex;align-items:center;gap:9px}
.atl-sh button{all:unset;cursor:pointer;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;background:var(--on);color:#fff;font-size:9px}
.atl-m{margin-left:auto;color:var(--tx);font-weight:600}
.atl-slider input{-webkit-appearance:none;appearance:none;width:100%;height:3px;margin:10px 0 7px;border-radius:2px;background:linear-gradient(90deg,var(--acc) var(--p),var(--off) var(--p));cursor:pointer}
.atl-slider input::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;border:1px solid var(--bd)}
.atl-slider input::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:#fff;border:1px solid var(--bd)}
.atl-ts{display:flex;justify-content:space-between;font-size:10px}
.atl-pop{position:absolute;transform:translate(14px,-50%);width:200px;background:var(--pop);border:1px solid var(--bd);border-radius:6px;font-size:11.5px;z-index:2}
.atl-pop-h{display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-bottom:1px solid var(--bd);font-weight:600}
.atl-pop-h button{all:unset;cursor:pointer;color:var(--mu);padding:0 2px}
.atl-pop dl{margin:0;padding:7px 10px}
.atl-pop dl div{display:flex;justify-content:space-between;gap:8px;padding:1.5px 0}
.atl-pop dt{color:var(--mu)}.atl-pop dd{margin:0;text-align:right;font-weight:600}
.atl-attr{position:absolute;left:0;right:0;bottom:0;padding:4px 10px;font-size:9.5px;color:var(--attrtx);background:var(--attr)}
@media (max-width:1080px){
 .atl-stage{aspect-ratio:auto;display:flex;flex-direction:column}
 .atl-mapwrap{position:relative;aspect-ratio:8/5}
 .atl-fl{position:static;transform:none;width:auto;margin:8px 10px 0}
 .atl-title{order:-1;margin-top:10px;justify-content:space-between}
 .atl-side{position:static;width:auto;display:grid;grid-template-columns:1fr 1fr;gap:0}
 .atl-card{margin:8px 10px 0}
 .atl-brand{bottom:8px;left:8px;font-size:11px}.atl-brand img{width:26px;height:26px;margin-right:6px}.atl-brand sup{margin-top:6px}
 .atl-kpis{flex-wrap:wrap}.atl-kpis>div{flex:1 1 45%;border-left:0;border-top:1px solid var(--bd)}
 .atl-kpis>div:nth-child(-n+2){border-top:0}
 .atl-layers{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}
 .atl-grp+.atl-grp{margin-top:0;padding-top:0;border-top:0}
 .atl-layers button{min-height:36px;gap:8px}
 .atl-legend{display:none}
 .atl-attr{position:static;margin-top:10px}
 .atl-pop{transform:translate(-50%,14px);width:180px}
}
@media (max-width:520px){.atl-side{grid-template-columns:1fr}.atl-layers{grid-template-columns:1fr}.atl-t{font-size:14px}}
@media (prefers-reduced-motion:reduce){.atl-pulse,.atl-new,.atl-eyebrow i,.atl-flow,.atl-drift,.atl-shimmer,.atl-rainfall{animation:none}.atl-hex,.atl circle{transition:none}}
`;
