/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Modern formats for better Core Web Vitals. Remote CMS/image hosts
    // (e.g. Sanity's cdn) will be added to `remotePatterns` in a later stage.
    formats: ["image/avif", "image/webp"],
    // Cache optimized image variants for a year (they're keyed by source + params).
    minimumCacheTTL: 31536000,
    // Trim the generated variant set to the breakpoints we actually use.
    deviceSizes: [360, 640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  // Emit a Vary header so compression is negotiated per client (gzip/br).
  compress: true,
  async headers() {
    // Baseline security headers. Content-Security-Policy is added in the SEO/
    // hardening stage once all third-party origins (analytics, consent, CMS,
    // scheduler) are known.
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      // Enforce HTTPS for a year (the site is always served over TLS on Vercel).
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      },
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Fingerprinted/versioned static media in /public — cache hard.
        source: "/:all*(png|jpg|jpeg|webp|avif|svg|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
