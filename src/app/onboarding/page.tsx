import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "New Client Onboarding",
  description:
    "Welcome to The Aperture Method. Complete your client intake and sign your service agreement online. A copy is saved to your secure client area.",
  path: "/onboarding",
});

const steps = [
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
            Two short steps to get us started. Everything is completed online and signed
            electronically; a copy of each document is emailed to you and saved to your secure client
            area. Nothing you share is reused. See our data-handling standards.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
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
