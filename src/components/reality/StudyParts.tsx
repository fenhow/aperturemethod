"use client";

/**
 * The research-study pieces of the Reality Check (Oct 2026). Used only when
 * <RealityCheck mode="study" /> runs at /reality-check/study. The quiz itself is
 * shared with the public page so both measure exactly the same thing.
 *
 * Wording rule for the Texas A&M line: it is a statement about Fenwick, not the
 * firm, and never implies the university endorses or runs the study.
 */

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import {
  studyFields,
  STUDY_TARGET,
  STUDY_COUNT_FLOOR,
  type StudyProfile,
  type StudyFieldId,
} from "@/lib/realityStudy";
import { QUESTION_COUNT, APPROX_MINUTES } from "@/lib/realityCheck";

/* ─────────────────────────────── intro + consent */

export function StudyIntro({ onStart, count }: { onStart: () => void; count?: number }) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="eyebrow mb-4">Research study · The Reality Check</p>
      <h1 className="max-w-2xl text-h1 font-semibold text-ink">
        How well do owners really know their own businesses?
      </h1>
      <p className="mt-5 text-body-lg text-muted">
        I am putting that question to {STUDY_TARGET} owner-run businesses. It takes about{" "}
        {APPROX_MINUTES + 1} minutes and it is anonymous. You see your own Clarity Score and your
        biggest blind spot the moment you finish.
      </p>

      {typeof count === "number" && count >= STUDY_COUNT_FLOOR ? (
        <p className="mt-4 text-small font-semibold text-maroon">
          {count} owners have taken part so far. The goal is {STUDY_TARGET}.
        </p>
      ) : null}

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
        <p className="mt-4 text-caption text-muted">
          Questions about the study:{" "}
          <a href={`mailto:${siteConfig.email}`} className="font-semibold text-maroon hover:underline">
            {siteConfig.email}
          </a>
          . Fenwick How, The Aperture Method.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="btn mt-9 w-full justify-center sm:w-auto sm:px-10"
      >
        I agree. Start
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
        On a scale of 1 to 10, how well do you know the numbers behind your business?
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

  function pick(id: StudyFieldId, value: string) {
    setProfile((p) => ({ ...p, [id]: p[id] === value ? undefined : value }));
  }

  function submit() {
    const out: StudyProfile = { ...profile };
    if (/^\d{3}$/.test(zip3)) out.zip3 = zip3;
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
        {studyFields.map((f) => (
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
    const url = `${window.location.origin}/reality-check/study?src=share`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div className="mt-10 rounded-lg border border-line bg-surface p-6 sm:p-8">
      <p className="eyebrow mb-3">Thank you</p>
      <h3 className="text-h4 font-semibold text-ink">Your answers are now part of the study.</h3>
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
            See how your score compares with every business in the study. Your email is stored on
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
          The study needs {STUDY_TARGET} businesses. Passing the link on is the biggest help.
        </p>
        <button type="button" onClick={copyLink} className="btn--secondary mt-4 w-full justify-center sm:w-auto sm:px-8">
          {copied ? "Link copied" : "Copy the study link"}
        </button>
      </div>
    </div>
  );
}
