import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { methodLabConfigured } from "@/lib/methodLab";
import { MethodLabForm } from "./MethodLabForm";

export const metadata: Metadata = {
  title: "Method Lab",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function MethodLabEnterPage() {
  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-md">
        <p className="eyebrow mb-4">Confidential</p>
        <h1 className="text-h1 font-semibold text-ink">Method Lab</h1>

        {!methodLabConfigured ? (
          <p className="mt-6 rounded-lg border border-line bg-surface p-5 text-body text-muted">
            This area is being set up and isn&apos;t available yet.
          </p>
        ) : (
          <>
            <p className="mt-4 text-body text-muted">
              This area is private. Enter the passphrase you were given to continue.
            </p>
            <MethodLabForm />
            <p className="mt-8 text-caption text-muted">
              Access is granted by invitation and can be withdrawn at any time. Please don&apos;t
              forward the passphrase or the link.
            </p>
          </>
        )}
      </div>
    </Section>
  );
}
