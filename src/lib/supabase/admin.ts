import "server-only";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

/**
 * Service-role Supabase client — SERVER ONLY. Bypasses Row-Level Security, so it
 * is used exclusively inside route handlers to write onboarding records and
 * store signed PDFs under a client's portal folder. Never import this into a
 * client component.
 *
 * Set SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables
 * (Server only). Until it's set, `serviceRoleConfigured` is false and the
 * onboarding pipeline degrades gracefully (still generates the PDF + emails).
 */
const SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

export const serviceRoleConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

export function createAdminClient(): SupabaseClient {
  if (!serviceRoleConfigured) {
    throw new Error("Supabase service role is not configured.");
  }
  return createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
