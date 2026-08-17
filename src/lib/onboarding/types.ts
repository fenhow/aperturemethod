/**
 * Shared contract for the onboarding forms, used by the client components and
 * the server route so validation lives in one place.
 */
import type { OnboardingKind } from "./content";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignaturePayload = {
  /** "draw" carries a PNG data URL; "type" carries the typed name string. */
  type: "draw" | "type";
  data: string;
};

export type OnboardingPayload = {
  kind: OnboardingKind;
  /** Flat map of every answered field (intake) or fill-in (agreement). */
  answers: Record<string, string>;
  /** Signer identity (used to name/route the document and the portal record). */
  signerName: string;
  signerTitle?: string;
  signerEmail: string;
  company: string;
  signature: SignaturePayload;
  consent: boolean;
  /** Intake only: Method segment keys the client is engaging (e.g. ["insights"]). */
  segments?: string[];
  /** Intake only: resume-draft token to mark complete on submit. */
  draftToken?: string;
  /** Honeypot: must be empty. */
  website?: string;
  /**
   * Unsigned reading copy. Never stored, never emailed, never counted as
   * executed: the PDF is stamped on every page so a draft can never be passed
   * off as a signed agreement.
   */
  draft?: boolean;
};

export type OnboardingErrors = Record<string, string>;

export function validateOnboarding(p: Partial<OnboardingPayload>): OnboardingErrors {
  const e: OnboardingErrors = {};
  if (p.kind !== "intake" && p.kind !== "agreement") e.kind = "Unknown form.";
  if (!p.signerName?.trim()) e.signerName = "Please enter your full name.";
  if (!p.signerEmail?.trim() || !EMAIL_RE.test(p.signerEmail.trim()))
    e.signerEmail = "Please enter a valid email address.";
  if (!p.company?.trim()) e.company = "Please enter your company / legal name.";
  if (p.kind === "agreement" && !p.signerTitle?.trim())
    e.signerTitle = "Please enter your title.";
  if (p.kind === "intake" && (!p.segments || p.segments.length === 0))
    e.segments = "Please choose at least one part of the Method to complete.";
  if (!p.signature || !p.signature.data?.trim())
    e.signature = "Please add your signature.";
  if (!p.consent) e.consent = "Please confirm the statement to continue.";
  return e;
}

/** Human label for each kind, used in filenames, emails, and the PDF header. */
export const KIND_LABEL: Record<OnboardingKind, string> = {
  intake: "Client Intake Form",
  agreement: "New Customer Agreement",
};
