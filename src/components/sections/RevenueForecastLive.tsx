"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A full-width, short "live market indicator" for revenue forecast. A thin white
 * line with peaks and valleys spans the width; a glowing indicator moves at a
 * constant speed left→right carrying a floating revenue value that counts up in
 * green while climbing and down in red while falling. Faint quarter gridlines and
 * milestone markers fade in as the indicator passes. Reduced-motion users get a
 * calm, static forecast.
 */
export function RevenueForecastLive({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const H = 150;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let W = 0;

    const resize = () => {
      W = cv.clientWidth || 900;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const yTop = 58;
    const yBot = 108;
    const GREEN = "#2ECC71";
    const RED = "#E74C3C";
    const WHITE = "rgba(255,255,255,0.90)";
    const perf = (nx: number) => {
      const v =
        0.17 +
        0.6 * nx +
        0.135 * Math.sin(nx * 6.2832 * 2.15 + 0.4) +
        0.075 * Math.sin(nx * 6.2832 * 4.7 + 1.1) +
        0.04 * Math.sin(nx * 6.2832 * 8.9 + 2.2);
      return Math.max(0.05, Math.min(0.95, v));
    };
    const yAt = (nx: number) => yBot - perf(nx) * (yBot - yTop);
    const revAt = (nx: number) => 1.6 + perf(nx) * (2.44 - 1.6);
    const grids = [0.13, 0.27, 0.41, 0.55, 0.69, 0.83, 0.97];
    const gl = ["Q3 '26", "Q4 '26", "Q1 '27", "Q2 '27", "Q3 '27", "Q4 '27", "Q1 '28"];
    const miles = [
      { nx: 0.22, t: "FORECAST REVISION" },
      { nx: 0.45, t: "SEASONAL PEAK" },
      { nx: 0.67, t: "MARKET ADJUSTMENT" },
      { nx: 0.87, t: "EXPANSION" },
    ];

    let p = 0.001;
    let shown = revAt(0.001);
    let raf = 0;

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#16171a";
      ctx.fillRect(0, 0, W, H);
      ctx.textBaseline = "alphabetic";

      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.36)";
      ctx.font = "600 9px -apple-system,system-ui,sans-serif";
      ctx.fillText("R E V E N U E   F O R E C A S T", 16, 20);

      ctx.textAlign = "center";
      ctx.font = "8.5px system-ui";
      grids.forEach((gx, i) => {
        const x = gx * W;
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 30);
        ctx.lineTo(x, H - 20);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.24)";
        ctx.fillText(gl[i]!, x, H - 8);
      });

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      for (let i = 0; i <= 340; i++) {
        const nx = i / 340;
        const x = nx * W;
        const y = yAt(nx);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();

      miles.forEach((m) => {
        const a = Math.max(0, 1 - Math.abs(p - m.nx) / 0.1);
        if (a > 0.01) {
          const x = m.nx * W;
          const y = yAt(m.nx);
          ctx.fillStyle = `rgba(255,255,255,${0.7 * a})`;
          ctx.font = "600 8.5px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(m.t, x, Math.max(30, y - 12));
        }
      });

      const eps = 0.004;
      const slope = perf(Math.min(1, p + eps)) - perf(Math.max(0, p - eps));
      let col = WHITE;
      if (slope > 0.006) col = GREEN;
      else if (slope < -0.006) col = RED;

      const from = Math.max(0, p - 0.14);
      const ix = p * W;
      const iy = yAt(p);
      const grad = ctx.createLinearGradient(from * W, 0, ix, 0);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, col);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const nx = from + (p - from) * (i / 48);
        const x = nx * W;
        const y = yAt(nx);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();

      let edge = 1;
      if (p < 0.02) edge = p / 0.02;
      else if (p > 0.98) edge = (1 - p) / 0.02;

      ctx.save();
      ctx.globalAlpha = edge;
      ctx.shadowColor = col;
      ctx.shadowBlur = 16;
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(ix, iy, 3.3, 0, 7);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ix, iy, 1.3, 0, 7);
      ctx.fill();
      ctx.restore();

      const target = revAt(p);
      shown += (target - shown) * (animate ? 0.16 : 1);
      ctx.save();
      ctx.globalAlpha = edge;
      ctx.textAlign = "center";
      ctx.font = "600 16px -apple-system,system-ui,sans-serif";
      ctx.fillStyle = col;
      const tx = Math.max(40, Math.min(W - 40, ix));
      ctx.fillText("$" + shown.toFixed(2) + "M", tx, Math.max(42, iy - 13));
      ctx.restore();
    };

    const frame = () => {
      draw(true);
      p += 0.00045;
      if (p >= 1) {
        p = 0.001;
        shown = revAt(0.001);
      }
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      p = 0.62;
      shown = revAt(0.62);
      draw(false);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={cn("overflow-hidden rounded-xl border border-white/10", className)}
      style={{ background: "#16171a" }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Live revenue forecast, a projected performance line rising and falling over the coming quarters"
        style={{ display: "block", width: "100%", height: "150px" }}
      />
    </div>
  );
}
