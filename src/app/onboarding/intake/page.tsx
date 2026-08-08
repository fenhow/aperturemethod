import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { pageMeta } from "@/lib/seo";
import { intakeIntro, intakeClosing } from "@/lib/onboarding/intake";
import { FENWICK_SIGNATURE_B64 } from "@/lib/onboarding/logo";
import { IntakeForm } from "@/components/onboarding/IntakeForm";

export const metadata: Metadata = pageMeta({
  title: "Intake Questionnaire",
  description:
    "Where an engagement starts. Answer the shared foundation plus the part(s) of the Method you're doing. Save and resume any time; a copy is emailed to you and saved to your secure client area.",
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
        <h1 className="text-h1 font-semibold text-ink">{intakeIntro.title}</h1>
        <p className="mt-4 text-body-lg text-body">{intakeIntro.subtitle}</p>
        <p className="mt-4 text-body text-muted">{intakeIntro.lead}</p>

        {/* Fenwick's personal note + signature */}
        <div className="mt-8 rounded-lg border border-line bg-surface p-6">
          <p className="text-body text-body">{intakeClosing}</p>
          <div className="mt-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${FENWICK_SIGNATURE_B64}`}
              alt="Fenwick How signature"
              className="h-12 w-auto"
            />
            <div className="leading-tight">
              <p className="text-body font-semibold text-ink">Fenwick How</p>
              <p className="text-small text-muted">Founder · The Aperture Method™</p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <IntakeForm />
        </div>
      </div>
    </Section>
  );
}
