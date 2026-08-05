"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive 3D book. Auto-rotates gently, and the visitor can grab and drag it
 * to spin it any direction. Reveals front cover, spine, fore-edge, and the back
 * (photo + excerpt + book details). Honors reduced-motion (no auto-spin, still
 * draggable).
 */
export function Book3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const rot = useRef({ x: 6, y: -20 });
  const s = useRef({ dragging: false, hovering: false, lastX: 0, lastY: 0, reduced: false });

  useEffect(() => {
    s.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let prev = 0;
    const loop = (t: number) => {
      if (!prev) prev = t;
      const dt = t - prev;
      prev = t;
      const st = s.current;
      if (!st.dragging && !st.hovering && !st.reduced) {
        rot.current.y += dt * 0.012;
      }
      if (stageRef.current) {
        stageRef.current.style.transform = `rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e: React.PointerEvent) => {
    s.current.dragging = true;
    s.current.lastX = e.clientX;
    s.current.lastY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!s.current.dragging) return;
    rot.current.y += (e.clientX - s.current.lastX) * 0.5;
    rot.current.x = Math.max(-28, Math.min(28, rot.current.x - (e.clientY - s.current.lastY) * 0.3));
    s.current.lastX = e.clientX;
    s.current.lastY = e.clientY;
  };
  const onUp = () => {
    s.current.dragging = false;
  };

  return (
    <div
      className="book360"
      style={{ cursor: "grab", touchAction: "none" }}
      role="img"
      aria-label="The Aperture Method book — drag to rotate"
      onMouseEnter={() => (s.current.hovering = true)}
      onMouseLeave={() => (s.current.hovering = false)}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="book360__stage" ref={stageRef} style={{ animation: "none" }}>
        {/* Front cover */}
        <div className="book360__face book360__front">
          <div className="book360__glow" aria-hidden="true" />
          <span className="book360__frame" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon-white.png" alt="" className="book360__mark" draggable={false} />
          <p className="book360__eyebrow">A Business Methodology</p>
          <h3 className="book360__title">
            The
            <br />
            Aperture
            <br />
            Method<span className="book360__tm">™</span>
          </h3>
          <span className="book360__rule" aria-hidden="true" />
          <p className="book360__sub">
            Big-company intelligence, built for the businesses everyone else ignores.
          </p>
          <div className="book360__foot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fenwick-signature-black.png" alt="Fenwick How" className="book360__sig" draggable={false} />
          </div>
        </div>

        {/* Back cover */}
        <div className="book360__face book360__back">
          <span className="book360__frame" aria-hidden="true" />
          <p className="book360__kicker">From the book</p>
          <p className="book360__excerpt">
            Big companies don&apos;t outgrow you because they&apos;re smarter — they outgrow you
            because they can <b>see</b>. Their numbers, their customers, their market. Your business
            already has the data; this book is about turning it into decisions.
          </p>
          <div className="book360__backwrap">
            <div className="book360__authorbox">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/fenwick-how.jpg" alt="Fenwick How" className="book360__photo" draggable={false} />
              <div>
                <p className="book360__aname">Fenwick How</p>
                <p className="book360__arole">
                  Executive MBA Student · Mays Business School, Texas A&amp;M University
                </p>
              </div>
            </div>
            <div className="book360__backfoot">
              <div>
                <p className="book360__cat">Business · Strategy</p>
                <p className="book360__imprint">Aperture Press</p>
              </div>
              <div className="book360__bcwrap">
                <div className="book360__barcodebox">
                  <div className="book360__bars" />
                </div>
                <p className="book360__isbn">978-1-9600000-1-2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spine + edges */}
        <div className="book360__face book360__spine" aria-hidden="true">
          <span className="book360__spinetext">The Aperture Method™ · Fenwick How</span>
        </div>
        <div className="book360__face book360__pages" aria-hidden="true" />
        <div className="book360__face book360__top" aria-hidden="true" />
        <div className="book360__face book360__bottom" aria-hidden="true" />
      </div>
    </div>
  );
}
