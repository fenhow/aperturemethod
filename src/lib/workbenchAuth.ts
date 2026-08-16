import "server-only";
import { cookies } from "next/headers";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";

/**
 * Authorisation for the workbench engagement API.
 *
 * The workbench is served inside the Method Lab, which is gated by a passphrase
 * rather than by Supabase auth — so the API reuses exactly that gate. Middleware
 * already blocks /method-lab/*, but these routes live under /api and must check
 * for themselves: an API that trusts the page in front of it is not gated at all.
 */
export async function workbenchAuthorised(): Promise<boolean> {
  const jar = await cookies();
  return hasMethodLabAccess(jar.get(METHOD_LAB_COOKIE)?.value);
}
