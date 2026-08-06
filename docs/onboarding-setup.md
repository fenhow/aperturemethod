# Client Onboarding — setup

Online, fill-in-the-browser **Client Intake Form** and **New Customer Agreement**,
modeled on the Guardian/Tezelate NDA flow. Clients complete them at
`/onboarding`, e-sign (draw or type), and on submit we generate a signed PDF,
email it to the client and to Fenwick, and — when Supabase is configured — save
it to the client's secure area in the portal, tied to their email.

## Routes

- `/onboarding` — hub with the two steps (linked from the header utility strip
  "New client" and the footer "Get Started" column).
- `/onboarding/intake` — Client Intake Form.
- `/onboarding/agreement` — New Customer Agreement (full terms + Exhibit A).
- `POST /api/onboarding` — validates, builds the PDF, stores + emails, returns
  the PDF (base64) so the browser also offers an immediate download.

Content for both documents lives in `src/lib/onboarding/content.ts` — the web
page and the PDF render from that single source, so edits stay in sync.

## Database (run once)

The submissions table and the existing `documents` table/bucket power the portal
tie-in. Re-run the whole schema (idempotent):

```
Supabase → SQL Editor → paste supabase/schema.sql → Run
```

This adds `public.onboarding_submissions` (RLS: a client sees only their own; the
admin sees all). Signed PDFs are stored in the existing private `documents`
bucket under `<owner_id>/<uuid>.pdf` and linked via `documents.document_id`.

## Environment variables (Vercel → Settings → Environment Variables)

| Variable | Purpose | If unset |
| --- | --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Lets the API create the client's portal account, store the signed PDF, and write the submission row. | PDF + email still work; nothing is stored in the portal. |
| `RESEND_API_KEY` | Sends the signed PDF to the client and to Fenwick (via Resend's HTTP API). | Emails are skipped (logged); the client still gets the download. |
| `ONBOARDING_FROM_EMAIL` | Verified sender, e.g. `The Aperture Method <onboarding@aperturemethod.com>`. | Falls back to that address. |
| `ONBOARDING_NOTIFY_EMAIL` | Where owner notifications go. | Defaults to `fen@aperturemethod.com`. |

`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are already used by
the portal. The service-role key is **server-only** — never expose it to the
browser.

## How the portal tie-in works

On submit, the API (service role):
1. Finds the client's profile by email, or creates an auth user for that email
   (email confirmed, no password) so the profile exists.
2. Uploads the signed PDF into the client's `documents` folder and inserts a
   `documents` row (so it appears in `/portal`).
3. Writes an `onboarding_submissions` record (answers, signature type, IP,
   timestamp, user agent) for your records.
4. Emails the signed PDF to the client and to Fenwick.

The client later signs in at `/portal` with the same email (magic link) and sees
the document. Everything degrades gracefully: with no service-role key, the flow
still generates and emails the PDF.

## Legal note

The agreement is a business template, not legal advice. Have a licensed attorney
review it before use. Bracketed `[ ]` items in `content.ts` are defaults you can
edit per engagement (deposit %, notice periods, governing state/county, etc.).
