import "server-only";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { sendEmail, emailConfigured, NOTIFY_EMAIL } from "@/lib/email";
import { generateOnboardingPdf } from "./pdf";
import type { OnboardingPayload } from "./types";
import { KIND_LABEL } from "./types";

export type SubmitResult = {
  ok: boolean;
  /** Base64 PDF so the browser can offer an immediate download. */
  pdfBase64: string;
  filename: string;
  stored: boolean;
  emailed: boolean;
};

/** Ensure an auth user + profile exists for this email; return the profile id. */
async function ensureOwner(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
  fullName: string,
  company: string
): Promise<string | null> {
  // Profiles carry the email; look there first (id === auth.users.id).
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing?.id) {
    await admin.from("profiles").update({ full_name: fullName, company }).eq("id", existing.id);
    return existing.id;
  }
  // Create the auth user (email confirmed so they can use magic-link login later).
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: fullName, company },
  });
  if (error || !created?.user) {
    console.error("[onboarding] createUser failed:", error?.message);
    return null;
  }
  // The on_auth_user_created trigger inserts the profile; enrich it.
  await admin.from("profiles").update({ full_name: fullName, company }).eq("id", created.user.id);
  return created.user.id;
}

export async function submitOnboarding(
  payload: OnboardingPayload,
  ctx: { ip: string; userAgent: string; date: string }
): Promise<SubmitResult> {
  const { bytes, filename } = await generateOnboardingPdf(payload, { ip: ctx.ip, date: ctx.date });
  const pdfBase64 = Buffer.from(bytes).toString("base64");

  let stored = false;
  let ownerId: string | null = null;
  let documentId: string | null = null;

  if (serviceRoleConfigured) {
    try {
      const admin = createAdminClient();
      ownerId = await ensureOwner(admin, payload.signerEmail, payload.signerName, payload.company);

      if (ownerId) {
        const path = `${ownerId}/${crypto.randomUUID()}.pdf`;
        const { error: upErr } = await admin.storage
          .from("documents")
          .upload(path, bytes, { contentType: "application/pdf", upsert: false });
        if (upErr) throw upErr;

        const { data: docRow, error: docErr } = await admin
          .from("documents")
          .insert({
            owner_id: ownerId,
            name: `${KIND_LABEL[payload.kind]} — ${payload.company}.pdf`,
            path,
            size: bytes.byteLength,
            content_type: "application/pdf",
            uploaded_by: ownerId,
          })
          .select("id")
          .single();
        if (docErr) throw docErr;
        documentId = docRow?.id ?? null;
        stored = true;
      }

      await admin.from("onboarding_submissions").insert({
        kind: payload.kind,
        owner_id: ownerId,
        document_id: documentId,
        company: payload.company,
        signer_name: payload.signerName,
        signer_title: payload.signerTitle ?? null,
        signer_email: payload.signerEmail,
        answers: payload.answers,
        signature_type: payload.signature.type,
        consent: payload.consent,
        ip: ctx.ip,
        user_agent: ctx.userAgent,
      });
    } catch (err) {
      console.error("[onboarding] storage pipeline failed:", err);
    }
  } else {
    console.info("[onboarding] service role not configured — skipping storage.");
  }

  // Notify Fenwick (with PDF) + confirm to the client.
  let emailed = false;
  const label = KIND_LABEL[payload.kind];
  const attach = [{ filename, contentBase64: pdfBase64 }];
  if (emailConfigured) {
    const ownerRes = await sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: payload.signerEmail,
      subject: `New ${label}: ${payload.company}`,
      html: ownerHtml(payload, ctx, stored),
      attachments: attach,
    });
    await sendEmail({
      to: payload.signerEmail,
      subject: `Your copy — ${label} · The Aperture Method`,
      html: clientHtml(payload, label),
      attachments: attach,
    });
    emailed = ownerRes.ok;
  } else {
    console.info("[onboarding] email not configured — skipping notifications.");
  }

  return { ok: true, pdfBase64, filename, stored, emailed };
}

function esc(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}

function ownerHtml(p: OnboardingPayload, ctx: { ip: string; date: string }, stored: boolean) {
  const rows = Object.entries(p.answers)
    .filter(([, v]) => v && v.trim() && v !== "[]")
    .map(([k, v]) => `<tr><td style="padding:2px 10px 2px 0;color:#6b6b6b;vertical-align:top">${esc(k)}</td><td style="padding:2px 0">${esc(v).slice(0, 400)}</td></tr>`)
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#141414;font-size:14px;line-height:1.5">
    <h2 style="color:#500000;margin:0 0 4px">New ${esc(KIND_LABEL[p.kind])}</h2>
    <p style="margin:0 0 12px;color:#6b6b6b">${esc(p.company)} · ${esc(p.signerName)}${p.signerTitle ? " · " + esc(p.signerTitle) : ""} · ${esc(p.signerEmail)}</p>
    <p style="margin:0 0 12px">Signed ${esc(ctx.date)} · IP ${esc(ctx.ip)} · ${stored ? "Saved to portal" : "Not stored (portal not configured)"}. The signed PDF is attached.</p>
    <table style="border-collapse:collapse;font-size:13px">${rows}</table>
  </div>`;
}

function clientHtml(p: OnboardingPayload, label: string) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#141414;font-size:15px;line-height:1.6">
    <h2 style="color:#500000;margin:0 0 8px">Thank you, ${esc(p.signerName)}.</h2>
    <p style="margin:0 0 12px">We've received your ${esc(label)}. A signed copy is attached for your records.</p>
    <p style="margin:0 0 12px">You can also access it any time from your secure client area at
      <a href="https://aperturemethod.com/portal" style="color:#500000">aperturemethod.com/portal</a>
      — sign in with this email address (${esc(p.signerEmail)}) and we'll send you a one-time link.</p>
    <p style="margin:0 0 4px">Warmly,</p>
    <p style="margin:0"><strong>Fenwick How</strong><br/>Founder · The Aperture Method™</p>
  </div>`;
}
