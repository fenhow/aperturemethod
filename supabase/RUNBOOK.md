# Applying the migration & testing save-and-resume

Everything else is done. This is the last step, and it has to be you — it needs your
Supabase credentials, and this session has no network access to your project.

Budget about 20 minutes.

---

## Step 1 — Apply the migration

Supabase Dashboard → your project → **SQL Editor** → **New query** → paste the whole of
`aperture-website/supabase/migrations/0001_intake_drafts.sql` → **Run**.

It is safe to run against your existing tables and safe to run twice. The `ALTER` statements
are the important part: your tables were made by hand, and `create table if not exists`
skips them entirely, so without the ALTERs the new `expires_at` column never appears — and
the app now reads it. Miss this and every resume link returns "draft not found."

**Then run the verification query** at the bottom of the file (it's commented out — copy the
four-line `select` block). Every row must say `ok`.

If `token is uuid` comes back **NOT UUID**, stop and tell me. It would mean draft links are
guessable, and that's a privacy problem worth fixing before you send one to a client.

## Step 2 — Set the environment variables

Both places: `.env.local` for your machine, and Vercel → Project → Settings → Environment
Variables for production. `.env.example` now documents all of them.

| Variable | Where to find it | If missing |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL | Save/resume silently off |
| `NEXT_PUBLIC_SUPABASE_URL` | same value | same |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public | Client area breaks |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role — **server only, never `NEXT_PUBLIC_`** | Drafts off, submissions unstored |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | your mail provider | No resume links, no notifications |
| `NOTIFY_EMAIL` | your inbox | You're never told an intake arrived |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally, your domain in prod | Resume links point at the wrong host |

Check the mail relay at `/api/email-test` once SMTP is set.

## Step 3 — Test the loop

Run `npm run dev`, open `/onboarding/intake`.

1. **Type one answer and stop.** Within ~2 seconds you should see **"Saved. You can close
   this page and come back to it."** and the address bar should gain `?draft=<uuid>`.
   *This is the fix that matters most.* Before, nothing was saved until you clicked a button.
2. **Copy that URL, close the tab, reopen it.** Your answer should be there.
3. **Check Supabase** → Table Editor → `intake_drafts`. One row, `answers` populated,
   `completed` false.
4. **Enter your email, click "Save & finish later."** You should receive the resume link.
5. **Open the emailed link in a private window.** Answers repopulate.
6. **Break the network** (DevTools → Network → Offline) and keep typing. You should see
   **"Not saved to our server — your answers are being kept in this browser."** Go back
   online; it should recover to "Saved."
7. **Reload while offline.** Your answers should still be there — that's the local seatbelt.
8. **Submit the form.** `completed` flips to true, and the old resume link should now refuse
   to reopen it.

### The test that matters most

**Comment out `SUPABASE_SERVICE_ROLE_KEY`, restart, and fill in the form.**

This is the path where the app used to lie — it showed a success tick and claimed the intake
had been "emailed to you and saved to your secure client area" when neither had happened. It
should now tell the truth and push you to download the PDF. If it still claims delivery,
tell me.

---

## Known gaps I did not close

Worth knowing, none urgent:

- **The success dialog is honest but generic.** It no longer asserts delivery it can't
  confirm, but it also doesn't yet report *specifically* whether storage and email each
  succeeded. Wiring those two booleans through `submit.ts` → the API route → the dialog is a
  small job I'd rather do with the real response shape in front of me.
- **No optimistic concurrency.** Two tabs open on the same draft still last-write-wins on
  the whole answer blob. `updated_at` is now maintained by a trigger, so the fix is
  available — it just isn't wired up. Realistically low risk for a single owner filling in a
  form, but it's a real edge.
- **Draft endpoints aren't rate limited**, though `/api/onboarding` is. With genuine UUID
  tokens brute force is infeasible, so this is defence-in-depth rather than an open door.
- **Seven intake questions still feed nothing.** `atl_watch2` — "what report do you get that
  you don't read?" — is the sharpest design research in the Atlas section and it's currently
  discarded.
