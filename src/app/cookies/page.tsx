import type { Metadata } from "next";
import { LegalShell, LegalH2, LegalP, LegalUL } from "@/components/legal/Legal";
import { pageMeta } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Cookie Policy",
  description:
    "How The Aperture Method uses cookies and similar technologies, the categories we use, and how you can control them.",
  path: "/cookies",
});

const categories: { name: string; consent: string; purpose: string }[] = [
  {
    name: "Strictly necessary",
    consent: "No consent needed",
    purpose: "Make the site work: security, load balancing, and remembering your cookie choices.",
  },
  {
    name: "Functional",
    consent: "Consent required",
    purpose: "Remember preferences so the site behaves the way you expect.",
  },
  {
    name: "Analytics",
    consent: "Consent required",
    purpose: "Help us understand, in aggregate, how the site is used so we can improve it.",
  },
  {
    name: "Targeting / advertising",
    consent: "Consent required",
    purpose: "We do not currently use these. If that ever changes, we'll update this policy first.",
  },
];

export default function CookiesPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Cookie Policy"
      updated="July 2026"
      intro="This policy explains how The Aperture Method™ uses cookies and similar technologies. We keep them to a minimum, ask for your consent before setting anything non-essential, and never use them to sell your information."
    >
      <LegalH2>What cookies are</LegalH2>
      <LegalP>
        Cookies are small text files a website stores on your device. Similar technologies, like local
        storage and tracking pixels, do comparable things. Together they let a site remember your
        actions and preferences, and help its owner understand how it&apos;s used.
      </LegalP>

      <LegalH2>The categories we use</LegalH2>
      <LegalP>
        We group cookies into four categories. Only strictly necessary cookies are set automatically;
        everything else waits for your consent.
      </LegalP>

      <div className="mt-6 overflow-hidden rounded border border-line">
        <table className="w-full border-collapse text-left text-small">
          <thead>
            <tr className="bg-surface">
              <th className="border-b border-line px-4 py-3 font-semibold text-ink">Category</th>
              <th className="border-b border-line px-4 py-3 font-semibold text-ink">Consent</th>
              <th className="border-b border-line px-4 py-3 font-semibold text-ink">What it does</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.name} className="align-top">
                <td className="border-b border-line px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="border-b border-line px-4 py-3 text-muted">{c.consent}</td>
                <td className="border-b border-line px-4 py-3 text-muted">{c.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LegalH2>Third parties that may set cookies</LegalH2>
      <LegalP>
        As the site grows we may rely on trusted providers that set their own cookies when their
        features are enabled and you&apos;ve consented:
      </LegalP>
      <LegalUL
        items={[
          "Analytics: to measure site usage in aggregate (for example, Google Analytics).",
          "Customer and marketing tools: to manage enquiries and, if you opt in, our Insights emails (for example, HubSpot).",
          "Scheduling: if you book a call through an embedded scheduler (for example, Calendly).",
        ]}
      />
      <LegalP>
        Each provider handles data under its own privacy and cookie terms. We enable these only where
        they earn their place, and analytics and marketing cookies stay off until you allow them.
      </LegalP>

      <LegalH2>How to control cookies</LegalH2>
      <LegalUL
        items={[
          "Use our consent banner to accept or decline non-essential cookies, and change your mind at any time.",
          "Adjust or delete cookies through your browser settings. Most browsers let you block or clear them.",
          "We honor recognized browser signals such as Global Privacy Control where required.",
        ]}
      />
      <LegalP>
        Blocking strictly necessary cookies may stop parts of the site from working. Blocking the other
        categories won&apos;t break the site; you&apos;ll just see less-tailored functionality.
      </LegalP>

      <LegalH2>Changes and contact</LegalH2>
      <LegalP>
        We may update this policy as our use of cookies evolves; the &ldquo;last updated&rdquo; date
        above will reflect any change. Questions? Email{" "}
        <a href={`mailto:${siteConfig.email}`} className="link-inline">
          {siteConfig.email}
        </a>
        . See our Privacy Policy for how we handle personal information more broadly.
      </LegalP>
    </LegalShell>
  );
}
