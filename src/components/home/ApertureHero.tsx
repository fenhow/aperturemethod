"use client";

import { QUESTION_COUNT, APPROX_MINUTES } from "@/lib/realityCheck";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * Aperture parent-brand hero: a rotating, Bain-style hero. Slide 1 carries the
 * parent positioning (what the firm actually analyses, in plain words); the remaining
 * slides are the original homepage slides (numbers, customers, AI). Same
 * construction/quality as the site's HeroRotator; accessible (labeled carousel,
 * aria-live title, pause/play, pauses on hover/focus, reduced-motion aware).
 */

type Slide = {
  eyebrow: string;
  title: string;
  sub: string;
  image: string;
  video?: string;
  /**
   * CSS object-position for the photo. Only needed when the subject is off
   * center: the hero crops every image to fill the frame, and a subject near
   * one edge gets cut. Defaults to center.
   */
  position?: string;
};

const slides: Slide[] = [
  {
    eyebrow: "Enterprise-level analytics, AI & strategy for owner-run businesses",
    title: "Big-company intelligence, built for your business.",
    sub: "We bring the financial, customer, market, and competitive analysis used by large companies to owner-run businesses: uncovering what's driving performance, where opportunities are being missed, and where to focus next.",
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
  {
    /* The five phases as the eyebrow, and the banner's own line as the
       headline. The photo is a wide 2.7:1 panorama with the peak at the far
       right, so it is anchored right of center: at the default center crop a
       laptop loses the summit and a phone shows only sky. The bright sky on
       the left sits under the hero's existing left-to-right black gradient,
       which is what keeps the white headline readable. */
    eyebrow: "Understand · Quantify · Reveal · Navigate · Perform",
    title: "Higher perspective. Greater opportunity.",
    sub: "See the whole business from above, and the way forward gets obvious: clearer insights, stronger decisions, better results.",
    image: "/hero/hero-5-mountain.jpg",
    position: "72% center",
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
            <Image
              src={s.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={s.position ? { objectPosition: s.position } : undefined}
            />
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
      {/* Top padding trimmed (md was pt-36) to pull the call to action back
          above the fold on a standard laptop. The sticky header already
          reserves its own height above this section, so this padding is pure
          breathing room and 112px is still generous. */}
      <Container className="relative z-10 w-full pb-14 pt-24 md:pb-20 md:pt-28">
        {/*
          Wider text column from lg up.

          At max-w-2xl the headline broke onto THREE lines on a 1440 desktop
          (672px of text in a 1440px viewport), and with the promise line added
          below the lede that pushed "Take the Reality Check" past the bottom of
          an 800px laptop viewport: the hero's only call to action, invisible
          without scrolling. Letting the column run to 3xl at lg takes the
          headline to two lines at its full 72px, which is ~90px back. The
          measured width of "Big-company intelligence," at that size is 859px,
          so 4xl (896px) is the first step that fits it; 3xl (768px) was tried
          and still broke to three lines. The lede and the promise line keep
          their own narrower caps so the reading measure stays sane. Phones
          and tablets are untouched.
        */}
        <div className="max-w-2xl lg:max-w-4xl" aria-live="polite" aria-atomic="true">
          <p key={`e${index}`} className="eyebrow eyebrow--on-dark mb-5 animate-fade">
            {current.eyebrow}
          </p>
          <h1 key={`t${index}`} className="text-h1 font-semibold text-paper animate-fade-up md:text-display">
            {current.title}
          </h1>
          <p key={`s${index}`} className="mt-6 max-w-xl text-body-lg text-white/75 animate-fade lg:max-w-2xl">
            {current.sub}
          </p>
        </div>

        {/*
          The promise, stated once.

          Deliberately NOT a link, and deliberately without the arrow it was
          drafted with. The GDP line directly below it is already the one thing
          in this hero a reader can click through to check, and two arrowed
          lines stacked on top of each other read as two competing offers rather
          than a claim followed by its evidence. This asserts; the line under it
          proves. Sits outside the slide wrapper because it is true of all four
          slides and should not re-animate every nine seconds.
        */}
        <p className="mt-5 max-w-xl text-body-lg font-semibold text-paper lg:max-w-2xl">
          Your business deserves the same intelligence as the companies 100&times; your size.
        </p>

        {/*
          Button and its qualifier on one line from sm up.

          Stacked, the caption cost 45px of vertical space to say something that
          belongs next to the button anyway: it is the answer to "what am I
          committing to", and it reads better beside the verb than under it. On
          a phone it still stacks, because the two together are wider than the
          screen.
        */}
        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link href="/reality-check" className="btn--on-dark">
            Take the Reality Check
          </Link>
          <p className="text-caption text-white/55">
            {QUESTION_COUNT} questions · about {APPROX_MINUTES} minutes · no email required
          </p>
        </div>


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
