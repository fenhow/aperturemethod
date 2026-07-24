"use client";

import Script from "next/script";

/**
 * Google Analytics 4 with Consent Mode v2.
 *
 * Renders nothing unless NEXT_PUBLIC_GA4_ID is set, so the site ships clean and
 * analytics only turn on once you add the measurement ID in Vercel. Storage is
 * denied by default; src/lib/consent.ts flips it to "granted" when the visitor
 * opts in through the cookie banner.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
