import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { primaryCta } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "AI for Your Business — Understand, Implement, Use",
  description:
    "AI is becoming table stakes. The Aperture Method helps owner-run businesses understand it, implement what fits, and actually use it to keep pace with their market — in plain language, with nothing you can't see inside.",
  path: "/ai",
});

const stages: { n: string; h: string; p: string }[] = [
  {
    n: "01",
    h: "Understand",
    p: "We cut through the hype and the fear. In plain language, you'll learn what AI can — and can't — do for a business like yours, and how it's already reshaping your industry.",
  },
  {
    n: "02",
    h: "Implement",
    p: "We set up the tools, automations, and models that actually fit your business — built on your data and wired into how you already work, without a big, risky IT project.",
  },
  {
    n: "03",
    h: "Use",
    p: "We get your team using it week to week, not just admiring it in a demo — and we keep it current as the tools, your competitors, and your market keep moving.",
  },
];

const principles = [
  {
    h: "Only where it pays off",
    p: "We don't add AI for its own sake. It goes in when it genuinely beats the alternative — and stays out when a simpler tool wins.",
  },
  {
    h: "No black boxes",
    p: "We favor methods we can explain in plain English. If we can't tell you why it reached an answer, we won't ask you to bet the business on it.",
  },
  {
    h: "A person decides",
    p: "AI surfaces the signal; you and we make the call. Every output is reviewed by a human before it reaches you.",
  },
  {
    h: "Yours to keep",
    p: "The tools and models we build on your data belong to you — never locked inside someone else's platform, never dependent on us to run.",
  },
];

const uses: { h: string; p: string; phase: string }[] = [
  {
    h: "Automate the busywork",
    p: "Quoting, scheduling, data entry, follow-ups, reporting — the repetitive work that eats your team's week, handled so they can focus on customers.",
    phase: "Execute",
  },
  {
    h: "Answer customers faster",
    p: "Assistants and workflows that help you respond quickly and consistently, so service keeps up as you grow — with a person in the loop.",
    phase: "Execute",
  },
  {
    h: "Forecast demand and revenue",
    p: "Projecting what's coming so you can plan staffing, inventory, and cash with more confidence than a gut estimate.",
    phase: "Quantify",
  },
  {
    h: "See who's likely to leave — or buy more",
    p: "Scoring customers by their likelihood to churn or grow, so your attention and offers go where they'll actually move the needle.",
    phase: "Illuminate",
  },
  {
    h: "Find patterns you'd never spot by hand",
    p: "Surfacing what really drives profit and predicts a good customer, tested honestly against your own numbers.",
    phase: "Quantify",
  },
];

const wont = [
  "Hand a decision to a model you can't question.",
  "Chase shiny tools that don't fit how you actually run.",
  "Pretend small or messy data is bigger or cleaner than it is.",
  "Lock your tools or data inside our platform.",
];

const faqs = [
  {
    q: "Are we behind if we haven't started with AI yet?",
    a: "Not really — most owner-run businesses haven't. What matters is starting deliberately before your market forces you to. We help you catch up quickly, on your terms, without the panic-buying that trips a lot of companies up.",
  },
  {
    q: "Isn't AI just for big companies?",
    a: "Not anymore. The same capabilities large firms use are now within reach at your size — the hard part is knowing which ones are worth it and how to wire them into your business. That's exactly what we do.",
  },
  {
    q: "Will AI replace my team or my judgment?",
    a: "No. It takes the repetitive work off their plate and hands you better information — so your people spend more time on judgment, relationships, and running the business. A person reviews every output before it reaches you.",
  },
  {
    q: "Is my data safe? Do you train models on it?",
    a: "Your data is handled with least-access security and clear terms, and it's never sold, shared, or reused to train anything for anyone else. Everything we build on it is yours.",
  },
  {
    q: "We don't have much data. Can AI still help?",
    a: "Often, yes — a lot of useful AI is about saving time and reducing friction, not crunching big datasets. Where data matters, we're honest about the limits and lean on methods that stay reliable at your scale.",
  },
];

export default function AiPage() {
  return (
    <>
      {/* Hero */}
      <Section tone="dark" className="pt-28 md:pt-36">
        <Reveal>
          <p className="eyebrow eyebrow--on-dark mb-5">AI, made usable</p>
          <h1 className="max-w-4xl text-display font-semibold text-paper">
            Bring AI into your business — without the hype or the fear.
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-white/75">
            AI is fast becoming table stakes. We help you understand it, put it to work, and keep pace
            with your market — built into The Aperture Method, in plain language, with nothing you
            can&apos;t see inside.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href={primaryCta.href} className="btn--on-dark">
              {primaryCta.label}
            </Link>
            <Link href="#how" className="btn--ghost">
              See how we help ↓
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* Why it matters now */}
      <Section>
        <Reveal className="max-w-measure">
          <SectionHeading title="AI isn't optional anymore. It doesn't have to be overwhelming." />
          <p className="mt-6 text-body-lg text-body">
            Your industry is already changing. Competitors are automating, customers expect faster and
            smarter service, and the tools get better every month. For most owners the question
            isn&apos;t whether AI matters — it&apos;s knowing where to start without wasting money or
            betting on hype.
          </p>
          <p className="mt-5 text-body-lg text-body">
            That&apos;s the gap we close. We help you adopt AI deliberately and confidently —
            understanding what&apos;s real, implementing what fits, and actually using it day to day — so
            you keep pace and hold your edge instead of quietly falling behind.
          </p>
        </Reveal>
      </Section>

      {/* Understand · Implement · Use */}
      <Section id="how" tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="Understand · Implement · Use"
            title="From 'we should probably do something with AI' to using it every week."
            lede="We don't drop a tool on your desk and wish you luck. We walk you through adoption in three plain steps — as part of the Method, not a side project."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stages.map((s, i) => (
            <Reveal key={s.h} variant="up" delay={(i % 3) * 90}>
              <div className="group h-full rounded-lg border border-line bg-paper p-7 transition-colors duration-200 hover:border-maroon/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-line bg-surface text-h3 font-semibold text-maroon transition-colors duration-200 group-hover:border-maroon group-hover:bg-maroon group-hover:text-paper">
                  {s.n}
                </div>
                <h3 className="mt-5 text-h3 font-semibold text-ink">{s.h}</h3>
                <p className="mt-3 text-body text-muted">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Practical uses */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="In practice"
            title="Practical ways AI shows up in your business."
            lede="Not a science project — specific, useful jobs that save time or sharpen a decision, introduced where they fit in the Method."
          />
        </Reveal>
        <div className="mt-12 space-y-5">
          {uses.map((u, i) => (
            <Reveal key={u.h} variant="up" delay={(i % 2) * 70}>
              <div className="group grid gap-4 rounded-lg border border-line bg-paper p-6 transition-colors duration-200 hover:border-maroon/40 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-8 md:p-7">
                <div>
                  <h3 className="text-h4 font-semibold text-ink">{u.h}</h3>
                  <span className="mt-2 inline-block rounded-full bg-surface px-3 py-1 text-small font-medium text-maroon">
                    {u.phase}
                  </span>
                </div>
                <p className="text-body leading-relaxed text-body md:border-l md:border-line md:pl-8">
                  {u.p}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How we keep it honest — principles */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading eyebrow="Safe and simple" title="And we keep it honest the whole way." />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((a, i) => (
            <Reveal key={a.h} variant="up" delay={(i % 4) * 80}>
              <div className="group h-full rounded-lg border border-line bg-paper p-6 hover-lift">
                <h3 className="text-h4 font-semibold text-ink transition-colors duration-200 group-hover:text-maroon">
                  {a.h}
                </h3>
                <p className="mt-2 text-body text-muted">{a.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* What we won't do */}
      <Section>
        <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <SectionHeading title="What we won't do." />
          <ul className="space-y-4">
            {wont.map((w) => (
              <li key={w} className="flex gap-3 text-body-lg text-body">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-maroon" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {w}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section tone="surface">
        <Reveal className="max-w-3xl">
          <SectionHeading title="What owners ask us about AI." className="mb-10 max-w-none" />
          <Faq items={faqs} />
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section tone="dark">
        <Reveal variant="zoom">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-h2 font-semibold text-paper">
                Ready to put AI to work — the right way?
              </h2>
              <p className="mt-4 text-body-lg text-white/70">
                Start with a Business X-Ray. We&apos;ll show you where AI can help your business keep
                pace and hold its edge — in plain language, with nothing you can&apos;t see inside.
              </p>
            </div>
            <Link href={primaryCta.href} className="btn--on-dark shrink-0">
              {primaryCta.label}
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
