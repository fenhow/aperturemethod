import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { pageMeta } from "@/lib/seo";
import { intakeMeta } from "@/lib/onboarding/content";
import { IntakeForm } from "@/components/onboarding/IntakeForm";

export const metadata: Metadata = pageMeta({
  title: "Client Intake Form",
  description:
    "Tell us about your business so we can tailor your Business X-Ray. Completed online; a copy is saved to your secure client area.",
  path: "/onboarding/intake",
});

export default function IntakePage() {
  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow mb-3">
          <Link href="/onboarding" className="hover:text-maroon-hover">
            ← Onboarding
          </Link>
        </p>
        <h1 className="text-h1 font-semibold text-ink">{intakeMeta.title}</h1>
        <p className="mt-4 text-body-lg text-body">{intakeMeta.subtitle}.</p>
        <div className="mt-5 rounded-sm border border-line bg-surface p-5 text-body text-muted">
          <span className="font-semibold text-ink">Why we ask.</span> {intakeMeta.why}
        </div>
        <div className="mt-10">
          <IntakeForm />
        </div>
      </div>
    </Section>
  );
}
