/**
 * @illustrative-figures: every number in this component is demonstration data for the
 * fictional client Lumina Medical Aesthetics, not Aperture fees or real market data.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Aperture Atlas "Market Map": a map-first dashboard in the style of an ArcGIS
 * Experience Builder app. Hex-binned customer density, drive-time bands,
 * competitors and an ACS income layer sit on a dark canvas basemap, with
 * floating panels (title, KPI row, layer list, time slider).
 *  - The time slider plays twelve months of growth: customers appear, density
 *    deepens, penetration climbs and new competitors open.
 *  - Layers toggle for real; clicking a hex opens a popup with its figures.
 *  - Reduced-motion users start paused on the latest month.
 * The map is drawn in an 800×500 viewBox with preserveAspectRatio "meet" inside
 * an 8:5 box, so HTML overlays can be placed in exact percentages.
 */

const W = 800;
const H = 500;
const STORE = { x: 330, y: 235 };
const HOT = [
  { x: 330, y: 235, s: 95, w: 1 },
  { x: 575, y: 315, s: 70, w: 0.65 },
  { x: 470, y: 130, s: 55, w: 0.4 },
];
const MONTHS = ["Sep 25", "Oct", "Nov", "Dec", "Jan 26", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep 26"];
const LAST = MONTHS.length - 1;
const RAMP = ["#2a1214", "#5c1a1f", "#8c2b2b", "#b5544f", "#e8a598"];
const INCOME_RAMP = ["#121820", "#1b2a3a", "#26405a", "#35597c"];
const ACCENT = "#c9756c";
const GREEN = "#2ECC71";
const COMPETITORS = [
  { x: 520, y: 210, m: 0, name: "Northside Medspa" },
  { x: 610, y: 360, m: 0, name: "Riverstone Skin" },
  { x: 250, y: 330, m: 0, name: "Cedar Laser Studio" },
  { x: 700, y: 250, m: 0, name: "Market St. Aesthetics" },
  { x: 190, y: 190, m: 0, name: "Creekside Wellness" },
  { x: 430, y: 90, m: 5, name: "Glow Aesthetics Co." },
  { x: 400, y: 285, m: 9, name: "Pure Face Bar" },
];
const LAYERS = [
  { key: "density", label: "Customer density" },
  { key: "drive", label: "Drive-time bands" },
  { key: "customers", label: "Customers" },
  { key: "competitors", label: "Competitors" },
  { key: "income", label: "Income (ACS)" },
] as const;
type LayerKey = (typeof LAYERS)[number]["key"];

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

const MAJOR = [
  "M-10 150 C200 170 380 120 820 200",
  "M360 -10 C340 150 390 330 330 520",
  "M-10 330 C250 300 500 360 820 280",
  "M650 -10 C600 150 700 330 620 520",
];
const SHIELDS: [string, number, number][] = [["I-45", 352, 60], ["SH 242", 120, 158], ["Woodlands Pkwy", 560, 322]];
const PLACES: [string, number, number][] = [["THE WOODLANDS", 250, 290], ["SPRING", 520, 470], ["OAK RIDGE N.", 560, 60], ["CREEKSIDE", 90, 250]];

export function AtlasMarketMap({ className }: { className?: string }) {
  const geo = useMemo(buildGeometry, []);
  const [month, setMonth] = useState(LAST);
  const [playing, setPlaying] = useState(false);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    density: true, drive: true, customers: true, competitors: true, income: false,
  });
  const [sel, setSel] = useState<Hex | null>(null);
  const [clock, setClock] = useState("");

  // Start the growth playback for motion-tolerant visitors; tick the live clock.
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
    if (!playing || sel) return;
    const id = window.setTimeout(() => setMonth((m) => (m >= LAST ? 0 : m + 1)), month >= LAST ? 3200 : 1100);
    return () => window.clearTimeout(id);
  }, [playing, month, sel]);

  const growth = 0.55 + (0.45 * month) / LAST;
  const penetration = 3.9 + month * 0.21;
  const customers = Math.round(1900 + month * 105);
  const compOpen = COMPETITORS.filter((c) => c.m <= month);
  const compNew = compOpen.filter((c) => c.m > 0).length;
  const toggle = (k: LayerKey) => setLayers((l) => ({ ...l, [k]: !l[k] }));

  const kpis = [
    { k: "Households", v: "48.2k", d: null },
    { k: "Customers", v: customers.toLocaleString("en-US"), d: null },
    { k: "Penetration", v: `${penetration.toFixed(1)}%`, d: month ? { t: `▲${(month * 0.21).toFixed(1)}`, c: GREEN } : null },
    { k: "Competitors", v: String(compOpen.length), d: compNew ? { t: `▲${compNew}`, c: "#ff6b5e" } : null },
  ];

  const selCustomers = sel ? Math.round(sel.hh * (0.03 + 0.1 * sel.v) * growth) : 0;

  return (
    <div className={cn("atl", className)}>
      <style>{CSS}</style>
      <div className="atl-stage">
        <div className="atl-mapwrap">
        <svg className="atl-map" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img"
          aria-label="Illustrative Aperture Atlas market map of The Woodlands, Texas, showing customer density by hexagon, drive-time bands and competitor locations">
          <rect width={W} height={H} fill="#0f0f11" />
          {layers.income && geo.tracts.map((t) => (
            <rect key={`${t.x}-${t.y}`} x={t.x} y={t.y} width={80} height={72} fill={ramp(INCOME_RAMP, t.v)} stroke="#0f0f11" strokeWidth={1.5} />
          ))}
          <rect x={120} y={60} width={90} height={60} rx={14} fill="#0e130f" />
          <rect x={640} y={150} width={110} height={70} rx={16} fill="#0e130f" />
          <path d="M-20 420 C150 380 250 480 420 440 S700 390 820 450 L820 520 L-20 520Z" fill="#0c161d" />
          <path d="M430 440 C460 380 520 360 540 300 S600 220 640 180" fill="none" stroke="#0c161d" strokeWidth={5} />
          <g transform="rotate(-9 400 250)" stroke="#1a1a1d" strokeWidth={0.9}>
            {geo.minorX.map((x) => <line key={`x${x}`} x1={x} y1={-200} x2={x} y2={700} />)}
            {geo.minorY.map((y) => <line key={`y${y}`} x1={-200} y1={y} x2={1000} y2={y} />)}
          </g>
          {MAJOR.map((d, i) => (
            <g key={d} fill="none">
              <path d={d} stroke="#08080a" strokeWidth={i === 1 ? 7 : 5} />
              <path d={d} stroke="#2a2a2e" strokeWidth={i === 1 ? 4.5 : 3} />
            </g>
          ))}
          {layers.density && geo.hexes.map((h) => (
            <polygon key={h.id} points={h.pts} fill={ramp(RAMP, ((h.v - 0.1) / 0.95) * growth)} fillOpacity={0.6}
              stroke={sel?.id === h.id ? "#fff" : "#0f0f11"} strokeWidth={sel?.id === h.id ? 2 : 1}
              className="atl-hex" onClick={() => setSel(sel?.id === h.id ? null : h)} />
          ))}
          {layers.drive && geo.rings.map((g) => (
            <g key={g.label} pointerEvents="none">
              <polygon points={g.pts} fill="none" stroke={ACCENT} strokeWidth={1.3} strokeDasharray={g.dashed ? "5 4" : undefined} opacity={0.85} />
              <text x={g.lx} y={g.ly} fontSize={10} fontWeight={600} fill={ACCENT} stroke="#0f0f11" strokeWidth={3} paintOrder="stroke">{g.label}</text>
            </g>
          ))}
          {layers.customers && (
            <g pointerEvents="none">
              {geo.customers.map((c, i) => (
                <circle key={i} cx={f1(c.x)} cy={f1(c.y)} r={1.8} fill="#e6e6e6"
                  className={c.m === month && month > 0 ? "atl-new" : undefined} opacity={c.m <= month ? 0.75 : 0} />
              ))}
            </g>
          )}
          {layers.competitors && compOpen.map((c) => (
            <g key={c.name} pointerEvents="none" className={c.m === month && month > 0 ? "atl-new" : undefined}>
              <rect x={c.x - 5} y={c.y - 5} width={10} height={10} transform={`rotate(45 ${c.x} ${c.y})`} fill="#0f0f11" stroke="#f2f2f2" strokeWidth={1.6} />
            </g>
          ))}
          <g pointerEvents="none">
            <circle cx={STORE.x} cy={STORE.y} r={9} fill={ACCENT} className="atl-pulse" />
            <circle cx={STORE.x} cy={STORE.y} r={7} fill={ACCENT} stroke="#fff" strokeWidth={2} />
            {SHIELDS.map(([n, x, y]) => (
              <g key={n}>
                <rect x={x - n.length * 3.3 - 5} y={y - 8} width={n.length * 6.6 + 10} height={15} rx={3} fill="#28282c" stroke="#08080a" />
                <text x={x} y={y + 3} fontSize={9.5} textAnchor="middle" fill="#f2f2f2" fontWeight={600}>{n}</text>
              </g>
            ))}
            {PLACES.map(([n, x, y]) => (
              <text key={n} x={x} y={y} fontSize={11} letterSpacing={2.5} fill="#8a8a90" stroke="#0f0f11" strokeWidth={3} paintOrder="stroke" fontWeight={600}>{n}</text>
            ))}
          </g>
        </svg>

        {sel && (
          <div className="atl-pop" style={{ left: `${(sel.cx / W) * 100}%`, top: `${(sel.cy / H) * 100}%` }}>
            <div className="atl-pop-h">Hex {sel.id}<button type="button" onClick={() => setSel(null)} aria-label="Close">✕</button></div>
            <dl>
              <dt>Households</dt><dd>{sel.hh.toLocaleString("en-US")}</dd>
              <dt>Customers</dt><dd>{selCustomers}</dd>
              <dt>Penetration</dt><dd style={{ color: GREEN }}>{((selCustomers / sel.hh) * 100).toFixed(1)}%</dd>
              <dt>Median income</dt><dd>${sel.inc}k</dd>
            </dl>
          </div>
        )}
        </div>

        <div className="atl-fl atl-title">
          <div className="atl-eyebrow"><i />Live · {clock || "—"}</div>
          <div className="atl-t">Market Map · The Woodlands, TX</div>
        </div>

        <div className="atl-fl atl-kpis">
          {kpis.map((k) => (
            <div key={k.k}><div className="atl-k">{k.k}</div><div className="atl-v">{k.v}{k.d && <em style={{ color: k.d.c }}>{k.d.t}</em>}</div></div>
          ))}
        </div>

        <div className="atl-fl atl-layers">
          <div className="atl-h">Layers</div>
          {LAYERS.map((l) => (
            <button key={l.key} type="button" onClick={() => toggle(l.key)} aria-pressed={layers[l.key]}>
              {l.label}<span className={cn("atl-tg", !layers[l.key] && "off")} />
            </button>
          ))}
        </div>

        <div className="atl-fl atl-legend">
          <b>{layers.income ? "Median income (ACS)" : "Customers per hex"}</b>
          <div className="atl-grad" style={{ background: `linear-gradient(90deg,${(layers.income ? INCOME_RAMP : RAMP).join(",")})` }} />
          <div className="atl-lh"><span>Low</span><span>High</span></div>
          <div className="atl-row"><svg width="12" height="12" aria-hidden><circle cx="6" cy="6" r="4.5" fill={ACCENT} stroke="#fff" strokeWidth="1.5" /></svg>Client location</div>
          <div className="atl-row"><svg width="12" height="12" aria-hidden><rect x="2.5" y="2.5" width="7" height="7" transform="rotate(45 6 6)" fill="none" stroke="#f2f2f2" strokeWidth="1.5" /></svg>Competitor</div>
          <div className="atl-row"><svg width="22" height="6" aria-hidden><line x1="0" y1="3" x2="22" y2="3" stroke={ACCENT} strokeDasharray="4 3" strokeWidth="1.5" /></svg>Drive-time band</div>
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

        <div className="atl-attr">Sources: U.S. Census ACS 5-yr, client POS, foot-traffic panel · illustrative client</div>
      </div>
    </div>
  );
}

const CSS = `
.atl,.atl *{box-sizing:border-box}
.atl{--bd:#2a2a2e;--pn:rgba(18,18,20,.86);--mu:#8b8b92;color:#f2f2f2;background:#0f0f11;font-variant-numeric:tabular-nums}
.atl-stage{position:relative;aspect-ratio:8/5;overflow:hidden}
.atl-mapwrap{position:absolute;inset:0}
.atl-map{position:absolute;inset:0;width:100%;height:100%;display:block}
.atl-hex{cursor:pointer;transition:fill .9s ease}
.atl-hex:hover{fill-opacity:.9}
.atl circle{transition:opacity .6s ease}
.atl-new{animation:atlIn 1s ease-out}
@keyframes atlIn{0%{opacity:0}40%{opacity:1}}
.atl-pulse{animation:atlPulse 2.4s ease-out infinite;transform-origin:center;transform-box:fill-box}
@keyframes atlPulse{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(3.2)}}
.atl-fl{position:absolute;background:var(--pn);border:1px solid var(--bd);border-radius:8px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.atl-title{top:14px;left:14px;padding:10px 14px}
.atl-eyebrow{display:flex;align-items:center;gap:7px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${ACCENT}}
.atl-eyebrow i{width:7px;height:7px;border-radius:50%;background:${GREEN};animation:atlLive 2s infinite}
@keyframes atlLive{0%{box-shadow:0 0 0 0 rgba(46,204,113,.6)}100%{box-shadow:0 0 0 8px rgba(46,204,113,0)}}
.atl-t{font-size:15px;font-weight:600;margin-top:3px}
.atl-kpis{top:14px;right:14px;display:flex}
.atl-kpis>div{padding:9px 15px;border-left:1px solid var(--bd)}
.atl-kpis>div:first-child{border:0}
.atl-k{font-size:10px;color:var(--mu);text-transform:uppercase;letter-spacing:.1em}
.atl-v{font-size:19px;font-weight:600;margin-top:2px;white-space:nowrap}
.atl-v em{font-style:normal;font-size:11px;margin-left:5px}
.atl-layers{top:92px;left:14px;width:196px;padding:11px 13px}
.atl-h{font-size:10px;letter-spacing:.14em;color:var(--mu);text-transform:uppercase;margin-bottom:4px}
.atl-layers button{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;width:100%;min-height:30px;font-size:12.5px}
.atl-layers button:focus-visible,.atl-sh button:focus-visible{outline:2px solid ${ACCENT};outline-offset:2px;border-radius:4px}
.atl-tg{margin-left:auto;width:26px;height:14px;border-radius:8px;background:#8c2b2b;position:relative;transition:background .2s}
.atl-tg:after{content:"";position:absolute;left:14px;top:2px;width:10px;height:10px;border-radius:50%;background:#fff;transition:left .2s}
.atl-tg.off{background:#333}.atl-tg.off:after{left:2px}
.atl-legend{left:14px;bottom:30px;width:176px;padding:9px 11px;font-size:11px}
.atl-legend b{font-weight:600}
.atl-grad{height:7px;border-radius:2px;margin:6px 0 2px}
.atl-lh{display:flex;justify-content:space-between;color:var(--mu);font-size:10px}
.atl-row{display:flex;align-items:center;gap:7px;margin-top:5px;color:#b8b8be}
.atl-slider{left:50%;transform:translateX(-50%);bottom:30px;width:min(480px,46%);padding:9px 15px 8px;font-size:11px;color:var(--mu)}
.atl-sh{display:flex;align-items:center;gap:9px}
.atl-sh button{all:unset;cursor:pointer;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;background:#8c2b2b;color:#fff;font-size:9px}
.atl-m{margin-left:auto;color:#f2f2f2;font-weight:600}
.atl-slider input{-webkit-appearance:none;appearance:none;width:100%;height:3px;margin:10px 0 7px;border-radius:2px;background:linear-gradient(90deg,${ACCENT} var(--p),#333 var(--p));cursor:pointer}
.atl-slider input::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;border:0}
.atl-slider input::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:#fff;border:0}
.atl-ts{display:flex;justify-content:space-between;font-size:10px}
.atl-pop{position:absolute;transform:translate(14px,-50%);width:184px;background:#141416;border:1px solid var(--bd);border-radius:6px;font-size:11.5px;box-shadow:0 8px 24px rgba(0,0,0,.5);z-index:2}
.atl-pop-h{display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-bottom:1px solid var(--bd);font-weight:600}
.atl-pop-h button{all:unset;cursor:pointer;color:var(--mu);padding:0 2px}
.atl-pop dl{margin:0;padding:7px 10px;display:grid;grid-template-columns:1fr auto;gap:3px 8px}
.atl-pop dt{color:var(--mu)}.atl-pop dd{margin:0;text-align:right;font-weight:600}
.atl-attr{position:absolute;left:0;right:0;bottom:0;padding:4px 10px;font-size:9.5px;color:#6f6f76;background:rgba(10,10,11,.8)}
@media (max-width:900px){
 .atl-stage{aspect-ratio:auto;display:flex;flex-direction:column}
 .atl-mapwrap{position:relative;aspect-ratio:8/5}
 .atl-fl{position:static;transform:none;width:auto;margin:8px 10px 0;backdrop-filter:none}
 .atl-title{order:-1;margin-top:10px}
 .atl-kpis{flex-wrap:wrap}.atl-kpis>div{flex:1 1 45%;border-left:0;border-top:1px solid var(--bd)}
 .atl-kpis>div:nth-child(-n+2){border-top:0}
 .atl-layers{display:flex;flex-wrap:wrap;gap:0 16px}.atl-layers .atl-h{width:100%}.atl-layers button{width:auto;min-height:36px;gap:8px}
 .atl-legend{display:none}
 .atl-attr{position:static;margin-top:10px}
 .atl-pop{transform:translate(-50%,14px);width:170px}
}
@media (prefers-reduced-motion:reduce){.atl-pulse,.atl-new,.atl-eyebrow i{animation:none}.atl-hex,.atl circle{transition:none}}
`;
