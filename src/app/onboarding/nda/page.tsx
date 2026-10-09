import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { pageMeta } from "@/lib/seo";
import { ndaMeta } from "@/lib/onboarding/content";
import { NdaForm } from "@/components/onboarding/NdaForm";

export const metadata: Metadata = pageMeta({
  title: "Mutual Non-Disclosure Agreement",
  description:
    "A two-way NDA you can sign before sharing anything. Both parties are bound on the same terms. A signed PDF is emailed to you and saved to your secure client area.",
  path: "/onboarding/nda",
});

export default function NdaPage() {
  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow mb-3">
          <Link href="/onboarding" className="hover:text-maroon-hover">
            ← Onboarding
          </Link>
        </p>
        <h1 className="text-h1 font-semibold text-ink">{ndaMeta.title}</h1>
        <p className="mt-4 text-body-lg text-body">{ndaMeta.subtitle}</p>
        <div className="mt-5 rounded-sm border border-line bg-surface p-5 text-small text-muted">
          {ndaMeta.template}
        </div>
        <div className="mt-10">
          <NdaForm />
        </div>
      </div>
    </Section>
  );
}
