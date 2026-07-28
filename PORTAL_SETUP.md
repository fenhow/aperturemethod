# Client Portal — Setup

The portal (`/portal`) and admin area (`/admin`) are built and deployed, but they
stay in a "being set up" state until you connect a free Supabase project. This is
a one-time setup, ~15 minutes. You never share your password with anyone, and I
never see your keys — you paste them into Vercel yourself.

## 1. Create a Supabase project

1. Go to https://supabase.com and sign up (free).
2. Create a new project. Pick a strong database password (save it) and a region
   near you. Wait ~2 minutes for it to provision.

## 2. Create the tables, security rules, and storage

1. In the project, open **SQL Editor → New query**.
2. Open `supabase/schema.sql` from this repo, copy all of it, paste it in, and
   click **Run**. You should see "Success." This creates the `profiles` and
   `documents` tables, a private `documents` storage bucket, and the Row-Level
   Security rules that keep each client's files private.

## 3. Point Supabase auth at your site

In **Authentication → URL Configuration**:

- **Site URL:** `https://aperturemethod.com`
- **Redirect URLs** — add both:
  - `https://aperturemethod.com/auth/callback`
  - `http://localhost:3000/auth/callback` (for local testing)

Email sign-in (magic link) is on by default — nothing else to enable.

## 4. Add your keys to Vercel

In Supabase, go to **Project Settings → API** and copy:

- **Project URL**
- **anon / public** key (this one is safe for the browser)

In Vercel (your project → **Settings → Environment Variables**), add these two
for the Production environment, then **Redeploy**:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | the Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon public key |

## 5. Make yourself the admin

1. After the redeploy, go to `https://aperturemethod.com/portal/login`, enter
   your email, and click the link Supabase emails you. This creates your account.
2. Back in Supabase **SQL Editor**, run (with your email):

   ```sql
   update public.profiles set role = 'admin' where email = 'you@aperturemethod.com';
   ```

3. Now visit `https://aperturemethod.com/admin` — you'll see the admin dashboard.

## 6. Add a client and share documents

1. Ask the client to go to `https://aperturemethod.com/portal`, enter their
   email, and click their sign-in link once. That creates their account.
   (Or invite them from Supabase **Authentication → Users → Invite**.)
2. In `/admin`, they now appear in the "Assign to" list. Upload a file, choose
   the client, and click **Upload**. It shows up in *their* portal only.
3. Your own private files: choose **My private documents** when uploading.

## How the security works

- Every file lives in a **private** storage bucket, in a folder named after the
  owner's user id.
- Row-Level Security means a signed-in client can read **only** their own files;
  the database enforces this, not the UI.
- Downloads use short-lived signed links (they expire after ~1 minute).
- The `/portal` and `/admin` routes are protected by middleware and are set to
  `noindex`, so they won't show up in search engines.

## Good to know

- **Email deliverability:** Supabase's built-in email is fine for testing but
  rate-limited. For production, add a custom SMTP sender (e.g. Resend) under
  **Authentication → Emails → SMTP Settings** so sign-in links arrive reliably.
- **Storage limit:** the free tier includes 1 GB of file storage; paid tiers add
  more when you need it.
- Nothing here charges you automatically — the free tier is enough to start.
