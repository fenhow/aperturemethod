"use client";

import Image from "next/image";
import Link from "next/link";
import { FIGURES } from "@/lib/marketContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * Aperture parent-brand hero: a rotating, Bain-style hero. Slide 1 carries the
 * parent positioning ("Your fractional intelligence department"); the remaining
 * slides are the original homepage slides (numbers, customers, AI). Same
 * construction/quality as the site's HeroRotator; accessible (labelled carousel,
 * aria-live title, pause/play, pauses on hover/focus, reduced-motion aware).
 */

type Slide = { eyebrow: string; title: string; sub: string; image: string; video?: string };

const slides: Slide[] = [
  {
    eyebrow: "Analytics, AI & strategy for owner-run businesses",
    title: "Big-company intelligence, built for your business.",
    sub: "Your fractional intelligence department: the business and marketing intelligence big companies rely on, right-sized for owner-run businesses, in plain language, and done for you.",
    image: "/hero/hero-3-v7.jpg",
  },
  {
    eyebrow: "Know your numbers",
    title: "See exactly where you make money.",
    sub: "We turn the data you already have into a clear picture of what's working, what's not, and what to do next.",
    image: "/hero/hero-1-v5.jpg",
  },
  {
    eyebrow: "Know your customers",
    title: "See who your best customers are.",
    sub: "Who's most valuable, who's likely to leave, who's ready to buy more, and where the next customers are.",
    image: "/hero/hero-2d-poster.jpg",
    video: "/hero/hero-2d.mp4",
  },
  {
    eyebrow: "Know where AI fits",
    title: "Put AI to work, without the hype.",
    sub: "Understand it, implement what fits, and use it to hold your edge, with a person in the loop and models that are yours to keep.",
    image: "/hero/hero-4-v9.jpg",
  },
];

const INTERVAL = 9000;
/**
 * Slide 1 is the anchor: it is the only slide that says what the company IS,
 * so it holds longer on first view and the auto-rotation never cycles back to
 * it. The other three rotate beneath it as proof of range. A visitor can never
 * land on "AI" as their first impression of the business.
 */
const ANCHOR_INTERVAL = 15000;

export function ApertureHero() {
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
    const id = window.setTimeout(
      () => setIndex((i) => (i >= slides.length - 1 ? 1 : i + 1)),
      index === 0 ? ANCHOR_INTERVAL : INTERVAL,
    );
    return () => window.clearTimeout(id);
  }, [paused, index]);

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
      className="relative isolate flex min-h-[38rem] items-end overflow-hidden bg-dark text-paper md:min-h-[86vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => !reduceMotion.current && setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => !reduceMotion.current && setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.image + i}
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
            <Image src={s.image} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
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
      <Container className="relative z-10 w-full pb-14 pt-28 md:pb-20 md:pt-36">
        <div className="max-w-2xl" aria-live="polite" aria-atomic="true">
          <p key={`e${index}`} className="eyebrow eyebrow--on-dark mb-5 animate-fade">
            {current.eyebrow}
          </p>
          <h1 key={`t${index}`} className="text-h1 font-semibold text-paper animate-fade-up md:text-display">
            {current.title}
          </h1>
          <p key={`s${index}`} className="mt-6 max-w-xl text-body-lg text-white/75 animate-fade">
            {current.sub}
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link href="/reality-check" className="btn--on-dark">
            Take the Reality Check
          </Link>
          <Link href="#method" className="btn--ghost">
            Explore the five practices →
          </Link>
        </div>
        <p className="mt-4 text-caption text-white/55">
          11 questions · about 3 minutes · no email required
        </p>

        {/*
          The market case, as a third action.

          Deliberately not a third button of equal weight. Two primary calls to
          action already compete here, and a third would make all three quieter.
          This carries the figure instead, which is what makes it worth clicking:
          a number a reader can check does more work than another verb.
        */}
        <Link
          href="/the-intelligence-gap"
          className="group mt-6 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-white/25 px-5 py-2.5 text-small text-white/80 transition-colors hover:border-white/70 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="font-semibold text-paper">
            {FIGURES.shareOfGdp.value} of US GDP
          </span>
          <span>comes from small business. See why that matters.</span>
          <span
            className="transition-transform duration-fast group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            &rarr;
          </span>
        </Link>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex gap-2" role="group" aria-label="Choose a featured slide">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-current={i === index ? "true" : undefined}
                aria-label={`Show slide ${i + 1} of ${slides.length}`}
                onClick={() => goTo(i)}
                className={cn(
                  // The bar stays 6px tall; the pseudo-element widens the touch
                  // target to 46px, comfortably over the 44px minimum, so a
                  // thumb can hit it without hitting the one beside it.
                  "relative h-1.5 rounded-full transition-all duration-fast",
                  "before:absolute before:-inset-x-1 before:-inset-y-5 before:content-['']",
                  i === index ? "w-8 bg-maroon-soft" : "w-4 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
          <span className="h-4 w-px bg-white/20" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            // Padded out to a 44px touch target, pulled back with negative
            // margin so the visual position does not move.
            className="-my-2.5 -mx-2 px-2 py-2.5 text-small font-medium text-white/60 transition-colors duration-fast hover:text-white"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      </Container>
    </section>
  );
}
