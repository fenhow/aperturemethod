"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { primaryCta } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Bain-style rotating hero: crossfading images and titles.
 * Accessible: labelled carousel, aria-live title region, slide "tabs",
 * a pause/play control, pauses on hover/focus, and — for users who prefer
 * reduced motion — starts paused and never auto-advances (transitions are
 * also neutralised globally). A deliberate, approved exception to the design
 * system's "no autoplay carousel" default.
 */

type Slide = { eyebrow: string; title: string; sub: string; image: string; video?: string };

const slides: Slide[] = [
  {
    eyebrow: "Know your numbers",
    title: "See exactly where you make money.",
    sub: "We turn the data you already have into a clear picture of what's working, what's not, and what to do next.",
    image: "/hero/hero-1-v5.jpg",
  },
  {
    eyebrow: "Know your customers",
    title: "See who your best customers are.",
    sub: "Who's most valuable, who's likely to leave, who's ready to buy more — and where the next customers are.",
    image: "/hero/hero-2d-poster.jpg",
    video: "/hero/hero-2d.mp4",
  },
  {
    eyebrow: "Know where AI fits",
    title: "Put AI to work — without the hype.",
    sub: "Understand it, implement what fits, and use it to hold your edge — with a person in the loop and models that are yours to keep.",
    image: "/hero/hero-4-v8.jpg",
  },
  {
    eyebrow: "Know your business",
    title: "Bring your business into focus.",
    sub: "The MBA-level analytics, AI, and strategy big companies rely on — sized for your business, in plain language, and put to work.",
    image: "/hero/hero-3-v7.jpg",
  },
];

const INTERVAL = 9000;

export function HeroRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const reduceMotion = useRef(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = useCallback((n: number) => {
    setIndex(((n % slides.length) + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reduceMotion.current = r;
    setReduced(r);
    if (r) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused]);

  // Play only the active slide's video; pause the rest to save resources.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index && !paused && !reduced) v.play().catch(() => {});
      else v.pause();
    });
  }, [index, paused, reduced]);

  const current = slides[index]!;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate flex min-h-[86vh] items-end overflow-hidden bg-dark text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => !reduceMotion.current && setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => !reduceMotion.current && setPaused(false)}
    >
      {/* Slides (background image + legibility scrim) */}
      {slides.map((s, i) => (
        <div
          key={s.image}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          {s.video && !reduced ? (
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover"
              poster={s.image}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src={s.video} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        </div>
      ))}

      {/* Prev / next arrows */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="group absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 p-3 text-white/80 backdrop-blur-sm transition-colors duration-fast hover:border-white/40 hover:bg-black/50 hover:text-white md:flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="group absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 p-3 text-white/80 backdrop-blur-sm transition-colors duration-fast hover:border-white/40 hover:bg-black/50 hover:text-white md:flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Foreground content */}
      <Container className="relative z-10 w-full pb-14 pt-36 md:pb-20">
        <div className="max-w-2xl" aria-live="polite" aria-atomic="true">
          <p key={`e${index}`} className="eyebrow eyebrow--on-dark mb-5 animate-fade">
            {current.eyebrow}
          </p>
          <h1 key={`t${index}`} className="text-display font-semibold text-paper animate-fade-up">
            {current.title}
          </h1>
          <p key={`s${index}`} className="mt-6 max-w-xl text-body-lg text-white/75 animate-fade">
            {current.sub}
          </p>
        </div>

        {/* Persistent CTAs */}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link href={primaryCta.href} className="btn--on-dark">
            {primaryCta.label}
          </Link>
          <Link href="/the-aperture-method" className="btn--ghost">
            See how the Method works →
          </Link>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex items-center gap-1 md:hidden" role="group" aria-label="Move between slides">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="rounded-full p-1.5 text-white/70 transition-colors duration-fast hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="rounded-full p-1.5 text-white/70 transition-colors duration-fast hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="flex gap-2" role="group" aria-label="Choose a featured slide">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-current={i === index ? "true" : undefined}
                aria-label={`Show slide ${i + 1} of ${slides.length}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-fast",
                  i === index ? "w-8 bg-maroon-soft" : "w-4 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
          <span className="h-4 w-px bg-white/20" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="text-small font-medium text-white/60 transition-colors duration-fast hover:text-white"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      </Container>
    </section>
  );
}
