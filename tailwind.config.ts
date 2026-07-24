import type { Config } from "tailwindcss";

/**
 * Global design tokens (Stage 2) — the complete system from the approved
 * design spec (Step 5). Everything the site styles against lives here.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    // Centered container capped at 1280px with responsive gutters.
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", md: "3rem", lg: "4rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        ink: "#000000", // headings / key UI
        body: "#141414", // body text
        muted: "#6b6b6b", // captions, meta
        paper: "#ffffff", // primary background
        surface: "#f5f5f4", // subtle section fill
        dark: "#0a0a0a", // hero / footer bookends
        line: "#e6e6e6", // hairline borders
        maroon: {
          DEFAULT: "#500000", // the one accent
          hover: "#6a1414",
          light: "#8c2b2b", // lifted maroon for accents on dark
          soft: "#b5544f", // softest, for large type / non-text accents on dark
          onDark: "#c9756c", // AA-compliant (5.9:1) maroon for small text on dark
        },
        gray: {
          50: "#f7f7f7",
          100: "#f1f1f1",
          200: "#e6e6e6",
          300: "#c9c9c9",
          400: "#9a9a9a",
          500: "#767676", // AA on white for body-weight text
          600: "#5c5c5c",
          700: "#3d3d3d",
          800: "#1f1f1f",
          900: "#141414",
          950: "#0a0a0a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
      },
      // Semantic type scale. Headline sizes are fluid (clamp) so one class
      // covers the mobile→desktop range from the design spec.
      fontSize: {
        overline: ["0.8125rem", { lineHeight: "1", letterSpacing: "0.12em" }], // 13
        small: ["0.9375rem", { lineHeight: "1.5" }], // 15
        base: ["1.125rem", { lineHeight: "1.6" }], // 18 (body)
        "body-lg": ["1.25rem", { lineHeight: "1.55" }], // 20
        h4: ["clamp(1.1875rem, 1.1rem + 0.4vw, 1.375rem)", { lineHeight: "1.3", letterSpacing: "-0.015em" }], // 19→22
        h3: ["clamp(1.375rem, 1.2rem + 0.9vw, 1.75rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }], // 22→28
        h2: ["clamp(1.75rem, 1.3rem + 2vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }], // 28→40
        h1: ["clamp(2.125rem, 1.5rem + 3vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }], // 34→56
        display: ["clamp(2.5rem, 1.4rem + 5vw, 4.5rem)", { lineHeight: "1.03", letterSpacing: "-0.03em" }], // 40→72
      },
      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.02em",
        tight: "-0.015em",
        overline: "0.12em",
        wordmark: "0.04em",
      },
      spacing: {
        section: "clamp(3.5rem, 2rem + 6vw, 10rem)", // 56 → 160 vertical rhythm
        "section-sm": "clamp(3rem, 2rem + 4vw, 6rem)",
      },
      maxWidth: {
        container: "1280px",
        measure: "72ch",
        "measure-sm": "60ch",
      },
      borderRadius: {
        none: "0",
        sm: "5px", // buttons, inputs, chips
        DEFAULT: "8px", // cards, image containers
        md: "8px",
        lg: "12px", // larger cards / feature panels
        xl: "14px",
        "2xl": "16px", // the aperture panel
        full: "9999px", // circles / dots (unchanged)
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(0,0,0,0.04)",
        card: "0 1px 2px rgba(0,0,0,0.05)",
      },
      transitionDuration: {
        DEFAULT: "250ms",
        fast: "150ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "none" },
        },
        fade: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        fade: "fade 0.4s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
