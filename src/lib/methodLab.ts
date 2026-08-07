/**
 * Method Lab — a passphrase gate for the confidential Agent Workflow Map at
 * /method-lab.
 *
 * Deliberately independent of Supabase: the middleware short-circuits when
 * Supabase isn't configured, so this gate must not sit behind that branch.
 * Everything here uses Web Crypto so it runs in the Edge middleware runtime
 * and in Node route handlers unchanged.
 *
 * Revoking access = change METHOD_LAB_PASSWORD and redeploy. Every cookie
 * issued under the old value stops validating immediately, because the cookie
 * holds a hash derived from the passphrase itself.
 */

export const METHOD_LAB_COOKIE = "am_ml";

/** 30 days, in seconds. */
export const METHOD_LAB_MAX_AGE = 60 * 60 * 24 * 30;

export const methodLabPassword = process.env.METHOD_LAB_PASSWORD ?? "";

/** A short or missing passphrase disables the area entirely — fail closed. */
export const methodLabConfigured = methodLabPassword.trim().length >= 8;

/** Non-reversible token derived from the passphrase. Stored in the cookie. */
export async function methodLabToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`aperture-method-lab:v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Length-safe, branch-free comparison of two hex digests. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True when the supplied passphrase matches the configured one. */
export async function isValidPassphrase(candidate: string): Promise<boolean> {
  if (!methodLabConfigured) return false;
  const [given, expected] = await Promise.all([
    methodLabToken(candidate),
    methodLabToken(methodLabPassword),
  ]);
  return safeEqual(given, expected);
}

/** True when a cookie value still matches the configured passphrase. */
export async function hasMethodLabAccess(cookieValue?: string): Promise<boolean> {
  if (!methodLabConfigured || !cookieValue) return false;
  const expected = await methodLabToken(methodLabPassword);
  return safeEqual(cookieValue, expected);
}

/** Files served through the gated download route. Keys keep URLs tidy. */
export const METHOD_LAB_FILES: Record<string, { file: string; type: string; name: string }> = {
  sops: {
    file: "The Aperture Method - Method SOPs.pdf",
    type: "application/pdf",
    name: "The Aperture Method - Method SOPs.pdf",
  },
  spec: {
    file: "01 Aperture Method - Agent Build Spec.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "01 Aperture Method - Agent Build Spec.docx",
  },
  specpdf: {
    file: "01 Aperture Method - Agent Build Spec.pdf",
    type: "application/pdf",
    name: "01 Aperture Method - Agent Build Spec.pdf",
  },
  map: {
    file: "02 Aperture Method - Agent Workflow Map.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "02 Aperture Method - Agent Workflow Map.docx",
  },
  mappdf: {
    file: "02 Aperture Method - Agent Workflow Map.pdf",
    type: "application/pdf",
    name: "02 Aperture Method - Agent Workflow Map.pdf",
  },
};
