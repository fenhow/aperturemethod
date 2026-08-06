import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { pageMeta } from "@/lib/seo";
import { agreementMeta } from "@/lib/onboarding/content";
import { AgreementForm } from "@/components/onboarding/AgreementForm";

export const metadata: Metadata = pageMeta({
  title: "New Customer Agreement",
  description:
    "Review and electronically sign your Aperture Method services agreement. Fixed-fee, phase-gated, plain-language. A signed PDF is saved to your secure client area.",
  path: "/onboarding/agreement",
});

export default function AgreementPage() {
  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow mb-3">
          <Link href="/onboarding" className="hover:text-maroon-hover">
            ← Onboarding
          </Link>
        </p>
        <h1 className="text-h1 font-semibold text-ink">{agreementMeta.title}</h1>
        <p className="mt-4 text-body-lg text-body">{agreementMeta.subtitle}</p>
        <div className="mt-5 rounded-sm border border-line bg-surface p-5 text-small text-muted">
          {agreementMeta.template}
        </div>
        <div className="mt-10">
          <AgreementForm />
        </div>
      </div>
    </Section>
  );
}
