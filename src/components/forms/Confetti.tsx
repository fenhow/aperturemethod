"use client";

import { useEffect, useRef } from "react";

/**
 * A short burst of confetti, drawn on a canvas. No dependency, no DOM churn:
 * one <canvas> that unmounts itself when the burst is over.
 *
 * Two cannons fire inward from the bottom corners and a handful of pieces drift
 * down from above, which reads as celebration rather than as weather.
 *
 * Respects prefers-reduced-motion: anyone who has asked their system for less
 * movement gets nothing at all, and the thank-you message still does the work.
 */

const COLORS = ["#500000", "#8c2b2b", "#b5544f", "#c9756c", "#141414", "#c9a227", "#e6e6e6"];

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  life: number;
};

export function Confetti({ fire, onDone }: { fire: boolean; onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!fire) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      onDone?.();
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    // noUncheckedIndexedAccess: the index is always in range, say so once.
    const pickColor = (): string => COLORS[Math.floor(Math.random() * COLORS.length)]!;
    const pieces: Piece[] = [];

    const cannon = (originX: number, angle: number, count: number) => {
      for (let i = 0; i < count; i += 1) {
        const a = angle + rand(-0.42, 0.42);
        const speed = rand(11, 20);
        pieces.push({
          x: originX,
          y: h + 10,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          w: rand(6, 11),
          h: rand(9, 16),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.3, 0.3),
          color: pickColor(),
          life: 1,
        });
      }
    };

    // Up and inward from each bottom corner.
    cannon(w * 0.08, -Math.PI / 2 + 0.5, 70);
    cannon(w * 0.92, -Math.PI / 2 - 0.5, 70);
    // A little falls from above, so the top of the screen is not empty.
    for (let i = 0; i < 40; i += 1) {
      pieces.push({
        x: rand(0, w),
        y: rand(-h * 0.4, -10),
        vx: rand(-1.6, 1.6),
        vy: rand(2, 5),
        w: rand(5, 10),
        h: rand(8, 14),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.2, 0.2),
        color: pickColor(),
        life: 1,
      });
    }

    const GRAVITY = 0.34;
    const DRAG = 0.986;
    let settled = 0;

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of pieces) {
        p.vy += GRAVITY;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h * 0.72) p.life -= 0.016;
        if (p.life <= 0) continue;
        alive += 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        // A thin rectangle, squashed by its own spin: cheap foil-fleck look.
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot)) + 1);
        ctx.restore();
      }
      if (alive === 0) {
        settled += 1;
        if (settled > 2) {
          ctx.clearRect(0, 0, w, h);
          onDone?.();
          return;
        }
      }
      raf.current = window.requestAnimationFrame(frame);
    };
    raf.current = window.requestAnimationFrame(frame);

    return () => {
      if (raf.current !== null) window.cancelAnimationFrame(raf.current);
    };
    // onDone is a stable callback from the caller; the burst is keyed on `fire`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fire]);

  if (!fire) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95]"
    />
  );
}
