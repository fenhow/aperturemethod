import { cn } from "@/lib/utils";

/**
 * Abstract, on-brand "Market Map", an editorial illustration of spatial
 * intelligence (GIS): a street grid, drive-time rings, customer clusters, and
 * maroon hot-spots. Decorative (aria-hidden); pair with a caption. `tone="dark"`
 * for dark backgrounds.
 */

// Scattered "customer" points (denser near the hot-spots).
const DOTS = [
  [250, 120], [268, 138], [235, 150], [285, 128], [300, 160], [262, 170],
  [520, 210], [540, 195], [505, 225], [560, 220], [532, 240], [575, 205],
  [180, 250], [640, 120], [660, 140], [120, 180], [700, 250], [430, 90],
  [410, 300], [610, 300], [150, 300], [720, 180],
];

export function MarketMap({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const line = tone === "dark" ? "rgba(255,255,255,0.10)" : "rgba(20,20,20,0.10)";
  const dot = tone === "dark" ? "rgba(255,255,255,0.55)" : "rgba(20,20,20,0.45)";

  return (
    <svg
      viewBox="0 0 800 360"
      role="img"
      aria-label="Illustrative market map showing trade areas, drive-time rings, and customer hot-spots"
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <pattern id="mm-streets" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={line} strokeWidth="1" />
        </pattern>
        <radialGradient id="mm-heat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8c2b2b" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#500000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#500000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* street grid */}
      <rect width="800" height="360" fill="url(#mm-streets)" />
      {/* a couple of diagonal arterials */}
      <path d="M0 300 L800 60" stroke={line} strokeWidth="2" fill="none" />
      <path d="M120 0 L520 360" stroke={line} strokeWidth="2" fill="none" />

      {/* heat hot-spots */}
      <circle cx="278" cy="145" r="130" fill="url(#mm-heat)" />
      <circle cx="540" cy="215" r="110" fill="url(#mm-heat)" />

      {/* drive-time rings around the primary location */}
      {[46, 84, 122].map((r) => (
        <circle
          key={r}
          cx="278"
          cy="145"
          r={r}
          fill="none"
          stroke="#b5544f"
          strokeWidth="1.25"
          strokeDasharray="4 6"
          opacity={0.7 - r / 400}
        />
      ))}

      {/* customer points */}
      {DOTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 3.5 : 2.5} fill={dot} />
      ))}

      {/* primary location pin */}
      <g transform="translate(278 145)">
        <circle r="9" fill="#500000" />
        <circle r="3.5" fill="#fff" />
      </g>
      {/* secondary opportunity pin */}
      <g transform="translate(540 215)">
        <circle r="7" fill="#8c2b2b" />
        <circle r="2.8" fill="#fff" />
      </g>
    </svg>
  );
}
