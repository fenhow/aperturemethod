import type { Metadata } from "next";
import { LegalShell, LegalH2, LegalP, LegalUL } from "@/components/legal/Legal";
import { pageMeta } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "How The Aperture Method collects, uses, and protects the information you share with us, and the choices you have.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      updated="July 2026"
      intro="This policy explains what information The Aperture Method™ collects, why, and the choices you have. We collect as little as possible, use it only to help you, and never sell it."
    >
      <LegalH2>Information we collect</LegalH2>
      <LegalP>
        We collect information you give us directly and a small amount of technical information
        collected automatically when you use the site.
      </LegalP>
      <LegalUL
        items={[
          "Details you submit through our contact or consultation forms: your name, work email, company, role, and what you tell us about your business.",
          "If you subscribe to Insights, your email address.",
          "Standard technical data such as your browser type, device, and pages visited, gathered through privacy-respecting analytics.",
        ]}
      />

      <LegalH2>How we use it</LegalH2>
      <LegalP>
        We use your information to respond to your enquiry, schedule and prepare for a conversation,
        send the Insights emails you asked for, and improve the site. We do not use it for automated
        decisions that affect you, and we do not sell or rent it to anyone.
      </LegalP>

      <LegalH2>How we share it</LegalH2>
      <LegalP>
        We share information only with the service providers that help us operate, for example, our
        email, scheduling, and analytics tools, and only as needed to provide those services. Those
        providers are bound to protect your information. We may also disclose information if required
        by law.
      </LegalP>

      <LegalH2>Recorded calls</LegalH2>
      <LegalP>
        We may record introductory and consultation calls so we can focus on the conversation instead
        of note-taking. We&apos;ll always tell you at the start of a call if it&apos;s being recorded,
        and we&apos;ll stop if you ask. Recordings are used only for our internal reference, kept on a
        least-access basis, and never sold or shared beyond the service providers that help us operate.
      </LegalP>

      <LegalH2>Cookies and analytics</LegalH2>
      <LegalP>
        We use a small number of cookies and similar technologies to make the site work and to
        understand, in aggregate, how it is used. You can control non-essential cookies through the
        consent banner and your browser settings.
      </LegalP>

      <LegalH2>Data retention and security</LegalH2>
      <LegalP>
        We keep your information only as long as needed for the purpose it was collected, then delete
        or anonymize it. We use reasonable technical and organizational measures to protect it,
        though no method of transmission or storage is completely secure.
      </LegalP>

      <LegalH2>Your choices</LegalH2>
      <LegalUL
        items={[
          "Ask us what information we hold about you, and request a copy.",
          "Ask us to correct or delete your information.",
          "Unsubscribe from Insights at any time using the link in every email.",
          "Adjust or withdraw your cookie consent whenever you like.",
        ]}
      />

      <LegalH2>Contact</LegalH2>
      <LegalP>
        For any privacy question or request, email{" "}
        <a href={`mailto:${siteConfig.email}`} className="link-inline">
          {siteConfig.email}
        </a>
        . We aim to respond within one business day.
      </LegalP>

      <LegalP>
        This policy is provided for general information and may be updated as our practices or the law
        evolve. Material changes will be reflected in the &ldquo;last updated&rdquo; date above.
      </LegalP>
    </LegalShell>
  );
}
