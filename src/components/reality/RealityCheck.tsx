"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { primaryCta } from "@/lib/site";
import { MetricExplainer } from "@/components/reality/MetricExplainer";
import { ThankYouRedirect } from "@/components/reality/ThankYouRedirect";
import { StudyIntro, StudyCommit, StudyHelp, StudyCalibrate, StudyProfileForm, StudyThanks, StudyThankYouModal, StudyConfetti, StudyResultsNote, StudyHelpNudge } from "@/components/reality/StudyParts";
import type { StudyProfile } from "@/lib/realityStudy";
import { questions, scoreAnswers, MAX_PER_QUESTION, type RCQuestion, QUESTION_COUNT, APPROX_MINUTES } from "@/lib/realityCheck";

type Stage = "intro" | "commit" | "calibrate" | "quiz" | "profile" | "result";

/** A random id per run, so the study's two pings land on one stored row. */
function newRunId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return "";
  }
}

const STUDY_DONE_KEY = "rc-study-done";

/**
 * mode "site" is the public quiz at /clarity-check. mode "study" is the capstone
 * research version at /clarity-check/study: consent intro, a self-rating before
 * question one, an optional profile after the last, and a thank-you in place of
 * the sales block. The questions and scoring are identical in both.
 */
export function RealityCheck({
  mode = "site",
  studyCount,
}: {
  mode?: "site" | "study";
  studyCount?: number;
} = {}) {
  const study = mode === "study";
  const [stage, setStage] = useState<Stage>("intro");
  const [selfRating, setSelfRating] = useState<number | null>(null);
  /** The two research questions after the result: answered or skipped. */
  const [helpDone, setHelpDone] = useState(false);
  const [thanksOpen, setThanksOpen] = useState(false);
  const closeThanks = useCallback(() => setThanksOpen(false), []);
  const runId = useRef<string>("");
  const startedAt = useRef<number>(0);
  const tags = useRef<{ source?: string; medium?: string; campaign?: string; repeat?: boolean; referrer?: string }>({});

  // Where the visitor came from (UTM or ?src=), and whether this browser has
  // already finished the study once. Both are stored, neither blocks anyone.
  useEffect(() => {
    try {
      const u = new URLSearchParams(window.location.search);
      tags.current = {
        source: u.get("utm_source") ?? u.get("src") ?? undefined,
        medium: u.get("utm_medium") ?? undefined,
        campaign: u.get("utm_campaign") ?? undefined,
        repeat: study ? window.localStorage.getItem(STUDY_DONE_KEY) === "1" : false,
        // The site they arrived from, for the alert email only (not stored).
        referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
      };
    } catch {
      /* storage blocked: fine */
    }
  }, [study]);

  function beginQuiz() {
    if (study) {
      try {
        tags.current.repeat = window.localStorage.getItem(STUDY_DONE_KEY) === "1";
      } catch {
        /* fine */
      }
    }
    runId.current = newRunId();
    startedAt.current = Date.now();
    setStage("quiz");
  }
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  /** Guards the completion ping so one run is only ever recorded once. */
  const reported = useRef(false);

  const result = useMemo(() => scoreAnswers(answers), [answers]);
  const q: RCQuestion = questions[idx]!;
  const progress = Math.round((idx / questions.length) * 100);

  /*
   * Back to the top on every step (Oct 2026): starting, each new question, the
   * profile, and the result. It runs AFTER React has drawn the new screen. The
   * old version scrolled inside the click handler, before the re-render, so on
   * a long page the smooth scroll was cut short and people were left looking
   * at the bottom of a screen they had not read. Instant rather than smooth,
   * because a jump you do not notice beats an animation that can be cut off.
   * Skipped on the very first render so arriving at the page does not jump.
   */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const id = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    return () => cancelAnimationFrame(id);
  }, [stage, idx]);

  function choose(score: number) {
    const next = { ...answers, [q.id]: score };
    setAnswers(next);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
    } else {
      setStage(study ? "profile" : "result");
      reportCompletion(next);
    }
  }

  /*
   * The anonymous completion ping (Oct 2026).
   *
   * Every finished run is recorded: the answers and the score, never a name, an
   * email or a company, because none has been given at this point. The intro
   * says this in plain language before anyone starts. It tells us which
   * questions people cannot answer, which is the only way to know whether these
   * are the right questions.
   *
   * Fire and forget, once per run: it must not delay the result, and a failed
   * ping must never be something the visitor sees. The guard stops a second
   * send when someone goes Back and re-answers the last question.
   */
  function reportCompletion(finalAnswers: Record<string, number>) {
    if (reported.current) return;
    reported.current = true;
    try {
      void fetch("/api/reality-check/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(finalAnswers, "finish")),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* never surfaced */
    }
    if (study) {
      try {
        window.localStorage.setItem(STUDY_DONE_KEY, "1");
      } catch {
        /* fine */
      }
    }
  }

  function payload(finalAnswers: Record<string, number>, stage: "finish" | "profile", profile?: StudyProfile) {
    return {
      answers: finalAnswers,
      runId: runId.current || undefined,
      stage,
      cohort: study ? "study" : "site",
      ...tags.current,
      selfRating: selfRating ?? undefined,
      durationS: startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : undefined,
      profile,
    };
  }

  /** The two research questions (version 3), answered on the result page. */
  function sendHelp(value: { need?: string; help?: string } | null) {
    if (!value || (!value.need && !value.help)) return;
    try {
      void fetch("/api/reality-check/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload(answers, "finish"), stage: "help", need: value.need, help: value.help }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* never surfaced */
    }
  }

  /** The study's second ping: the optional profile, onto the same row. */
  function finishProfile(profile: StudyProfile | null) {
    if (profile && Object.keys(profile).length > 0) {
      try {
        void fetch("/api/reality-check/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload(answers, "profile", profile)),
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* never surfaced */
      }
    }
    setStage("result");
  }

  function restart() {
    reported.current = false;
    setHelpDone(false);
    setThanksOpen(false);
    setAnswers({});
    setIdx(0);
    setSelfRating(null);
    setStage("intro");
  }

  /* ─────────────────────────────── study-only screens */
  if (study && stage === "intro") {
    return <StudyIntro onStart={() => setStage("commit")} count={studyCount} />;
  }
  if (study && stage === "commit") {
    return <StudyCommit onCommit={() => setStage("calibrate")} />;
  }
  if (study && stage === "calibrate") {
    return (
      <StudyCalibrate
        onRate={(n) => {
          setSelfRating(n);
          beginQuiz();
        }}
      />
    );
  }
  if (study && stage === "profile") {
    return <StudyProfileForm onDone={finishProfile} />;
  }

  /* ─────────────────────────────── intro */
  if (stage === "intro") {
    /*
      Wrapper is max-w-3xl so the one-line promise under the headline stays on
      one line on desktop; the headline keeps its own 2xl measure so widening
      the wrapper does not re-wrap it.
    */
    return (
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-4">The Clarity Check</p>
        <h1 className="max-w-2xl text-h1 font-semibold text-ink">
          How well do you actually know your business?
        </h1>
        <p className="mt-5 text-body-lg text-muted">
          {QUESTION_COUNT} questions. About {APPROX_MINUTES} minutes. No email required to see your score.
        </p>

        {/*
          The written breakdown, named before anyone starts, and ABOVE the start
          button (Oct 2026).

          It used to sit below the button as quiet grey text, and people missed
          it twice: once here, because they clicked Start before reading it, and
          again on the results screen, where the form reads as an afterthought.
          Now it is the last thing seen before starting, with the email offer in
          the heading rather than buried in the third sentence.

          Deliberately still NOT a field. "No email required" is why people start
          this thing, and it is promised on the homepage, here, and in the page's
          search description. A box at the gate reads as a gate even when it is
          optional, and it would be asking before anything has been given.
        */}
        <div className="mt-8 max-w-xl rounded-lg border border-line border-l-4 border-l-maroon bg-surface p-5">
          <p className="text-small font-semibold text-ink">
            Want your results emailed to you? You can ask for that at the end.
          </p>
          <p className="mt-2 text-small text-muted">
            Your Clarity Score and your single biggest blind spot appear on screen, free, straight
            away. At the end you can enter your email and we will send the full written breakdown:
            every question with your answer, all {QUESTION_COUNT} underlying measures explained with
            the arithmetic, and a PDF you can keep or hand to whoever does your books.
          </p>
        </div>

        {/*
          The privacy promise, Oct 2026. This was one grey caption at the foot
          of the page and people were missing it: the honest worry about a
          questionnaire like this is "who finds out how I answered", and that
          deserves a straight answer in full view, not small print. Every line
          below is what the code actually does — the stored row carries the
          answers, the score and the timings and nothing else. If that ever
          changes, change this first.
        */}
        <div className="mt-8 max-w-xl rounded-lg border border-line bg-surface p-5">
          <p className="text-small font-semibold text-ink">
            Nothing you answer is attached to you.
          </p>
          <ul className="mt-3 space-y-2 text-small text-muted">
            <li>
              No name, no email, no company, no IP address is stored with your answers. There is no
              account and no sign-in, so there is nothing for an answer to be attached to.
            </li>
            <li>
              What is kept is the answers, the score and how long it took, in one anonymous pile
              with everyone else&rsquo;s. We use it to find out which questions are hard to answer.
            </li>
            <li>
              Nobody is told how you scored &mdash; not your bank, not your accountant, not anyone
              at your company. We could not tell them if we wanted to, because we do not know who
              answered.
            </li>
            <li>
              If you ask for the written breakdown at the end, that is the one place a name and
              email appear. They are used to send it to you, and they are never joined to the
              anonymous record.
            </li>
          </ul>
          <p className="mt-3 text-small text-muted">
            Your answers also stay in your browser while you work through them; nothing is recorded
            until you reach the end.
          </p>
        </div>
        <button
          type="button"
          onClick={beginQuiz}
          className="btn mt-9 w-full justify-center sm:w-auto sm:px-10"
        >
          Start the Clarity Check
        </button>
      </div>
    );
  }

  /* ─────────────────────────────── quiz */
  if (stage === "quiz") {
    return (
      <div className="mx-auto max-w-2xl">
        {/*
          The counter and the area label used to be two spans in a
          justify-between row with no gap between them. On a phone that read as
          "Question 10 ofWhere the return comes 15 from": both wrapped, and the
          wrapped halves interleaved. It only became obvious once the counter
          reached two digits and the area names got longer, but it was always
          one long label away from breaking. The counter can never wrap now,
          the area takes what is left and truncates, and there is a real gap
          between them.
        */}
        <div className="flex items-center justify-between gap-4 text-caption text-muted">
          <span className="shrink-0 whitespace-nowrap">
            Question {idx + 1} of {questions.length}
          </span>
          <span className="min-w-0 truncate text-right">{q.area}</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full bg-maroon transition-all duration-300"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>

        {/* Second reminder of the emailed breakdown, on the way in and on the
            way out, because the intro card is 15 questions behind them by the
            time the form appears. */}
        {/* Midway reassurance (Oct 2026): the point where honest answers
            start to feel uncomfortable is where they most need permission. */}
        {idx === Math.floor(questions.length / 2) ? (
          <p className="mt-4 rounded-md bg-surface px-4 py-3 text-small text-ink">
            Halfway there. Remember, gaps are exactly what this is designed to find, so an honest
            &ldquo;not yet&rdquo; is worth more than a hopeful yes.
          </p>
        ) : null}
        {idx === 0 || idx === questions.length - 1 ? (
          <p className="mt-4 text-caption text-muted">
            {idx === 0
              ? "You can have the full written breakdown emailed to you at the end."
              : "Last one. Your score is next, and you can have the full written breakdown emailed to you."}
          </p>
        ) : null}

        <h2 className="mt-8 text-h3 font-semibold leading-snug text-ink">{q.prompt}</h2>
        {q.note ? <p className="mt-3 text-body text-muted">{q.note}</p> : null}

        {/* The brief explainer. Definition and arithmetic only: see the note in
            MetricExplainer about why the interpretation is withheld until the
            answer is locked. */}
        <div className="mt-4">
          <MetricExplainer explainer={q.explainer} label={q.explainer.metric} />
        </div>

        <div className="mt-7 space-y-3">
          {q.options.map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => choose(o.score)}
              className="w-full rounded-lg border border-line bg-paper px-5 py-4 text-left text-body text-ink transition-all hover:border-maroon hover:shadow-sm"
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => setIdx(Math.max(0, idx - 1))}
            className="text-caption font-semibold text-muted transition-colors hover:text-ink disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={restart}
            className="text-caption text-muted transition-colors hover:text-ink"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────── result */
  const { score, band, gaps, blindSpot } = result;

  return (
    <div className="mx-auto max-w-3xl">
      {study ? <StudyResultsNote done={helpDone} /> : null}
      {study ? <StudyHelpNudge done={helpDone} /> : null}
      <p className="eyebrow mb-4">Your result</p>

      <div className="rounded-lg border border-line bg-surface p-8 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
          <div>
            <div className="text-[76px] font-semibold leading-none tracking-tight text-maroon">
              {score}
            </div>
            <p className="mt-2 text-caption uppercase tracking-overline text-muted">
              Clarity Score out of 100
            </p>
          </div>
          <div className="flex-1">
            <h2 className="text-h3 font-semibold text-ink">{band.name}</h2>
            <p className="mt-2 text-body-lg text-body">{band.verdict}</p>
          </div>
        </div>

        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full bg-maroon" style={{ width: `${Math.max(score, 2)}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-caption text-muted">
          <span>Flying blind</span>
          <span>Running on evidence</span>
        </div>

        <p className="mt-7 text-body text-body">{band.frame}</p>
      </div>

      {/* the gut check */}
      {gaps.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-h4 font-semibold text-ink">
            You could not answer {gaps.length} of {questions.length} with confidence
          </h3>
          <p className="mt-2 text-body text-muted">
            This list is the useful part of the result. Each of these is a question about your own
            business that currently has no evidenced answer.
          </p>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {gaps.map((g) => (
              <li key={g.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-5">
                <span className="shrink-0 text-caption font-semibold uppercase tracking-overline text-maroon sm:w-52">
                  {g.area}
                </span>
                <div className="min-w-0">
                  <span className="text-body text-ink">{g.prompt}</span>
                  {/* Full version here, interpretation included: the answer is
                      locked, and this is the moment the reader most wants to
                      know what the number would have told them. */}
                  <div className="mt-2">
                    <MetricExplainer
                      explainer={g.explainer}
                      withReading
                      label={g.explainer.metric}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-line p-6">
          <h3 className="text-h4 font-semibold text-ink">You answered all {QUESTION_COUNT} with confidence</h3>
          <p className="mt-2 text-body text-muted">
            That is genuinely uncommon. The honest recommendation is not a full engagement; it is a
            conversation about the one or two questions where your evidence is thinnest.
          </p>
        </div>
      )}

      {/* the single named blind spot */}
      {blindSpot ? (
        <div className="mt-10 rounded-lg border-l-4 border-maroon bg-surface p-6 sm:p-8">
          <p className="eyebrow mb-3">Your biggest blind spot</p>
          <h3 className="text-h3 font-semibold text-ink">{blindSpot.blindSpot.headline}</h3>
          <p className="mt-4 text-body text-body">{blindSpot.blindSpot.body}</p>
          <p className="mt-4 text-body font-medium text-ink">{blindSpot.blindSpot.cost}</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-caption text-muted">
              Addressed by <span className="font-semibold text-maroon">{blindSpot.component}</span>
            </p>
            <MetricExplainer
              explainer={blindSpot.explainer}
              withReading
              label={blindSpot.explainer.metric}
            />
          </div>
        </div>
      ) : null}


      {/* Confetti marks the END of the survey (after the last two questions), not
          the score, so nobody mistakes the result page for the finish line. */}
      {study && helpDone ? <StudyConfetti /> : null}
      {study ? <StudyThankYouModal open={thanksOpen} onClose={closeThanks} /> : null}
      {study ? (
        <StudyHelp
          onAnswer={sendHelp}
          onDone={() => {
            setHelpDone(true);
            setTimeout(() => setThanksOpen(true), 600);
          }}
        />
      ) : null}
      {study ? <StudyThanks selfRating={selfRating} score={score} /> : null}

      {/* The breakdown form carries a name and email to Fenwick, so in the
          study it is labelled as separate from the anonymous record. */}
      {study ? (
        <p className="mt-10 -mb-6 text-caption text-muted">
          Optional, and separate from the survey: if you ask for the written breakdown below, it is
          emailed to you and Fenwick receives a copy with your name. Your anonymous survey answers
          are not linked to it.
        </p>
      ) : null}

      {study ? null : (
        <p className="mt-10 -mb-6 text-caption text-muted">
          Optional, and separate from the survey: the breakdown is emailed to you, and Fenwick gets
          a copy so he can answer if you have questions. Your name and email are not joined to the
          anonymous record of your answers.
        </p>
      )}

      <ReportForm score={score} band={band.name} answers={answers} />

      {study ? null : (
      <div className="mt-10 rounded-lg border border-line p-6 sm:p-8">
        <h3 className="text-h4 font-semibold text-ink">What this is, and what it is not</h3>
        <p className="mt-3 text-body text-muted">
          This is a self-assessment. It tells you what you do not currently know. The Business
          X-Ray™ is the diagnostic that answers it, a seven-lens read of the whole business, the
          named constraint with the evidence behind it, and a baseline Aperture Score™ you can
          track. Two to three weeks, fixed fee, senior-led.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={primaryCta.href} className="btn w-full justify-center sm:w-auto sm:px-8">
            {primaryCta.label}
          </Link>
          <Link href="/what-you-get" className="btn--secondary w-full justify-center sm:w-auto sm:px-8">
            See what you get
          </Link>
        </div>
      </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        {study ? <span /> : (
        <button
          type="button"
          onClick={restart}
          className="text-caption font-semibold text-muted transition-colors hover:text-ink"
        >
          Take it again
        </button>
        )}
        <Link href="/who-its-for" className="text-caption font-semibold text-maroon hover:underline">
          See the nine things owners come to us for →
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────── optional emailed report */

function ReportForm({
  score,
  band,
  answers,
}: {
  score: number;
  band: string;
  answers: Record<string, number>;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setState("error");
      setMessage("Please add your name so we know who this is.");
      return;
    }
    setState("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, title, email, website, score, band, answers }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) {
        setState("sent");
      } else {
        setState("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (state === "sent") {
    return (
      <div className="mt-10 rounded-lg border border-line bg-surface p-6 sm:p-8">
        {/* The panel that thanks them and moves them on to Pricing. It renders
            over this block rather than replacing it, so someone who stops the
            redirect still has their confirmation underneath. */}
        <ThankYouRedirect email={email} />
        <h3 className="text-h4 font-semibold text-ink">Sent. Check your inbox.</h3>
        <p className="mt-2 text-body text-muted">
          Your written breakdown is on its way to{" "}
          <span className="font-semibold text-ink">{email}</span>: every question, your answer, and
          what the evidenced version of it looks like.
        </p>
        <p className="mt-3 text-body text-ink">
          <span className="font-semibold">If it is not there in a minute or two, check your spam
          or promotions folder</span>. First-time senders often land there. Marking it &ldquo;not
          spam&rdquo; makes sure the reply comes through too.
        </p>
        <p className="mt-3 text-caption text-muted">
          No sequence, no drip campaign. Reply to it and it comes straight to Fenwick.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 rounded-lg border border-line p-6 sm:p-8">
      {/*
        The pitch, describing what this actually is.

        It used to offer "the long version", which was accurate when the email
        was a recap. It now carries a reference to every measure behind the
        questions plus a branded PDF, and none of that was being said, so the
        ask looked smaller than the thing on offer.
      */}
      <h3 className="text-h4 font-semibold text-ink">
        Want all {QUESTION_COUNT} measures, with your answers, as a PDF?
      </h3>
      <p className="mt-2 text-body text-muted">
        Your score is above and it is yours either way. The written breakdown adds the part worth
        keeping: every question with the answer you gave, then the measure behind it, how it is
        calculated, and what the number tells you once you have it. It arrives as an email and a
        branded PDF the moment you hit send. No sequence, no drip campaign.
      </p>
      <p className="mt-3 text-small">
        <a
          href="/clarity-check/sample-report"
          target="_blank"
          rel="noopener"
          className="font-semibold text-maroon underline underline-offset-2 hover:no-underline"
        >
          See the sample report
        </a>{" "}
        <span className="text-muted">(PDF, example answers)</span>
      </p>

      <div className="mt-5 space-y-3">
        <div>
          <label htmlFor="rc-name" className="sr-only">
            Your name
          </label>
          <input
            id="rc-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name *"
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition focus:border-maroon"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="rc-company" className="sr-only">
            Company
          </label>
          <input
            id="rc-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company (optional)"
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition focus:border-maroon"
          />
          <label htmlFor="rc-title" className="sr-only">
            Title
          </label>
          <input
            id="rc-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition focus:border-maroon"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="rc-email" className="sr-only">
            Email address
          </label>
          <input
            id="rc-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com *"
            className="w-full rounded-md border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition focus:border-maroon"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="btn w-full shrink-0 justify-center sm:w-auto sm:px-8"
          >
            {state === "sending" ? "Sending…" : "Send it"}
          </button>
        </div>
      </div>

      {/* honeypot */}
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
  );
}
