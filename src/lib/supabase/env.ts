/**
 * Supabase configuration, read from environment. Kept in one place so the whole
 * portal can gracefully show a "being set up" state until these are set on
 * Vercel — and so the site still builds with them absent.
 *
 * Set in Vercel → Project → Settings → Environment Variables:
 *   NEXT_PUBLIC_SUPABASE_URL       — your project URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  — the public anon key (safe for the browser)
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True only when both values are present, so pages can degrade gracefully. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
