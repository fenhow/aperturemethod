# Deploying The Aperture Method

Next.js 14 (App Router). Deploys to Vercel with zero build config.

## 1. Push to GitHub

The repo is already initialized with an initial commit. Create an empty repo on
GitHub, then:

```bash
git remote add origin https://github.com/<you>/aperture-website.git
git branch -M main
git push -u origin main
```

## 2. Import to Vercel

1. vercel.com → Add New → Project → import the repo.
2. Framework preset auto-detects **Next.js**. Leave build/output settings default.
3. Add the environment variables below (Settings → Environment Variables).
4. Deploy. You get a live `*.vercel.app` URL to test.

## 3. Environment variables

See `.env.example`. The ones that matter for launch:

| Variable | Purpose | Launch-critical? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonicals, sitemap, OG tags. Set to `https://aperturemethod.com` | Yes |
| `CONTACT_WEBHOOK_URL` | Where contact-form submissions are delivered | Yes — forms are silent without it |
| `NEWSLETTER_WEBHOOK_URL` | Where newsletter signups are delivered | Yes — signups are silent without it |
| `NEXT_PUBLIC_SCHEDULER_URL` | Calendly link (falls back to hardcoded) | Optional |
| `NEXT_PUBLIC_GA4_ID` | Analytics measurement ID | Recommended |

## 4. Point the domain (aperturemethod.com)

1. Vercel project → Settings → Domains → add `aperturemethod.com` and `www.aperturemethod.com`.
2. Vercel shows the exact records. At your registrar, either:
   - **A record** for the apex `@` → `76.76.21.21`, and **CNAME** `www` → `cname.vercel-dns.com`; or
   - Switch the domain's **nameservers** to Vercel's (Vercel will list them).
3. SSL is issued automatically once DNS resolves (usually minutes, up to ~48h).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build                # production build
```

## Pre-launch checklist

- [ ] Set `NEXT_PUBLIC_SITE_URL`, `CONTACT_WEBHOOK_URL`, `NEWSLETTER_WEBHOOK_URL` in Vercel
- [ ] Real LinkedIn URL in `src/lib/site.ts` (footer)
- [ ] Confirm `hello@aperturemethod.com` receives mail
- [ ] Calendly event Location = Google Meet
- [ ] Replace placeholder photo slots (register in `src/lib/slot-images.ts`)
- [ ] Add spam protection to forms (Turnstile/hCaptcha)
- [ ] Add analytics measurement ID
