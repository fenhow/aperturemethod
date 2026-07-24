import type { Metadata } from "next";
import { LegalShell, LegalH2, LegalP, LegalUL } from "@/components/legal/Legal";
import { pageMeta } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Accessibility Statement",
  description:
    "The Aperture Method is committed to making this website usable for everyone. Here's what we've done and how to reach us.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Accessibility Statement"
      updated="July 2026"
      intro="We want everyone to be able to use this site, whatever device or assistive technology they rely on. Accessibility is part of how we build, not an afterthought."
    >
      <LegalH2>Our standard</LegalH2>
      <LegalP>
        We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These
        guidelines explain how to make web content more accessible to people with a wide range of
        abilities.
      </LegalP>

      <LegalH2>What we&apos;ve done</LegalH2>
      <LegalUL
        items={[
          "Full keyboard operability, a visible focus indicator, and a skip-to-content link.",
          "Semantic headings and landmarks so screen readers can navigate the page.",
          "Color combinations checked to meet AA contrast, with meaning never conveyed by color alone.",
          "Labelled form fields with clear, announced error messages.",
          "Text that reflows and scales on phones, tablets, and desktops without loss of content.",
          "Respect for the “reduce motion” setting, including a pause control on the homepage.",
        ]}
      />

      <LegalH2>Ongoing work</LegalH2>
      <LegalP>
        Accessibility is never finished. We test as we build and review the site periodically. If any
        part falls short, we treat it as a bug to fix.
      </LegalP>

      <LegalH2>Tell us</LegalH2>
      <LegalP>
        If you run into a barrier on this site, or need information in a different format, please
        email{" "}
        <a href={`mailto:${siteConfig.email}`} className="link-inline">
          {siteConfig.email}
        </a>
        . Tell us the page and the problem, and we&apos;ll work to fix it and get you what you need.
      </LegalP>
    </LegalShell>
  );
}
