import "server-only";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { sendEmail, emailConfigured } from "@/lib/email";
import { segmentByKey } from "./intake";

/**
 * Save-and-resume for the Intake Questionnaire, with no login. A draft is keyed
 * by an unguessable UUID token; whoever holds the token (via the emailed link)
 * can reopen it on any device. All reads/writes here use the service-role client
 * and are only reachable through the /api/intake/draft route.
 */

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://aperturemethod.com");

export type DraftInput = {
  token?: string;
  email?: string;
  company?: string;
  signerName?: string;
  segments?: string[];
  answers?: Record<string, string>;
  /** The personalised data request, recomputed on every save so it tracks their answers. */
  dataRequest?: unknown[];
};

export type DraftRecord = {
  token: string;
  email: string;
  company: string;
  signerName: string;
  segments: string[];
  answers: Record<string, string>;
  completed: boolean;
};

export const draftsEnabled = serviceRoleConfigured;

/** Create or update a draft; returns the token to persist client-side. */
export async function saveDraft(input: DraftInput): Promise<{ ok: boolean; token?: string; error?: string }> {
  if (!serviceRoleConfigured) return { ok: false, error: "not-configured" };
  const admin = createAdminClient();

  // Identity fields are only written when non-empty. Autosave sends them on every
  // keystroke, so blindly writing "" would wipe the email — the one thing that lets us
  // re-send a resume link — the moment the client clears that box.
  const row: Record<string, unknown> = {
    segments: input.segments ?? [],
    answers: input.answers ?? {},
    updated_at: new Date().toISOString(),
  };
  if (input.dataRequest) row.data_request = input.dataRequest;
  const email = (input.email ?? "").trim();
  const company = (input.company ?? "").trim();
  const signer = (input.signerName ?? "").trim();
  if (email) row.email = email;
  if (company) row.company = company;
  if (signer) row.signer_name = signer;

  try {
    if (input.token) {
      // .select() is load-bearing: PostgREST reports NO error when zero rows match, so
      // without it a stale, mistyped or already-submitted token returns a cheerful
      // success while every answer is silently discarded.
      const { data, error } = await admin
        .from("intake_drafts")
        .update(row)
        .eq("token", input.token)
        .eq("completed", false)
        .select("token");
      if (error) throw error;
      if (!data || data.length === 0) return { ok: false, error: "gone" };
      return { ok: true, token: input.token };
    }
    const { data, error } = await admin
      .from("intake_drafts")
      .insert(row)
      .select("token")
      .single();
    if (error) throw error;
    return { ok: true, token: data?.token as string };
  } catch (err) {
    console.error("[intake-draft] save failed:", err);
    return { ok: false, error: "save-failed" };
  }
}

/** Load a draft by token (used to prefill the form on resume). */
export async function loadDraft(token: string): Promise<DraftRecord | null> {
  if (!serviceRoleConfigured || !token) return null;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("intake_drafts")
    .select("token,email,company,signer_name,segments,answers,completed,expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;
  // Abandoned drafts hold revenue, payroll, ownership and named staff. A token pulled
  // from a two-year-old inbox should not still open one.
  if (data.expires_at && new Date(data.expires_at as string) < new Date()) return null;
  return {
    token: data.token as string,
    email: (data.email as string) ?? "",
    company: (data.company as string) ?? "",
    signerName: (data.signer_name as string) ?? "",
    segments: (data.segments as string[]) ?? [],
    answers: (data.answers as Record<string, string>) ?? {},
    completed: Boolean(data.completed),
  };
}

/** Mark a draft finished and link the stored PDF, once the intake is submitted. */
export async function completeDraft(
  token: string,
  opts: { documentId?: string | null; ownerId?: string | null }
): Promise<void> {
  if (!serviceRoleConfigured || !token) return;
  const admin = createAdminClient();
  await admin
    .from("intake_drafts")
    .update({
      completed: true,
      document_id: opts.documentId ?? null,
      owner_id: opts.ownerId ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("token", token);
}

/** Email the client a private link to resume their intake. */
export async function emailResumeLink(input: {
  token: string;
  email: string;
  signerName?: string;
  segments?: string[];
}): Promise<{ ok: boolean; error?: string }> {
  if (!emailConfigured) return { ok: false, error: "email-not-configured" };
  const link = `${SITE_URL}/onboarding/intake?draft=${input.token}`;
  const names = (input.segments ?? [])
    .map((k) => segmentByKey[k]?.name)
    .filter(Boolean)
    .join(", ");
  const hello = input.signerName?.trim() ? `Hi ${esc(input.signerName.trim())},` : "Hello,";
  const res = await sendEmail({
    to: input.email,
    subject: "Your Aperture intake — resume link",
    html: `<div style="font-family:Arial,Helvetica,sans-serif;color:#141414;font-size:15px;line-height:1.6">
      <h2 style="color:#500000;margin:0 0 8px">Pick up where you left off.</h2>
      <p style="margin:0 0 12px">${hello}</p>
      <p style="margin:0 0 12px">Your Intake Questionnaire has been saved${names ? ` (${esc(names)})` : ""}.
        Use the private link below to continue on any device — your answers are already filled in.</p>
      <p style="margin:0 0 18px">
        <a href="${link}" style="display:inline-block;background:#500000;color:#fff;text-decoration:none;padding:12px 22px;border-radius:4px;font-weight:600">Resume my intake</a>
      </p>
      <p style="margin:0 0 12px;color:#6b6b6b;font-size:13px">Or paste this into your browser:<br/>
        <span style="color:#500000">${link}</span></p>
      <p style="margin:16px 0 4px;color:#6b6b6b;font-size:13px">Keep this link private — anyone with it can open your draft.</p>
      <p style="margin:14px 0 0">Warmly,<br/><strong>Fenwick How</strong><br/>Founder · The Aperture Method™</p>
    </div>`,
  });
  return res;
}

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}
