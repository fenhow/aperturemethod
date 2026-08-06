"use client";

import { useEffect, useRef, useState } from "react";
import type { SignaturePayload } from "@/lib/onboarding/types";

const tabCls = (active: boolean) =>
  "rounded-sm border px-4 py-2 text-small font-semibold transition-colors " +
  (active ? "border-ink bg-ink text-paper" : "border-line text-body hover:border-ink");

export function SignaturePad({
  value,
  onChange,
  error,
}: {
  value: SignaturePayload | null;
  onChange: (v: SignaturePayload | null) => void;
  error?: string;
}) {
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typed, setTyped] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // (Re)prime the canvas whenever we switch into draw mode.
  useEffect(() => {
    if (mode !== "draw") return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1a1a1a";
  }, [mode]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  }
  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    drawing.current = true;
    last.current = pos(e);
    canvasRef.current?.setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    hasInk.current = true;
  }
  function up() {
    if (!drawing.current) return;
    drawing.current = false;
    if (hasInk.current && canvasRef.current) {
      onChange({ type: "draw", data: canvasRef.current.toDataURL("image/png") });
    }
  }
  function clear() {
    const c = canvasRef.current;
    if (c) c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    hasInk.current = false;
    setTyped("");
    onChange(null);
  }
  function switchMode(m: "draw" | "type") {
    setMode(m);
    onChange(null);
    hasInk.current = false;
    if (m === "draw") setTyped("");
  }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button type="button" className={tabCls(mode === "draw")} onClick={() => switchMode("draw")}>
          Draw
        </button>
        <button type="button" className={tabCls(mode === "type")} onClick={() => switchMode("type")}>
          Type
        </button>
        <button
          type="button"
          onClick={clear}
          className="ml-auto rounded-sm border border-line px-4 py-2 text-small font-semibold text-muted transition-colors hover:border-ink hover:text-ink"
        >
          Clear
        </button>
      </div>

      {mode === "draw" ? (
        <canvas
          ref={canvasRef}
          width={600}
          height={160}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
          className={
            "h-40 w-full touch-none rounded-sm border bg-paper " +
            (error ? "border-maroon" : "border-line")
          }
          aria-label="Signature drawing area"
        />
      ) : (
        <div>
          <input
            type="text"
            value={typed}
            onChange={(e) => {
              setTyped(e.target.value);
              onChange(e.target.value.trim() ? { type: "type", data: e.target.value.trim() } : null);
            }}
            placeholder="Type your full name"
            className={
              "block w-full rounded-sm border bg-paper px-4 py-3 text-[16px] transition-colors focus:border-ink focus:outline-none " +
              (error ? "border-maroon" : "border-line")
            }
          />
          <div
            className="mt-2 flex h-20 items-center rounded-sm border border-line bg-surface px-4 text-3xl text-ink"
            style={{ fontFamily: "'Segoe Script','Brush Script MT',cursive", fontStyle: "italic" }}
            aria-hidden="true"
          >
            {typed || <span className="text-muted/50">Signature preview</span>}
          </div>
        </div>
      )}

      <p className="mt-2 text-small text-muted">
        {mode === "draw" ? "Sign with your mouse, trackpad, or finger." : "Your typed name becomes your signature."}
      </p>
      {error && <p className="mt-1 text-small font-medium text-maroon">{error}</p>}
    </div>
  );
}
