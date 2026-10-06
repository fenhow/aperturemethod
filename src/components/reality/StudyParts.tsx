"use client";

/**
 * The research-study pieces of the Clarity Check (Oct 2026). Used only when
 * <RealityCheck mode="study" /> runs at /clarity-check/study. The quiz itself is
 * shared with the public page so both measure exactly the same thing.
 *
 * Wording rule for the Texas A&M line: it is a statement about Fenwick, not the
 * firm, and never implies the university endorses or runs the study.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  heardFromOptions,
  studyFields,
  STUDY_TARGET,
  STUDY_COUNT_FLOOR,
  type StudyProfile,
  type StudyFieldId,
} from "@/lib/realityStudy";
import { QUESTION_COUNT, APPROX_MINUTES } from "@/lib/realityCheck";

/** Questions about the survey go straight to Fenwick (Oct 2026). */
const STUDY_CONTACT = "fen@aperturemethod.com";

/* ─────────────────────────────── intro + consent */

export function StudyIntro({ onStart, count }: { onStart: () => void; count?: number }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow mb-4">Executive MBA Capstone Research · The Clarity Check</p>
      <h1 className="max-w-2xl text-h1 font-semibold text-ink">
        How well do owners really know their own businesses?
      </h1>
      <p className="mt-5 text-body-lg text-muted">
        I am putting that question to {STUDY_TARGET} owner-run businesses in a short survey. It
        takes about {APPROX_MINUTES + 1} minutes and it is anonymous. You see your own Clarity Score
        and your biggest blind spot the moment you finish.
      </p>

      {typeof count === "number" && count >= STUDY_COUNT_FLOOR ? (
        <p className="mt-4 text-small font-semibold text-maroon">
          {count} owners have taken part so far. The goal is {STUDY_TARGET}.
        </p>
      ) : null}

      {/* Permission to not know, without a norm (Oct 2026). The first version
          said "most owners can't answer half of these", which told people what
          result to expect and could pull answers down to match it. This keeps
          the honesty cue and drops the anchor. */}
      <p className="mt-5 max-w-2xl text-body font-semibold text-ink">
        Every business tracks different things, so answer with what you know today. There are no
        wrong answers here, only honest ones.
      </p>

      <div className="mt-8 max-w-2xl rounded-lg border border-line border-l-4 border-l-maroon bg-surface p-5 sm:p-6">
        <p className="text-small font-semibold text-ink">Before you start</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-small text-muted">
          <li>
            One question on how well you think you know your business, then {QUESTION_COUNT}{" "}
            questions, then a few optional questions about the business: size, industry, region.
            Any of those can be skipped.
          </li>
          <li>
            <span className="font-semibold text-ink">Your answers are anonymous.</span> No name,
            email, company or address is collected with them, and results are only ever reported
            as totals across all businesses, never one at a time.
          </li>
          <li>
            The research supports the capstone project for my Executive MBA at Texas A&amp;M, and a
            benchmark report that every participant can have for free.
          </li>
          <li>
            Taking part is voluntary. Nothing is recorded until you finish the {QUESTION_COUNT}{" "}
            questions, so you can stop at any point.
          </li>
          <li>For owners and senior managers of operating businesses, 18 or over.</li>
        </ul>
        <div className="mt-5 border-t border-line pt-4 text-caption text-muted">
          <p className="whitespace-nowrap font-semibold text-ink">Fenwick How &middot; The Aperture Method</p>
          <p className="mt-1">
            Questions about the survey:{" "}
            <a href={`mailto:${STUDY_CONTACT}`} className="font-semibold text-maroon hover:underline">
              {STUDY_CONTACT}
            </a>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="btn mt-9 w-full justify-center sm:w-auto sm:px-10"
      >
        I agree. Start the survey
      </button>
    </div>
  );
}

/* ─────────────────────────────── the honesty commitment */

/**
 * One tap before the first question (Oct 2026). A small commitment made at the
 * START reduces over-reporting more than a reminder at the end, and it sets
 * the standard every answer is held to: what you could show today.
 */
export function StudyCommit({ onCommit }: { onCommit: () => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-caption text-muted">Before you begin</p>
      <h2 className="mt-6 text-h3 font-semibold leading-snug text-ink">One small promise to yourself</h2>
      <p className="mt-3 text-body text-muted">
        The result is only useful if it is real. Nobody will see your answers with your name on
        them, so there is nothing to gain by rounding up.
      </p>
      <button
        type="button"
        onClick={onCommit}
        className="mt-8 w-full rounded-lg border-2 border-maroon bg-paper px-6 py-5 text-left transition-colors hover:bg-surface"
      >
        <span className="block text-body font-semibold text-ink">
          &ldquo;I&rsquo;ll answer based on what I could show today, not what I could find by next
          week.&rdquo;
        </span>
        <span className="mt-2 block text-small font-semibold text-maroon">Agreed, let&rsquo;s start &rarr;</span>
      </button>
    </div>
  );
}

/* ─────────────────────────────── self-rating, asked BEFORE question one */

export function StudyCalibrate({ onRate }: { onRate: (n: number) => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-caption text-muted">Before the first question</p>
      <h2 className="mt-6 text-h3 font-semibold leading-snug text-ink">
        On a scale of 1 to 10, how well do you know your business?
      </h2>
      <p className="mt-3 text-body text-muted">Go with your first instinct.</p>
      <div className="mt-7 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onRate(n)}
            className="rounded-lg border border-line bg-paper py-4 text-center text-body font-semibold text-ink transition-all hover:border-maroon hover:shadow-sm"
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-caption text-muted">
        <span>1 · mostly guesswork</span>
        <span>10 · could evidence anything</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────── optional profile, AFTER the last question */

export function StudyProfileForm({ onDone }: { onDone: (p: StudyProfile | null) => void }) {
  const [profile, setProfile] = useState<StudyProfile>({});
  const [zip3, setZip3] = useState("");
  const [heard, setHeard] = useState("");

  function pick(id: StudyFieldId, value: string) {
    setProfile((p) => ({ ...p, [id]: p[id] === value ? undefined : value }));
  }

  function submit() {
    const out: StudyProfile = { ...profile };
    if (/^\d{3}$/.test(zip3)) out.zip3 = zip3;
    if (heard) out.heard_from = heard;
    onDone(out);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-caption text-muted">Last step. Your score is next.</p>
      <h2 className="mt-6 text-h3 font-semibold leading-snug text-ink">
        A few quick questions about the business
      </h2>
      <p className="mt-3 text-body text-muted">
        All optional. They let your answers be compared with businesses like yours, and none of
        them identifies you.
      </p>

      <div className="mt-8 space-y-8">
        <div>
          <label htmlFor="rc-heard" className="text-body font-semibold text-ink">
            How did you hear about this survey?
          </label>
          <select
            id="rc-heard"
            value={heard}
            onChange={(e) => setHeard(e.target.value)}
            className="mt-3 block w-full max-w-sm rounded-md border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition focus:border-maroon"
          >
            <option value="">Choose one (optional)</option>
            {heardFromOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {studyFields.filter((f) => f.inProfile !== false).map((f) => (
          <fieldset key={f.id}>
            <legend className="text-body font-semibold text-ink">{f.prompt}</legend>
            {f.why ? <p className="mt-1 text-caption text-muted">{f.why}</p> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {f.options.map((o) => {
                const on = profile[f.id] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pick(f.id, o.value)}
                    className={`rounded-full border px-4 py-2 text-small transition-colors ${
                      on
                        ? "border-maroon bg-maroon text-white"
                        : "border-line bg-paper text-ink hover:border-maroon"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div>
          <label htmlFor="rc-zip3" className="text-body font-semibold text-ink">
            First three digits of your ZIP code
          </label>
          <p className="mt-1 text-caption text-muted">
            Three digits cover a whole region, so this cannot locate you. US only.
          </p>
          <input
            id="rc-zip3"
            inputMode="numeric"
            maxLength={3}
            value={zip3}
            onChange={(e) => setZip3(e.target.value.replace(/\D/g, "").slice(0, 3))}
            placeholder="773"
            className="mt-3 w-28 rounded-md border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition focus:border-maroon"
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" onClick={submit} className="btn w-full justify-center sm:w-auto sm:px-10">
          See my score
        </button>
        <button
          type="button"
          onClick={() => onDone(null)}
          className="text-caption font-semibold text-muted transition-colors hover:text-ink"
        >
          Skip these and see my score
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────── the result-page thank-you */

export function StudyThanks({ selfRating, score }: { selfRating: number | null; score: number }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/reality-check/study-optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) setState("sent");
      else {
        setState("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  async function copyLink() {
    const url = `${window.location.origin}/study`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div id="study-thanks" className="mt-10 scroll-mt-28 rounded-lg border border-line bg-surface p-6 sm:p-8">
      <p className="eyebrow mb-3">Thank you</p>
      <h3 className="text-h4 font-semibold text-ink">Your answers are now part of the research.</h3>
      {selfRating ? (
        <p className="mt-3 text-body text-body">
          Before you started you rated yourself <span className="font-semibold">{selfRating} out of 10</span>.
          Your Clarity Score is <span className="font-semibold">{score} out of 100</span>. How far
          apart those two numbers sit, across every owner who takes part, is one of the things this
          research measures.
        </p>
      ) : null}

      {state === "sent" ? (
        <p className="mt-5 text-body font-semibold text-ink">
          Done. The benchmark report will come to {email} when it is published, and nothing else
          will.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6">
          <label htmlFor="rc-optin" className="text-body font-semibold text-ink">
            Want the benchmark report when it is published?
          </label>
          <p className="mt-1 text-caption text-muted">
            See how your score compares with every business that took part. Your email is stored on
            its own, with no link to your answers.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="rc-optin"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition focus:border-maroon"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="btn w-full shrink-0 justify-center sm:w-auto sm:px-8"
            >
              {state === "sending" ? "Saving…" : "Send it to me"}
            </button>
          </div>
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />
          {message ? (
            <p className="mt-3 text-caption text-maroon" role="alert">
              {message}
            </p>
          ) : null}
        </form>
      )}

      <div className="mt-8 border-t border-line pt-6">
        <p className="text-body font-semibold text-ink">Know another owner who would take it?</p>
        <p className="mt-1 text-caption text-muted">
          The survey needs {STUDY_TARGET} businesses. Passing the link on is the biggest help.
        </p>
        <button type="button" onClick={copyLink} className="btn--secondary mt-4 w-full justify-center sm:w-auto sm:px-8">
          {copied ? "Link copied" : "Copy the survey link"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────── the completion pop-up */

/**
 * Shown once, a moment after the result appears (Oct 2026). Thanks the
 * participant first, then offers the next steps without pushing: their
 * results (the default), the benchmark report, and the site for anyone who
 * wants to know more. Closes on the button, Escape, or a click outside.
 */
export function StudyThankYouModal() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const toReport = () => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById("study-thanks")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("rc-optin")?.focus({ preventScroll: true });
    }, 50);
  };

  const links = [
    { href: "/", label: "Explore The Aperture Method", note: "What the firm does for owner-run businesses" },
    { href: "/the-aperture-method", label: "See how the Method works", note: "Five phases, from diagnosis to results" },
    { href: "/contact#book", label: "Talk with Fenwick", note: "A no-pressure 30-minute conversation" },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[130] flex items-end justify-center bg-ink/50 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-ty-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-lg bg-paper p-7 shadow-xl outline-none sm:rounded-lg sm:p-9"
      >
        <p className="eyebrow mb-3">Thank you</p>
        <h2 id="study-ty-title" className="text-h3 font-semibold leading-snug text-ink">
          Your answers are in. Thank you for taking part.
        </h2>
        <p className="mt-3 text-body text-muted">
          Every response brings the research closer to {STUDY_TARGET} businesses and makes the findings
          stronger. Your Clarity Score and biggest blind spot are waiting for you now.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => setOpen(false)} className="btn w-full justify-center sm:w-auto sm:px-8">
            See my results
          </button>
          <button type="button" onClick={toReport} className="btn--secondary w-full justify-center sm:w-auto sm:px-6">
            Get the free benchmark report
          </button>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-small font-semibold text-ink">Want to know more?</p>
          <ul className="mt-3 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-baseline justify-between gap-4 rounded-md px-2 py-2 -mx-2 transition-colors hover:bg-surface"
                >
                  <span>
                    <span className="block text-body font-semibold text-maroon">{l.label}</span>
                    <span className="block text-caption text-muted">{l.note}</span>
                  </span>
                  <span aria-hidden="true" className="text-maroon transition-transform group-hover:translate-x-0.5">&rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-caption text-muted">Fenwick How &middot; fen@aperturemethod.com</p>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────── completion confetti */

/**
 * A short burst of confetti when the study is finished (Oct 2026).
 * Plain canvas, no library. Brand colours only. Runs about four seconds,
 * never blocks clicks (pointer-events: none), and is skipped entirely for
 * anyone who has asked their system to reduce motion.
 */
const CONFETTI_COLORS = ["#500000", "#8c2b2b", "#c9756c", "#e8c9c4", "#ffffff", "#1a1a1a"];

export function StudyConfetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const count = W() < 640 ? 110 : 180;
    type P = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; w: number; h: number; c: string; tilt: number };
    const parts: P[] = [];
    for (let i = 0; i < count; i++) {
      // Two cannons from the lower corners, angled up and inwards.
      const left = i % 2 === 0;
      const angle = (left ? -60 : -120) + (Math.random() * 30 - 15);
      const speed = 16 + Math.random() * 10;
      parts.push({
        x: left ? -10 : W() + 10,
        y: H() * 0.85,
        vx: Math.cos((angle * Math.PI) / 180) * speed,
        vy: Math.sin((angle * Math.PI) / 180) * speed,
        r: 0,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        c: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
        tilt: Math.random() * Math.PI,
      });
    }

    const start = performance.now();
    const DURATION = 4200;
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W(), H());
      const fade = t > DURATION - 900 ? Math.max(0, (DURATION - t) / 900) : 1;
      for (const p of parts) {
        p.vy += 0.22; // gravity
        p.vx *= 0.982; // air
        p.vy *= 0.982;
        if (p.vy > 3.2) p.vy = 3.2; // flutter down slowly rather than drop
        p.vx += Math.sin(p.tilt) * 0.08; // a little sideways drift
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.tilt += 0.12;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.tilt)); // the flutter
        ctx.fillStyle = p.c;
        if (p.c === "#ffffff") {
          ctx.strokeStyle = "#e4e2df";
          ctx.lineWidth = 0.6;
          ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (t < DURATION) raf = requestAnimationFrame(tick);
      else setDone(true);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (done) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[140] h-full w-full"
    />
  );
}

/* ─────────────────────────────── two research questions, after the result */

/**
 * Version 3 follow-ups (6 Oct 2026), replacing the price question. About help
 * in general, not our service: no brand, no price, no email, and the two
 * independent-review options sit among the real alternatives. Optional;
 * answering either question, or skipping, closes it.
 */
export function StudyHelp({ onAnswer }: { onAnswer: (value: { need?: string; help?: string } | null) => void }) {
  const need = studyFields.find((f) => f.id === "need")!;
  const help = studyFields.find((f) => f.id === "help")!;
  const [picked, setPicked] = useState<{ need?: string; help?: string }>({});
  const [done, setDone] = useState<"answered" | "skipped" | null>(null);

  if (done) {
    return done === "answered" ? (
      <p className="mt-10 rounded-lg border border-line px-6 py-4 text-small text-muted">
        Thank you. Your answers are recorded anonymously and help the research.
      </p>
    ) : null;
  }

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-2 text-left text-small transition-colors ${
      on ? "border-maroon bg-maroon text-white" : "border-line bg-paper text-ink hover:border-maroon"
    }`;

  return (
    <div className="mt-10 rounded-lg border border-line p-6 sm:p-8">
      <p className="eyebrow mb-3">Two quick research questions</p>
      <p className="text-caption text-muted">Nobody will contact you about your answers.</p>

      {[need, help].map((field, i) => (
        <div key={field.id} className="mt-6">
          <p className="text-body font-semibold text-ink">
            {i + 1}. {field.prompt}
          </p>
          <div className={`mt-3 flex gap-2 ${field.id === "need" ? "flex-wrap" : "flex-col items-start"}`}>
            {field.options.map((o) => {
              const on = picked[field.id as "need" | "help"] === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked((p) => ({ ...p, [field.id]: o.value }))}
                  className={chip(on)}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={!picked.need && !picked.help}
          onClick={() => {
            onAnswer(picked);
            setDone("answered");
          }}
          className="btn justify-center px-8 disabled:opacity-40"
        >
          Submit answers
        </button>
        <button
          type="button"
          onClick={() => {
            onAnswer(null);
            setDone("skipped");
          }}
          className="text-caption font-semibold text-muted transition-colors hover:text-ink"
        >
          Skip these questions
        </button>
      </div>
    </div>
  );
}
