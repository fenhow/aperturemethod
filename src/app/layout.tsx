import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/lib/site";
import { OG_IMAGE, ldOrganization, ldWebsite } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

/**
 * Typography (design system §1). The brand face is Graphik (licensed); the
 * approved legal near-match is Inter. We self-host Inter Variable (latin
 * subset, weights 300–600) via next/font/local — zero external requests, zero
 * layout shift (next/font injects a size-adjusted fallback automatically).
 *
 * To switch to licensed Graphik later: drop the Graphik woff2 files into
 * ./fonts and point `src` at them. Nothing else changes — every style reads
 * the `--font-sans` variable.
 */
const sans = localFont({
  src: "./fonts/InterVariable.woff2",
  weight: "300 600",
  display: "swap",
  variable: "--font-sans",
});

const ogTitle = `${siteConfig.name} — ${siteConfig.positioningLine}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: ogTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  keywords: [
    "business analytics consulting",
    "AI for small business",
    "fractional analytics",
    "owner-run business strategy",
    "family business consulting",
    "data-driven decisions",
  ],
  authors: [{ name: siteConfig.founder }],
  creator: siteConfig.founder,
  publisher: siteConfig.legalName,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: ogTitle,
    description: siteConfig.description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: siteConfig.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable}>
      <head>
        {/* Without JavaScript, scroll-reveal elements must not stay hidden. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={[ldOrganization(), ldWebsite()]} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
