# Aperture Method™ — Website

The official website for Aperture Method™, built to the approved brand, strategy, IA, design system, and technical specification.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · deploys on Vercel · CMS-ready for Sanity.

---

## Requirements

- **Node.js ≥ 18.18** (Node 20 LTS recommended)
- npm (or pnpm/yarn — commands below use npm)

## Install

```bash
cd aperture-website
npm install
cp .env.example .env.local   # then edit values as needed
```

## Run (development)

```bash
npm run dev
```

Open **http://localhost:3000** — you should see the dark "Foundation ready" screen with the APERTURE METHOD wordmark.

## Test / verify

```bash
npm run typecheck   # TypeScript, no errors
npm run lint        # ESLint (next/core-web-vitals)
npm run build       # production build must succeed
npm run start       # serve the production build locally
```

---

## Project structure

```
aperture-website/
├── src/
│   ├── app/                 # App Router: routes, layouts, metadata
│   │   ├── layout.tsx       # Root layout: fonts, <main>, skip link, base metadata
│   │   ├── page.tsx         # Homepage (placeholder until Stage 5)
│   │   └── globals.css      # Tailwind + base layer (tokens expand in Stage 2)
│   ├── components/          # Reusable UI (added from Stage 3 onward)
│   └── lib/
│       └── site.ts          # Site config + navigation (CMS-ready source of truth)
├── public/                  # Static assets (logos, images — added later)
├── tailwind.config.ts       # Brand palette + container (full tokens in Stage 2)
├── next.config.mjs          # Security headers, image formats
├── tsconfig.json            # Strict TS, @/* → src/*
└── .env.example             # Environment variables (copy to .env.local)
```

## Build plan (15 stages)

1. **Project foundation** ← _you are here_
2. Global design tokens
3. Header & navigation
4. Footer
5. Homepage (rotating hero)
6. The Aperture Method page
7. Capabilities (What We Do)
8. Industries + case studies
9. About & Founder
10. Insights
11. Contact & consultation forms
12. SEO, Open Graph & structured data
13. Accessibility review
14. Performance review
15. Final QA

## Notes

- **Fonts:** Inter (self-hosted via `next/font`) stands in for Graphik — the approved legal near-match. Swap to a licensed Graphik web font via `next/font/local` later; everything reads the `--font-sans` variable, so no other change is needed.
- **No competitor code or content.** All original.
