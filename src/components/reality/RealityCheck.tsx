"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { primaryCta } from "@/lib/site";
import {
  questions,
  scoreAnswers,
  MAX_PER_QUESTION,
  type RCQuestion,
} from "@/lib/realityCheck";

type Stage = "intro" | "quiz" | "result";

export function RealityCheck() {
  const [stage, setStage] = useState<Stage>("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const result = useMemo(() => scoreAnswers(answers), [answers]);
  const q: RCQuestion = questions[idx]!;
  const progress = Math.round((idx / questions.length) * 100);

  function choose(score: number) {
    const next = { ...answers, [q.id]: score };
    setAnswers(next);
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStage("result");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function restart() {
    setAnswers({});
    setIdx(0);
    setStage("intro");
  }

  /* ─────────────────────────────── intro */
  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow mb-4">The Reality Check</p>
        <h1 className="text-h1 font-semibold text-ink">
          How well do you actually know your business?
        </h1>
        <p className="mt-5 text-body-lg text-muted">
          Ten questions. About three minutes. No email required to see your score.
        </p>

        <div className="mt-8 rounded-lg border border-line bg-surface p-6">
          <p className="text-body text-ink">
            A warning before you start: these questions are designed so you cannot bluff them. Each
            one asks for a number, a name, or a timeframe. If the honest answer is{" "}
            <span className="font-semibold">I would have to look it up</span>, that is a real
            answer — and it is the one worth knowing.
          </p>
          <p className="mt-4 text-body text-ink">
            This measures how well you <span className="font-semibold">know</span> your business,
            not how <span className="font-semibold">good</span> your business is. Plenty of
            excellent companies score badly here. That is the point.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStage("quiz")}
          className="btn mt-8 w-full justify-center sm:w-auto sm:px-10"
        >
          Start the Reality Check
        </button>

        <p className="mt-6 text-caption text-muted">
          Your answers stay in your browser. Nothing is sent anywhere unless you ask us to email
          you the full breakdown at the end.
        </p>
      </div>
    );
  }

  /* ─────────────────────────────── quiz */
  if (stage === "quiz") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between text-caption text-muted">
          <span>
            Question {idx + 1} of {questions.length}
          </span>
          <span>{q.area}</span>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full bg-maroon transition-all duration-300"
            style={{ width: `${Math.max(progress, 4)}%` }}
          />
        </div>

        <h2 className="mt-8 text-h3 font-semibold leading-snug text-ink">{q.prompt}</h2>
        {q.note ? <p className="mt-3 text-body text-muted">{q.note}</p> : null}

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
                <span className="text-body text-ink">{g.prompt}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-line p-6">
          <h3 className="text-h4 font-semibold text-ink">You answered all ten with confidence</h3>
          <p className="mt-2 text-body text-muted">
            That is genuinely uncommon. The honest recommendation is not a full engagement — it is a
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
          <p className="mt-5 text-caption text-muted">
            Addressed by <span className="font-semibold text-maroon">{blindSpot.component}</span>
          </p>
        </div>
      ) : null}

      <ReportForm score={score} band={band.name} answers={answers} />

      <div className="mt-10 rounded-lg border border-line p-6 sm:p-8">
        <h3 className="text-h4 font-semibold text-ink">What this is, and what it is not</h3>
        <p className="mt-3 text-body text-muted">
          This is a self-assessment. It tells you what you do not currently know. The Business
          X-Ray™ is the diagnostic that answers it — a seven-lens read of the whole business, the
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

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={restart}
          className="text-caption font-semibold text-muted transition-colors hover:text-ink"
        >
          Take it again
        </button>
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
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/reality-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, score, band, answers }),
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
        <h3 className="text-h4 font-semibold text-ink">Sent. Check your inbox.</h3>
        <p className="mt-2 text-body text-muted">
          Your written breakdown is on its way to{" "}
          <span className="font-semibold text-ink">{email}</span> — every question, your answer, and
          what the evidenced version of it looks like.
        </p>
        <p className="mt-3 text-body text-ink">
          <span className="font-semibold">If it is not there in a minute or two, check your spam
          or promotions folder</span> — first-time senders often land there. Marking it &ldquo;not
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
      <h3 className="text-h4 font-semibold text-ink">Want the written breakdown?</h3>
      <p className="mt-2 text-body text-muted">
        Your score is above and it is yours either way. If you want the long version — every
        question, your answer, and what the evidenced version looks like — we will email it to you
        the moment you hit send. No sequence, no drip campaign.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="rc-email" className="sr-only">
          Email address
        </label>
        <input
          id="rc-email"
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
          {state === "sending" ? "Sending…" : "Send it"}
        </button>
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
