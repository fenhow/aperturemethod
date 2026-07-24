import type { Metadata } from "next";
import { LegalShell, LegalH2, LegalP } from "@/components/legal/Legal";
import { pageMeta } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use",
  description:
    "The terms that govern your use of The Aperture Method website and its content.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms of Use"
      updated="July 2026"
      intro="These terms govern your use of this website. By using the site, you agree to them."
    >
      <LegalH2>About this site</LegalH2>
      <LegalP>
        This website is operated by {siteConfig.legalName}. It provides information about our services
        and lets you get in touch. It is not an offer of professional services, and using it does not
        create a client relationship — that begins only under a separate written engagement.
      </LegalP>

      <LegalH2>Use of content</LegalH2>
      <LegalP>
        The content on this site — including text, design, graphics, The Aperture Method name and
        logo, and our published frameworks — is owned by {siteConfig.legalName} or its licensors and
        is protected by intellectual-property laws. You may view and share it for personal,
        non-commercial reference with attribution. You may not copy, republish, or use it
        commercially without our written permission.
      </LegalP>

      <LegalH2>No professional advice</LegalH2>
      <LegalP>
        The information and articles on this site are general in nature and provided for education,
        not as specific business, financial, legal, or tax advice. Every business is different; you
        should not act on general content without advice suited to your situation.
      </LegalP>

      <LegalH2>Links to other sites</LegalH2>
      <LegalP>
        We may link to third-party websites for convenience. We do not control them and are not
        responsible for their content, products, or practices.
      </LegalP>

      <LegalH2>Disclaimers and liability</LegalH2>
      <LegalP>
        The site is provided &ldquo;as is,&rdquo; without warranties of any kind. To the fullest
        extent permitted by law, {siteConfig.legalName} is not liable for any loss arising from your
        use of, or reliance on, the site or its content.
      </LegalP>

      <LegalH2>Changes</LegalH2>
      <LegalP>
        We may update these terms from time to time. Changes take effect when posted here, and the
        &ldquo;last updated&rdquo; date will reflect them.
      </LegalP>

      <LegalH2>Contact</LegalH2>
      <LegalP>
        Questions about these terms? Email{" "}
        <a href={`mailto:${siteConfig.email}`} className="link-inline">
          {siteConfig.email}
        </a>
        .
      </LegalP>
    </LegalShell>
  );
}
