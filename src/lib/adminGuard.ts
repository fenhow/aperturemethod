import "server-only";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

/**
 * The admin check, shared by admin pages and admin-only route handlers.
 * Same rule as /admin: signed in AND profiles.role = 'admin'.
 */
export type AdminCheck =
  | { state: "unconfigured" }
  | { state: "login" }
  | { state: "denied"; email: string }
  | { state: "ok"; email: string };

export async function checkAdmin(): Promise<AdminCheck> {
  if (!supabaseConfigured) return { state: "unconfigured" };
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { state: "login" };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return { state: "denied", email: user.email ?? "" };
  return { state: "ok", email: user.email ?? "" };
}
