"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";

type Win = { title: string; body: string; tag: string; questions: string[] };

const wins: Win[] = [
  {
    title: "Know exactly where you stand",
    body: "An honest, outside read of the whole business — and the single thing holding it back.",
    tag: "Business X-Ray™",
    questions: [
      "Can you name the single biggest constraint holding your business back right now?",
      "Do you have an objective, outside read on how the business runs — or only your own view?",
      "If you asked your top three people “what's our #1 problem,” would they all say the same thing?",
      "Do you know which parts of the business are strong vs. fragile — with evidence, not gut?",
      "Do you know how your key ratios — margin, growth, efficiency — compare to industry benchmarks?",
      "Have you scored your business against where it needs to be to grow?",
    ],
  },
  {
    title: "Find your real profit",
    body: "Cut past revenue to the truth: what makes money and what quietly loses it — by product, customer, channel, and location.",
    tag: "Aperture Analytics™",
    questions: [
      "Do you know your profit by product or service line — not just total revenue?",
      "Do you know which customers or segments actually make you money vs. cost you money?",
      "Do you know your EBITDA — cash earnings before financing and accounting effects — and how your margins compare to your industry?",
      "Do you know your contribution margin, and how a price change would ripple through to profit?",
      "Has your pricing kept pace with your costs over the last 12 months?",
      "Could you say, in dollars, what your single biggest profit opportunity is?",
    ],
  },
  {
    title: "Understand your customers",
    body: "See who's most valuable, who's about to leave, and who's ready to buy more.",
    tag: "Aperture Intelligence™",
    questions: [
      "Do you know who your most valuable customers are — by lifetime value, not just size?",
      "Do you know your cost to acquire a customer against that lifetime value (your LTV:CAC ratio)?",
      "Can you tell which customers are likely to leave before they actually do?",
      "Do you track retention by cohort — whether newer customers stick better or worse than older ones?",
      "Do you know which customers are ready to buy more right now?",
      "Is your marketing spend aimed at your best segments, or spread evenly?",
    ],
  },
  {
    title: "Map your market",
    body: "Demand, competitors, and the white space around you — on a real map, not a hunch.",
    tag: "Intelligence · GIS",
    questions: [
      "Do you know where demand for what you sell is concentrated — on a map?",
      "Do you know where your competitors are, and just as important, where they aren't?",
      "Can you see the underserved “white space” around you?",
      "Could you forecast demand by area, rather than react to it once it shows up?",
      "If you opened a new location, could you rank the best sites with data?",
      "Do you know your true trade area — how far customers travel to reach you?",
    ],
  },
  {
    title: "Take market share",
    body: "Find the openings your competitors are missing, and the plan to win them.",
    tag: "Aperture Compass™",
    questions: [
      "Do you know where your competitors are weakest?",
      "Do you know your share of wallet — how much of your best customers' total spend you actually capture?",
      "Can you name the specific openings in your market you could win?",
      "Do you know where your competitive moat is strongest — and where it's starting to erode?",
      "Do you have a prioritized plan to take share — or just a list of ideas?",
      "Would your team agree on the top three growth priorities?",
    ],
  },
  {
    title: "Plan your next move",
    body: "Model it before you commit — a new location, a key hire, a price change, a new line.",
    tag: "Analytics · Compass",
    questions: [
      "Before a big decision, do you model the outcome — or decide on instinct?",
      "Can you run a sensitivity analysis — see how the result shifts if your key assumptions move?",
      "Do you know the real return (NPV or IRR) on your next investment, not just the payback period?",
      "Have you stress-tested your plan against a downturn?",
      "Do you know the one move that would move the needle most this year?",
    ],
  },
  {
    title: "Grow with confidence",
    body: "Run the plan against a living scoreboard that shows what's working in real time.",
    tag: "Aperture Atlas™",
    questions: [
      "Do you have a live scoreboard of the few numbers that matter — updated automatically?",
      "Do your KPIs connect, like a tree, back to the one or two numbers that really drive the business?",
      "Would you know within a week if your plan started going off track?",
      "Do your numbers tie back to source data, or are they hand-built in spreadsheets?",
      "Do you track leading indicators, or only lagging, after-the-fact results?",
    ],
  },
  {
    title: "Get ready to sell or raise",
    body: "Clean numbers, a story you can defend, and a value you can prove to a buyer or lender.",
    tag: "Analytics · Intelligence",
    questions: [
      "Do you know what your business is really worth — and the EBITDA multiple a buyer would apply?",
      "Are your numbers clean enough to hand to a buyer or lender tomorrow?",
      "Do you know how customer concentration and working capital would move your valuation?",
      "Can you defend your valuation with data, not just a story?",
      "Do you know what a buyer would flag as your biggest risk — and have you addressed it?",
      "Do you know what would make your business worth more before you sell?",
    ],
  },
  {
    title: "Put AI to work",
    body: "Add AI where it actually earns its place — with a person in the loop and models that stay yours.",
    tag: "AI, without the black box",
    questions: [
      "Do you know the two or three places AI would actually save you time or money this quarter?",
      "Have you separated the real AI use cases from the hype for your business?",
      "Do you know which decisions to automate vs. keep human — and the return on each?",
      "If you use AI, is a person still in the loop on the decisions that matter?",
      "Do the AI tools you use keep your data and models yours — or someone else's?",
    ],
  },
];

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-lg bg-paper p-6 shadow-xl sm:p-8">
        {children}
      </div>
    </div>
  );
}

const pill = (active: boolean, tone: "know" | "unsure") =>
  "rounded-sm border px-3 py-1.5 text-small font-semibold transition-colors " +
  (active
    ? tone === "know"
      ? "border-ink bg-ink text-paper"
      : "border-maroon bg-maroon text-paper"
    : "border-line text-body hover:border-ink");

export function FitChecks() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, "know" | "unsure">>({});

  const active = openIdx !== null ? wins[openIdx]! : null;
  const answered = Object.keys(answers).length;
  const unsure = Object.values(answers).filter((a) => a === "unsure").length;

  function openModal(i: number) {
    setOpenIdx(i);
    setAnswers({});
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wins.map((w, i) => (
          <Reveal key={w.title} delay={(i % 3) * 60}>
            <div className="flex h-full flex-col rounded-lg border border-line bg-paper p-6 transition-all hover:border-maroon hover:shadow-sm">
              <h3 className="text-h4 font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 flex-1 text-body text-muted">{w.body}</p>
              <p className="mt-4 text-small font-semibold text-maroon">{w.tag}</p>
              <button
                type="button"
                onClick={() => openModal(i)}
                className="mt-4 inline-flex items-center gap-1.5 self-start rounded-sm border border-line px-3 py-2 text-small font-semibold text-ink transition-colors hover:border-maroon hover:text-maroon"
              >
                How well do you know this?
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      <Modal open={active !== null} onClose={() => setOpenIdx(null)}>
        {active && (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-2">Quick self-check</p>
                <h3 className="text-h3 font-semibold text-ink">{active.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenIdx(null)}
                aria-label="Close"
                className="shrink-0 rounded-sm p-1 text-muted hover:text-ink"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-body text-muted">
              Answer honestly. Every &ldquo;Not sure&rdquo; is a question we can answer for you.
            </p>

            <ol className="mt-6 space-y-4">
              {active.questions.map((q, qi) => (
                <li key={qi} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
                  <p className="text-body text-ink">{q}</p>
                  <div className="mt-2.5 flex gap-2">
                    <button type="button" onClick={() => setAnswers((a) => ({ ...a, [qi]: "know" }))} className={pill(answers[qi] === "know", "know")}>
                      I know this
                    </button>
                    <button type="button" onClick={() => setAnswers((a) => ({ ...a, [qi]: "unsure" }))} className={pill(answers[qi] === "unsure", "unsure")}>
                      Not sure
                    </button>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-lg border border-line bg-surface p-5">
              {answered > 0 ? (
                unsure === 0 ? (
                  <p className="text-body text-ink">
                    You know this cold. When you want the data to <span className="font-semibold">prove</span> it —
                    that&apos;s where <span className="font-semibold text-maroon">{active.tag}</span> comes in.
                  </p>
                ) : (
                  <p className="text-body text-ink">
                    You&apos;re unsure on <span className="font-semibold">{unsure} of {active.questions.length}</span>.
                    That&apos;s exactly what <span className="font-semibold text-maroon">{active.tag}</span> answers — with
                    data, in plain language.
                  </p>
                )
              ) : (
                <p className="text-body text-muted">
                  Tap through the questions above — then we&apos;ll show you where{" "}
                  <span className="font-semibold text-maroon">{active.tag}</span> fits.
                </p>
              )}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link href={primaryCta.href} className="btn w-full justify-center sm:w-auto sm:px-8">
                  {primaryCta.label}
                </Link>
                <Link href="/reality-check" className="btn--secondary w-full justify-center sm:w-auto sm:px-8">
                  Take the full Reality Check
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
