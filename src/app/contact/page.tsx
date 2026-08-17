import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { CalendlyInline } from "@/components/booking/CalendlyInline";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { schedulerUrl, isCalendly, calendlyEmbedUrl } from "@/lib/scheduler";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "Let's talk about your business, a straightforward conversation with no slides, no pressure, and no obligation. Book a 30-minute video call or send a note. We reply within one business day.",
  path: "/contact",
});

export default function ContactPage() {
  const hasCalendly = Boolean(schedulerUrl) && isCalendly(schedulerUrl);

  return (
    <>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <Reveal className="max-w-measure">
          <p className="eyebrow mb-5">Contact</p>
          <h1 className="heading-gradient text-display font-semibold">Let&apos;s talk about your business.</h1>
          <p className="mt-6 text-body-lg text-body">
            A straightforward conversation: no slides, no pressure, no obligation. Book a 30-minute
            video call below, or send a note and we&apos;ll set up a time.
          </p>
          <p className="mt-6">
            <a href="#write" className="link-arrow">
              Prefer to write first?
              <span aria-hidden="true" className="arrow">
                ↓
              </span>
            </a>
          </p>
        </Reveal>
      </Section>

      {/* Book a call */}
      <Section id="book" tone="surface" className="scroll-mt-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3">Book a time</p>
          <h2 className="heading-gradient text-h2 font-semibold">Grab a 30-minute call.</h2>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-muted">
            A candid conversation with Fenwick: you tell him what you&apos;re trying to figure out; he
            tells you, straight, whether The Aperture Method™ can help. Pick a time and you&apos;ll get a
            Google Meet link in the calendar invite.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-small text-muted">
            Calls may be recorded so we can focus on the conversation rather than note-taking; we&apos;ll
            always tell you at the start and stop on request. See our{" "}
            <Link href="/privacy" className="link-inline">
              Privacy Policy
            </Link>
            .
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          {hasCalendly ? (
            <div className="mx-auto max-w-3xl rounded-lg border border-line bg-paper p-1 sm:p-2">
              <CalendlyInline url={calendlyEmbedUrl()} />
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-lg border border-line bg-paper p-8 text-center">
              <p className="text-body text-muted">
                Online booking is being connected. In the meantime, send a note below or email{" "}
                <a href={`mailto:${siteConfig.email}`} className="link-inline">
                  {siteConfig.email}
                </a>{" "}
                and we&apos;ll set up a time, usually within one business day.
              </p>
              <a href="#write" className="btn mt-6">
                Send a note
              </a>
            </div>
          )}
        </Reveal>
      </Section>

      {/* Prefer to write first */}
      <Section>
        <div id="write" className="grid scroll-mt-28 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal variant="right" className="space-y-8">
            <div>
              <p className="eyebrow mb-3">What to expect</p>
              <ul className="space-y-4 text-body text-muted">
                <li className="border-t border-line pt-4">
                  <span className="font-semibold text-ink">A real conversation.</span> No slides and no
                  sales pitch, just a candid talk about your business.
                </li>
                <li className="border-t border-line pt-4">
                  <span className="font-semibold text-ink">An honest answer.</span> If we&apos;re not the
                  right fit, we&apos;ll tell you, and point you somewhere useful.
                </li>
                <li className="border-t border-line pt-4">
                  <span className="font-semibold text-ink">A reply within one business day.</span>{" "}
                  Fenwick reads every enquiry personally.
                </li>
              </ul>
              <p className="mt-8 text-small text-muted">
                <a href={`mailto:${siteConfig.email}`} className="link-inline">
                  {siteConfig.email}
                </a>{" "}
                · We reply within one business day.
              </p>
            </div>
          </Reveal>

          <Reveal variant="left" delay={100}>
            <div className="rounded border border-line bg-paper p-8 md:p-10">
              <p className="eyebrow mb-3">Send a note</p>
              <h2 className="text-h3 font-semibold text-ink">Tell us what&apos;s on your mind.</h2>
              <p className="mt-3 text-body text-muted">
                Four quick fields to start a good conversation. Prefer to write first? A sentence or two
                is plenty.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
