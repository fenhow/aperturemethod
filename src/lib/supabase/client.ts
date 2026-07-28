"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

/**
 * Browser-side Supabase client (used in client components for auth + storage).
 * Access is enforced server-side by Row-Level Security, so the anon key here is
 * safe to expose.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
