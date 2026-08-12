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
  title: "Look Closer — a free business session for schools",
  description:
    "A free 50-minute classroom session for grades 8–12 in The Woodlands. Students get a real-looking local business and fifteen minutes to find the one thing holding it back. The whole packet — lesson plan, business cards, worksheet and answer key — is free for any teacher to download and run.",
  path: "/look-closer",
  image: "/look-closer/look-closer-og.png",
});


const trust: { title: string; body: string }[] = [
  {
    title: "Whatever screening your district requires",
    body: "Fingerprinting, volunteer clearance, visitor background check — tell me what Conroe ISD or your campus needs and how long it takes, and I'll start it before we pick a date.",
  },
  {
    title: "I come alone, and nothing leaves the room",
    body: "No crew and no camera. I don't photograph students, I don't post about the visit, and nothing is collected from anyone in the room — no sign-ups, no emails, no handouts to take home and sign.",
  },
  {
    title: "You see every page before I walk in",
    body: "The full packet goes to you ahead of time. If you want a business card changed, a number simplified, or a whole section cut, we change it. It's your classroom.",
  },
  {
    title: "Local, not a vendor",
    body: "I live in The Woodlands. These aren't schools I found on a map — they're the ones down the road. Happy to get on a call with you or your department head first, with no date on the calendar.",
  },
];

const bring: { us: string; you: string }[] = [
  { us: "A facilitator who runs the full period", you: "Fifty minutes of class time" },
  { us: "Every printed material, ready to go", you: "A whiteboard and desks that group in threes" },
  { us: "The lesson plan and answer key, yours to keep", you: "Nothing else. No technology required." },
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
            Fifty minutes. Teams of three. Each one gets a card describing a business you could walk
            to from here — a waffle window on the Waterway, a barbershop at Creekside Park, a lawn
            crew in Panther Creek — and fifteen minutes to work out the one thing holding it back.
            It is the same question this firm gets paid to answer, handed to {lookCloser.grades.toLowerCase()},
            for free.
          </p>
        </Reveal>

        <Reveal variant="up" delay={120} className="mt-12">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {[
              { n: "50", l: "Minutes, start to finish" },
              { n: "23", l: "Of them, students working" },
              { n: "6", l: "Businesses, six different problems" },
              { n: "$0", l: "Cost to the school. Always." },
            ].map((s) => (
              <div key={s.l} className="bg-paper px-5 py-6">
                <dd className="text-h2 font-semibold text-maroon">{s.n}</dd>
                <dt className="mt-1 text-small text-muted">{s.l}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      {/* Why */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="Why we do this" title="Nobody teaches you how to look at a business." />
          </Reveal>
          <Reveal variant="left" delay={100}>
            <div className="space-y-5 text-body-lg text-body">
              <p>
                Most people meet their first real business as an employee, and by then it is already
                a mystery — decisions arrive from somewhere above and nobody explains why. Most
                owners are no better off. We spend our working lives with people whose life savings
                are inside a building they cannot see clearly.
              </p>
              <p>
                It turns out the first move is not complicated. You look carefully at something
                ordinary, you count a few things, and you find the one part that is slowing
                everything else down. A fifteen-year-old can do that. We have watched them do it in
                fifteen minutes.
              </p>
              <p>
                So we built the session we wish someone had run for us, and we give it away. If a
                student walks out knowing that a business is a thing you can look at and figure out
                — rather than a thing that happens to you — the hour did its job.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* The takeaway */}
      <Section tone="dark">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">What they walk away with</p>
          <blockquote className="text-h1 font-semibold leading-[1.1] text-paper">
            &ldquo;{lookCloser.takeaway}&rdquo;
          </blockquote>
          <p className="mt-6 text-body-lg text-white/70">
            One belief, in the student&apos;s own voice — not a framework and not a worksheet they
            will have lost by Friday. A class period cannot teach a skill; skills need practice. What
            it can do is change what a student believes is available to them, and the only way to do
            that is to let them earn it. Which is why we talk for twelve minutes and they work for
            twenty-three.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {lookCloserIdeas.map((idea, i) => (
            <Reveal key={idea.title} variant="up" delay={i * 80}>
              <div className="h-full rounded-lg border border-white/10 bg-white/[0.03] p-6">
                <p className="text-overline uppercase tracking-overline text-maroon-onDark">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-h4 font-semibold text-paper">{idea.title}</h3>
                <p className="mt-3 text-body text-white/65">{idea.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Run of show */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="The fifty minutes"
            title="What actually happens in the room."
            lede="Students are working for twenty-three of the fifty minutes. That ratio is the entire design — anything that eats into it gets cut, including our own good stories."
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
            <Reveal key={c.name} variant="up" delay={(i % 3) * 80}>
              <div className="h-full rounded-lg border border-line bg-paper p-6">
                <h3 className="text-h4 font-semibold text-ink">{c.name}</h3>
                <p className="mt-1 text-small uppercase tracking-overline text-maroon">{c.where}</p>
                <p className="mt-4 text-body text-muted">{c.teaser}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={140}>
          <p className="mt-8 max-w-measure text-body text-muted">
            <span className="font-semibold text-ink">To be clear:</span> every business here is
            invented. The streets, parks and shopping centres are real so the exercise feels like
            home — but no real business is described, and no real numbers are used.
          </p>
        </Reveal>
      </Section>

      {/* Downloads */}
      <Section tone="dark" id="downloads">
        <Reveal className="max-w-measure">
          <p className="eyebrow eyebrow--on-dark mb-5">For teachers</p>
          <h2 className="text-h2 font-semibold text-paper">Take the whole thing. Run it yourself.</h2>
          <p className="mt-6 text-body-lg text-white/70">
            You do not need us in the room, you do not need to ask permission, and you do not need to
            tell us you used it. Print it, change it, put your own town&apos;s businesses on the
            cards. It is yours.
          </p>
        </Reveal>
        <div className="mt-12">
          <PacketDownloads />
        </div>
      </Section>


      {/* Who's coming */}
      <Section tone="surface" id="who">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal variant="right">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line">
              <Image
                src="/fenwick-how.jpg"
                alt="Fenwick How, founder of The Aperture Method"
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>

          <Reveal variant="left" delay={100}>
            <p className="eyebrow mb-4">Who&apos;s coming to your classroom</p>
            <h2 className="text-h2 font-semibold text-ink">Fenwick How</h2>
            <p className="mt-2 text-body-lg text-maroon">
              Founder, The Aperture Method™ · The Woodlands, Texas
            </p>
            <div className="mt-6 space-y-5 text-body-lg text-body">
              <p>
                I run a business intelligence firm here in town. My work is sitting down with people
                who own companies — a fabricator, a clinic, a distributor — and finding the one thing
                that is quietly holding the whole business back. It is unglamorous, it is mostly
                arithmetic, and almost nobody is ever taught how to do it.
              </p>
              <p>
                I live here, and my family is here. These aren&apos;t schools I found on a map. The
                students in them will be running, working in and buying from the businesses in this
                county in fifteen years, and I would rather they learned to look at one properly
                before then.
              </p>
              <p>
                I get nothing out of the visit. No fee, nothing sold, and I&apos;m not there to talk
                about my firm — that&apos;s one minute at the end, if anyone asks. I&apos;m there
                because I get to hand thirty teenagers a real problem and watch them take it apart.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={140} className="mt-14">
          <h3 className="text-h3 font-semibold text-ink">Before you say yes</h3>
          <p className="mt-3 max-w-measure text-body text-muted">
            You&apos;re deciding whether to put a stranger in a room with thirty of your students.
            Here are the answers to the questions you&apos;d otherwise have to ask.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {trust.map((t, i) => (
              <div key={t.title} className="rounded-lg border border-line bg-paper p-6">
                <p className="text-overline uppercase tracking-overline text-maroon">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h4 className="mt-3 text-h4 font-semibold text-ink">{t.title}</h4>
                <p className="mt-3 text-body text-muted">{t.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* Bring it to your school */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Or we&apos;ll come and run it"
              title="Bring it to your classroom."
              lede="Conroe ISD and Montgomery County schools, plus DECA and FBLA chapters. There is no cost and nothing to sign."
            />
            <div className="mt-8 overflow-hidden rounded-lg border border-line">
              <div className="grid grid-cols-2 border-b border-line bg-surface">
                <p className="px-5 py-3 text-small font-semibold uppercase tracking-overline text-ink">
                  What we bring
                </p>
                <p className="border-l border-line px-5 py-3 text-small font-semibold uppercase tracking-overline text-ink">
                  What we need
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
              <h3 className="text-h3 font-semibold text-ink">What we don&apos;t do</h3>
              <ul className="mt-5 space-y-4 text-body text-muted">
                <li>
                  We don&apos;t sell anything to students, and we don&apos;t collect their
                  information.
                </li>
                <li>
                  We don&apos;t spend the period talking about the firm. That is one minute at the
                  end, and only if somebody asks.
                </li>
                <li>
                  We don&apos;t need a fee, a stage, a slide deck, or a photograph of ourselves in
                  your hallway.
                </li>
              </ul>
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-body text-body">
                  Email your school, your course and two dates that would work. We confirm within two
                  business days and send the materials ahead, so you can see exactly what your
                  students will be handed.
                </p>
                <Link href="mailto:hello@aperturemethod.com?subject=Look%20Closer%20—%20classroom%20visit" className="btn mt-6">
                  Email us about a visit
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
            who owns it has been standing inside it every day for six years. That is the moment worth
            driving across town for.
          </p>
          <p className="mt-8 text-body text-white/50">
            {lookCloser.name} · {lookCloser.grades} · {lookCloser.place} · a community program of The
            Aperture Method™
          </p>
        </Reveal>
      </Section>
    </>
  );
}
