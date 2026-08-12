import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PacketDownloads } from "@/components/education/PacketDownloads";
import {
  lookCloser,
  lookCloserCards,
  lookCloserIdeas,
  lookCloserRunOfShow,
} from "@/lib/lookCloser";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Look Closer — a free guest-speaker session for schools",
  description:
    "A free 50-minute guest-speaker session for grades 8–12 — economics, business, entrepreneurship and career classes. Students get a real-looking business and fifteen minutes to find the one thing holding it back. No fee, nothing sold to students.",
  path: "/look-closer",
  image: "/look-closer/look-closer-og.png",
});

const stats: { n: string; l: string }[] = [
  { n: "50", l: "Minutes, start to finish" },
  { n: "23", l: "Minutes the students are working" },
  { n: "6", l: "Businesses, six different problems" },
  { n: "$0", l: "Cost to the school. Always." },
];

const trust: { title: string; body: string }[] = [
  {
    title: "Whatever screening your district requires",
    body: "Fingerprinting, volunteer clearance, visitor background check — tell me what your district or campus needs and how long it takes, and I'll start it before we pick a date.",
  },
  {
    title: "I come alone, and nothing leaves the room",
    body: "No crew and no camera. I don't photograph students, I don't post about the visit, and nothing is collected from anyone in the room — no sign-ups, no emails, no handouts to take home and sign.",
  },
  {
    title: "You see every page before I walk in",
    body: "Everything I'll hand out goes to you ahead of time. If you want a business swapped, a number simplified, or a whole section cut, I change it. It's your classroom.",
  },
  {
    title: "I'm the one who shows up",
    body: "Not an associate, not a video. Happy to get on a call with you or your department head first, with no date on the calendar and nothing to sign.",
  },
];

const bring: { us: string; you: string }[] = [
  { us: "I run the full period, start to finish", you: "Fifty minutes of class time" },
  { us: "Every printed handout, brought with me", you: "A whiteboard and desks that group in threes" },
  { us: "Business cards rewritten for your town", you: "Nothing else. No technology required." },
];

export default function LookCloserPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-4">{lookCloser.eyebrow}</p>
          <h1 className="text-h1 font-semibold heading-gradient">Look Closer</h1>
          <p className="mt-6 text-body-lg text-body">{lookCloser.tagline}</p>
          <p className="mt-5 text-body-lg text-muted">
            I come to your classroom for one period. Teams of three each get a card describing a real
            business — a waffle window, a barbershop, a lawn crew two seniors run on Saturdays — and
            fifteen minutes to work out the one thing holding it back. It is the same question I get
            paid to answer for business owners, handed to {lookCloser.grades.toLowerCase()} for
            nothing.
          </p>
        </Reveal>

        <Reveal variant="up" delay={120} className="mt-12">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l} className="bg-paper px-5 py-7 text-center">
                <dd className="text-h2 font-semibold text-maroon">{s.n}</dd>
                <dt className="mx-auto mt-2 max-w-[20ch] text-small text-muted">{s.l}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={180} className="mt-8">
          <p className="max-w-measure text-body text-muted">
            <span className="font-semibold text-ink">Where it fits:</span> {lookCloser.fits}. No prior
            business coursework is assumed — the arithmetic is multiplication and division, done
            deliberately slowly.
          </p>
        </Reveal>
      </Section>

      {/* What the session teaches — the three ideas, up front */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="What the session teaches"
            title="Three ideas, and never more than three."
            lede="A room does not remember more things because you said more things. These are the three a student can still use in ten years."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {lookCloserIdeas.map((idea, i) => (
            <Reveal key={idea.title} variant="up" delay={(i % 3) * 90} className="h-full">
              <div className="flex h-full flex-col rounded-lg border border-line bg-paper p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-maroon/40 hover:shadow-[0_18px_40px_-16px_rgba(80,0,0,0.35)] motion-reduce:hover:translate-y-0 sm:p-7">
                <p className="text-h3 font-semibold text-maroon">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 text-h4 font-semibold text-ink">{idea.title}</h3>
                <p className="mt-3 text-small uppercase tracking-overline text-maroon">{idea.label}</p>
                <p className="mt-4 text-body text-muted">{idea.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Why */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="Why I do this" title="Nobody teaches you how to look at a business." />
          </Reveal>
          <Reveal variant="left" delay={100}>
            <div className="space-y-5 text-body-lg text-body">
              <p>
                Most people meet their first real business as an employee, and by then it is already
                a mystery — decisions arrive from somewhere above and nobody explains why. Most
                owners are no better off. I spend my working life with people whose life savings are
                inside a building they cannot see clearly.
              </p>
              <p>
                It turns out the first move is not complicated. You look carefully at something
                ordinary, you count a few things, and you find the one part that is slowing
                everything else down. A fifteen-year-old can do that. I have watched them do it in
                fifteen minutes.
              </p>
              <p>
                So I built the session I wish someone had run for me, and I give it away. If a
                student walks out knowing that a business is a thing you can look at and figure out —
                rather than a thing that happens to you — the hour did its job.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* The takeaway */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">And the one thing they walk away with</p>
          <blockquote className="text-h1 font-semibold leading-[1.1] text-paper">
            &ldquo;{lookCloser.takeaway}&rdquo;
          </blockquote>
          <p className="mt-6 text-body-lg text-white/70">
            One belief, in the student&apos;s own voice — not a framework and not a worksheet they
            will have lost by Friday. A class period cannot teach a skill; skills need practice. What
            it can do is change what a student believes is available to them, and the only way to do
            that is to let them earn it. So I keep my part short and hand the room over. Most of the
            period is them working, not me talking.
          </p>
        </Reveal>

      </Section>

      {/* Run of show */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="The fifty minutes"
            title="What actually happens in the room."
            lede="The students do the work for most of the period. That ratio is the entire design — anything that eats into it gets cut, including my own good stories."
          />
        </Reveal>
        <div className="mt-12 border-t border-line">
          {lookCloserRunOfShow.map((s, i) => (
            <Reveal key={s.title} delay={Math.min(i * 60, 240)}>
              <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
                <p className="text-small font-semibold uppercase tracking-overline text-maroon">
                  {s.time} min
                </p>
                <div>
                  <h3 className="text-h4 font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-body text-muted">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The six businesses */}
      <Section tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="The six businesses"
            title="Invented businesses. Real streets."
            lede="Each one is broken in a different way, so no two teams reach the same answer. Five of the six punish the reflex answer — “they should advertise more” — and exactly one rewards it. That reversal is the most useful eight seconds of the hour."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lookCloserCards.map((c, i) => (
            <Reveal key={c.name} variant="up" delay={(i % 3) * 80} className="h-full">
              <div className="flex h-full flex-col rounded-lg border border-line bg-paper p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-maroon/40 hover:shadow-[0_18px_40px_-16px_rgba(80,0,0,0.35)] motion-reduce:hover:translate-y-0 sm:p-7">
                <h3 className="text-h4 font-semibold text-ink">{c.name}</h3>
                <p className="mt-3 text-small uppercase tracking-overline text-maroon">{c.where}</p>
                <p className="mt-5 text-body text-muted">{c.teaser}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={140}>
          <div className="mt-8 max-w-measure space-y-4 text-body text-muted">
            <p>
              <span className="font-semibold text-ink">I rewrite these for your town.</span> The
              cards land hardest when they describe streets your students have actually stood on, so
              before I come I swap the locations — and often the businesses — for ones a few minutes
              from your building.
            </p>
            <p>
              <span className="font-semibold text-ink">To be clear:</span> every business is
              invented. The streets are real so the exercise feels like home, but no real business is
              described and no real numbers are used.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Who's coming */}
      <Section id="who">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal variant="right">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-line bg-surface">
              <Image
                src="/look-closer/fenwick-headshot.jpg"
                alt="Fenwick How, founder of The Aperture Method"
                fill
                sizes="(max-width: 1024px) 100vw, 32vw"
                className="object-cover object-top"
                priority={false}
              />
            </div>
          </Reveal>

          <Reveal variant="left" delay={100}>
            <p className="eyebrow mb-4">Who&apos;s coming to your classroom</p>
            <h2 className="text-h2 font-semibold text-ink">Fenwick How</h2>
            <p className="mt-2 text-body-lg text-maroon">Founder, The Aperture Method™</p>
            <div className="mt-6 space-y-5 text-body-lg text-body">
              <p>
                I have started and run several businesses across a few different industries, and
                spent years inside other people&apos;s — in operations, projects and analytics. These
                days I run a business intelligence firm. The work is sitting down with someone who
                owns a company and finding the one thing quietly holding the whole thing back. It is
                unglamorous, it is mostly arithmetic, and almost nobody is ever taught how to do it.
              </p>
              <p>
                I hold a BBA in Project Management, I&apos;m a certified Project Management
                Professional, and I&apos;m finishing an MBA at Texas A&amp;M.
              </p>
              <p>
                I get nothing out of the visit. No fee, nothing sold, and I&apos;m not there to talk
                about my firm — that&apos;s one minute at the end, if anyone asks. I&apos;m there
                because I get to hand thirty teenagers a real problem and watch them take it apart.
              </p>
              <p className="text-body text-muted">
                I&apos;m based in The Woodlands, Texas, and I&apos;ll come to any school that will
                have me. If it&apos;s a long way we&apos;ll work out the travel together — the
                session itself is free either way.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Snow Bank, 1978 */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
          <Reveal variant="right">
            <figure>
              <div className="overflow-hidden rounded-lg border border-line bg-paper p-2 shadow-card">
                <Image
                  src="/look-closer/snow-bank-1978.jpg"
                  alt="A December 1978 Taber Times front page headlined “Snow Bank”, with a photograph of two eight-year-old boys shovelling a driveway"
                  width={1405}
                  height={1120}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full rounded"
                />
              </div>
              <figcaption className="mt-3 text-small text-muted">
                Taber Times, 21 December 1978. Fenwick How (left) and Scott Campbell, both eight.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal variant="left" delay={100}>
            <p className="eyebrow mb-4">Where this comes from</p>
            <h2 className="text-h2 font-semibold heading-gradient">
              My first business was a snow shovel.
            </h2>
            <div className="mt-6 space-y-5 text-body-lg text-body">
              <p>
                In December 1978 the local paper in Taber, Alberta ran a story about two eight-year-olds
                who had worked out that snow was money. My friend Scott and I walked the neighbourhood
                with shovels, knocking on doors, offering to clear driveways and sidewalks. We called
                it Snow Bank.
              </p>
              <p className="border-l-2 border-maroon pl-5 italic text-body">
                &ldquo;We wanted some money to buy marbles, maybe a new comic book, or even a
                pop.&rdquo;
              </p>
              <p>
                Nobody taught us that. We noticed the thing everyone on the street was complaining
                about, worked out what they&apos;d pay to make it go away, and counted what was left
                at the end of the day. That is the same handful of questions I put on a whiteboard
                now, for clients who are paying a great deal more than a quarter a driveway.
              </p>
              <p className="font-semibold text-ink">
                An eight-year-old found them without permission from anyone. That is exactly what I
                want your students to leave believing.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Before you say yes */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Before you say yes"
            title="The questions you'd otherwise have to ask."
            lede="You're deciding whether to put a stranger in a room with thirty of your students. Here are the answers up front."
          />
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {trust.map((t, i) => (
            <Reveal key={t.title} variant="up" delay={(i % 2) * 80} className="h-full">
              <div className="flex h-full flex-col rounded-lg border border-line bg-surface p-6 sm:p-7">
                <p className="text-overline uppercase tracking-overline text-maroon">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-h4 font-semibold text-ink">{t.title}</h3>
                <p className="mt-4 text-body text-muted">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* The materials */}
      <Section tone="dark" id="materials">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">What I&apos;ll bring</p>
          <h2 className="text-h2 font-semibold text-paper">
            See exactly what your students will be handed.
          </h2>
          <p className="mt-6 text-body-lg text-white/70">
            Nothing about this session is a surprise. Below is the whole set — the cards, the
            worksheet, the lesson plan I run from and the answer key. Read any of it before you give
            up a period, and tell me if you&apos;d change something.
          </p>
        </Reveal>
        <div className="mt-12">
          <PacketDownloads />
        </div>
      </Section>

      {/* Booking */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Booking a visit"
              title="Bring it to your classroom."
              lede="Any school, any district, any class that would find it useful. There is no cost and nothing to sign."
            />
            <div className="mt-8 overflow-hidden rounded-lg border border-line">
              <div className="grid grid-cols-2 border-b border-line bg-surface">
                <p className="px-5 py-3 text-small font-semibold uppercase tracking-overline text-ink">
                  What I bring
                </p>
                <p className="border-l border-line px-5 py-3 text-small font-semibold uppercase tracking-overline text-ink">
                  What I need
                </p>
              </div>
              {bring.map((r) => (
                <div key={r.us} className="grid grid-cols-2 border-b border-line last:border-b-0">
                  <p className="px-5 py-4 text-body text-body">{r.us}</p>
                  <p className="border-l border-line px-5 py-4 text-body text-muted">{r.you}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal variant="left" delay={100}>
            <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
              <h3 className="text-h3 font-semibold text-ink">What I don&apos;t do</h3>
              <ul className="mt-5 space-y-4 text-body text-muted">
                <li>
                  I don&apos;t sell anything to students, and I don&apos;t collect their information.
                </li>
                <li>
                  I don&apos;t spend the period talking about my firm. That is one minute at the end,
                  and only if somebody asks.
                </li>
                <li>
                  I don&apos;t need a fee, a stage, a slide deck, or a photograph of myself in your
                  hallway.
                </li>
              </ul>
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-body text-body">
                  Email your school, your course and two dates that would work. I&apos;ll confirm
                  within two business days and send the materials ahead, so you can see exactly what
                  your students will be handed.
                </p>
                <Link
                  href="mailto:hello@aperturemethod.com?subject=Look%20Closer%20—%20classroom%20visit"
                  className="btn mt-6"
                >
                  Email me about a visit
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Closing */}
      <Section tone="dark" className="border-t border-white/10">
        <Reveal variant="zoom" className="max-w-measure">
          <h2 className="text-h2 font-semibold text-paper">
            Fifteen minutes ago, none of them had ever looked at a business.
          </h2>
          <p className="mt-5 text-body-lg text-white/70">
            Then they found the thing that was wrong with one, and they were right — while the person
            who owns it has been standing inside it every day for six years. That is the moment
            worth driving for.
          </p>
          <p className="mt-8 text-body text-white/50">
            {lookCloser.name} · {lookCloser.grades} · a free session from The Aperture Method™
          </p>
        </Reveal>
      </Section>
    </>
  );
}
