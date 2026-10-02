"use client";

import { useEffect, useRef } from "react";
import { BOOK_COVER_ART, BOOK_BACK_ART, contributorLine } from "@/lib/book";

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
      aria-label="Look Closer: The Aperture Method book by Fenwick How. Drag to rotate"
      onMouseEnter={() => (s.current.hovering = true)}
      onMouseLeave={() => (s.current.hovering = false)}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="book360__stage" ref={stageRef} style={{ animation: "none" }}>
        {/* Front cover: photo art + live type (co-author names come from lib/book) */}
        <div
          className="book360__face book360__front book360__front--photo"
          style={{ backgroundImage: `url(${BOOK_COVER_ART})` }}
        >
          <div className="book360__shade" aria-hidden="true" />
          <div className="book360__ftype">
            <p className="book360__feyebrow">A Business Methodology</p>
            <h3 className="book360__ftitle">
              Look Closer
            </h3>
            <p className="book360__fmethod">
              The Aperture Method<span className="book360__ftm">™</span>
            </p>
            <p className="book360__fsub">
              Big-company intelligence for owner&#8209;run businesses.
            </p>
            <p className="book360__fauthor">
              <span className="book360__frule" aria-hidden="true" />
              Fenwick How
            </p>
            <p className="book360__fwith">{contributorLine()}</p>
          </div>
        </div>

        {/* Back cover: rendered from the approved Look Closer back-cover design (public/book/back-cover.jpg) */}
        <div
          className="book360__face book360__back book360__back--art"
          style={{ backgroundImage: `url(${BOOK_BACK_ART})` }}
        />

        {/* Spine + edges */}
        <div className="book360__face book360__spine" aria-hidden="true">
          <span className="book360__spinetext">Look Closer · The Aperture Method™ · Fenwick How</span>
        </div>
        <div className="book360__face book360__pages" aria-hidden="true" />
        <div className="book360__face book360__top" aria-hidden="true" />
        <div className="book360__face book360__bottom" aria-hidden="true" />
      </div>
    </div>
  );
}
