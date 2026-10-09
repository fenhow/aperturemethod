import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { PreStartQuestions } from "@/components/forms/PreStartQuestions";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "New Client Onboarding",
  description:
    "Welcome to The Aperture Method. Complete your client intake and sign your service agreement online. A copy is saved to your secure client area.",
  path: "/onboarding",
});

/** The confidentiality promises, each one traceable to a clause in the documents. */
const promises = [
  {
    h: "Used for your engagement only",
    p: "Your data is used to deliver your work and nothing else. It is never sold, never shared with another client, and never used to train a general-purpose AI model.",
  },
  {
    h: "Seen by the fewest people possible",
    p: "Least-access by default: only those working on your engagement can open it, under written confidentiality obligations, in access-controlled systems with multi-factor authentication.",
  },
  {
    h: "Encrypted, logged, and kept in the US",
    p: "Encrypted in transit and at rest, with access logged, stored in the United States, and never copied to personal devices or unmanaged storage.",
  },
  {
    h: "Only what the question needs",
    p: "We ask for the narrowest data that answers the question, and de-identify or aggregate personal data wherever identity is not required for the analysis.",
  },
  {
    h: "Returned or destroyed on request",
    p: "Ask, and within 30 days your raw data is returned or securely destroyed. We keep only your deliverables and the minimum records law and accounting require.",
  },
  {
    h: "Your name is not a marketing asset",
    p: "We will not name you, use your logo, or describe your engagement publicly without your written consent. Case studies are anonymised, approved, or both.",
  },
  {
    h: "It runs both ways",
    p: "The NDA is mutual and the agreement's confidentiality clause binds us both. What you learn about our methods and pricing is equally protected.",
  },
  {
    h: "You hear about a problem fast",
    p: "If there is ever a security incident affecting your data, you are told without delay and within 72 hours, with what we know and what we are doing about it.",
  },
];

const steps = [
  {
    href: "/onboarding/nda",
    step: "Optional, first",
    title: "Mutual NDA",
    blurb:
      "Want protection in place before we talk about anything real? Sign the two-way NDA. It binds both of us on the same terms, and you get a signed PDF straight away. Skip it if the agreement below is enough: it carries the same confidentiality terms.",
    cta: "Review & sign the NDA",
  },
  {
    href: "/onboarding/agreement",
    step: "Step 1",
    title: "New Customer Agreement",
    blurb:
      "First, review and e-sign the services agreement, fixed-fee, phase-gated, and plain-language. You'll get a signed PDF for your records the moment you submit.",
    cta: "Review & sign",
  },
  {
    href: "/onboarding/intake",
    step: "Step 2",
    title: "Intake Questionnaire",
    blurb:
      "Then tell us about your business: the shared foundation plus the part(s) of the Method you've engaged. Short on time? Save and we'll email you a private link to finish later.",
    cta: "Start the intake",
  },
];

export default function OnboardingPage() {
  return (
    <>
      <Section className="pt-28 md:pt-36">
        <div className="max-w-measure">
          <p className="eyebrow mb-4">New client onboarding</p>
          <h1 className="text-h1 font-semibold text-ink">Welcome aboard.</h1>
          <p className="mt-5 text-body-lg text-body">
            Two short steps to get us started, and an optional NDA if you want one in place first.
            Everything is completed online and signed electronically; a copy of each document is
            emailed to you and saved to your secure client area.
          </p>
        </div>


        {/*
          Confidentiality, said plainly and said first.

          An owner is about to hand over the P&L, the customer list and the
          things that keep them up at night. That is the moment the worry is
          loudest, so this sits above the two steps rather than in a policy page
          nobody opens. Every promise here is one the signed documents actually
          make: Clause 8 (Confidentiality) and Clause 9 (Data Protection &
          Security) of the New Customer Agreement, and the mutual NDA.
        */}
        <div className="mt-12 rounded-lg border border-line border-l-4 border-l-maroon bg-surface p-8">
          <p className="eyebrow mb-3">Before you share anything</p>
          <h2 className="text-h3 font-semibold text-ink">
            Your numbers stay yours. In writing, not just in principle.
          </h2>
          <p className="mt-4 max-w-measure text-body text-body">
            The work only happens if you can hand over real figures, so confidentiality is written
            into the documents you sign, not left to good manners. If something here is not what you
            need, say so before you sign and we will change it.
          </p>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2">
            {promises.map((p) => (
              <li key={p.h} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" aria-hidden="true" />
                <span>
                  <strong className="text-small font-semibold text-ink">{p.h}</strong>
                  <span className="mt-1 block text-small leading-relaxed text-muted">{p.p}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-7 border-t border-line pt-5 text-small text-muted">
            The full terms are in Clause 8 (Confidentiality) and Clause 9 (Data Protection &amp;
            Security) of the{" "}
            <Link href="/onboarding/agreement" className="link-inline">
              New Customer Agreement
            </Link>
            , and in the{" "}
            <Link href="/onboarding/nda" className="link-inline">
              mutual NDA
            </Link>
            . Both can be read unsigned before you commit to anything.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col justify-between rounded-lg border border-line bg-paper p-8 transition-all hover:border-maroon hover:shadow-sm"
            >
              <div>
                <p className="eyebrow mb-3">{s.step}</p>
                <h2 className="text-h3 font-semibold text-ink group-hover:text-maroon">{s.title}</h2>
                <p className="mt-4 text-body text-muted">{s.blurb}</p>
              </div>
              <p className="mt-8 text-small font-semibold text-maroon">
                {s.cta}{" "}
                <span className="inline-block transition-transform duration-fast group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <PreStartQuestions />
        </div>

        <p className="mt-10 max-w-measure text-small text-muted">
          Already a client? Everything we&apos;ve shared with you lives in{" "}
          <Link href="/portal" className="link-inline">
            your client portal
          </Link>
          . Questions? Email{" "}
          <a href="mailto:hello@aperturemethod.com" className="link-inline">
            hello@aperturemethod.com
          </a>
          .
        </p>
      </Section>
    </>
  );
}
