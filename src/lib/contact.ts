/**
 * Contact / consultation form contract (Step 13). Shared by the client form and
 * the server route handler so validation rules live in exactly one place and the
 * shape is trivial to move into HubSpot / a serverless handler later.
 */

export const inquiryTypes = ["Consultation", "Partnership", "Media", "Something else"] as const;
export type InquiryType = (typeof inquiryTypes)[number];

export const industryOptions = [
  "Industrial & Manufacturing",
  "Retail & Consumer",
  "Professional Services",
  "Healthcare",
  "Other",
] as const;

export const revenueOptions = [
  "Under $1M",
  "$1–5M",
  "$5–10M",
  "$10–20M",
  "$20M+",
  "Prefer not to say",
] as const;

export const timelineOptions = [
  "Just exploring",
  "Next 1–3 months",
  "3–6 months",
  "Not sure",
] as const;

export type ContactPayload = {
  inquiryType: InquiryType;
  name: string;
  email: string;
  company: string;
  challenge: string;
  role?: string;
  industry?: string;
  revenue?: string;
  timeline?: string;
  referral?: string;
  newsletter?: boolean;
  /** Honeypot: must be empty. Bots fill it; humans never see it. */
  website?: string;
  /**
   * Which page the enquiry came from, e.g. "website:/onboarding". Set by the
   * form, validated server-side, and used only to route attention: a question
   * asked mid-onboarding is more urgent than a general enquiry.
   */
  source?: string;
};

/** The fields that can carry a validation error. */
export type ContactErrors = Partial<
  Record<"name" | "email" | "company" | "challenge", string>
>;

// RFC-lite: good enough to catch typos without rejecting valid, unusual addresses.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate the four required fields. Consultation-specific optionals are never
 * required. Returns a map of field -> message; empty means valid.
 */
export function validateContact(data: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  if (!data.name?.trim()) errors.name = "Please enter your name.";
  if (!data.email?.trim() || !EMAIL_RE.test(data.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!data.company?.trim()) errors.company = "Please enter your company name.";
  if (!data.challenge?.trim())
    errors.challenge = "Tell us a little about what you're working on.";
  return errors;
}

export const PRIVACY_LINE =
  "By submitting, you agree we may use your details to respond to your enquiry, in line with our Privacy Policy. We don't sell or share your information.";
