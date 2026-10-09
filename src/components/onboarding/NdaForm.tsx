"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ndaClauses, ESIGN_CONSENT } from "@/lib/onboarding/content";
import type { OnboardingPayload, SignaturePayload } from "@/lib/onboarding/types";
import { SignaturePad } from "./SignaturePad";
import {
  inputCls,
  labelCls,
  errCls,
  FieldError,
  useOnboardingSubmit,
  useDocumentCopy,
  ErrorDialog,
  SuccessDialog,
} from "./shared";

/**
 * The mutual NDA, signed on its own.
 *
 * Same machinery as the agreement form and deliberately shorter: an NDA has no
 * scope, no fees and nothing to choose, so the only inputs are who is signing
 * and from when. The reading copy works the same way, because nobody should
 * have to sign a document to find out what it says.
 */
export function NdaForm() {
  const [f, setF] = useState<Record<string, string>>({});
  const [signature, setSignature] = useState<SignaturePayload | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errOpen, setErrOpen] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const { status, message, submit, download } = useOnboardingSubmit();
  const { busy: copyBusy, failed: copyFailed, open: openCopy } = useDocumentCopy();
  const router = useRouter();
  const set = (name: string, v: string) => setF((s) => ({ ...s, [name]: v }));

  // Effective date defaults to today, set after mount to avoid an SSR mismatch.
  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    setF((s) => (s.effective_date ? s : { ...s, effective_date: today }));
  }, []);

  /** What the preview route needs to draw this NDA as it stands. */
  const copyBody = () => ({
    kind: "nda",
    answers: { ...f },
    signerName: f.signer_name ?? "",
    signerTitle: f.signer_title ?? "",
    signerEmail: f.signer_email ?? "",
    company: f.client_legal_name ?? "",
    website: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (!f.client_legal_name?.trim()) found.client_legal_name = "Please enter the company / legal name.";
    if (!f.signer_name?.trim()) found.signer_name = "Please enter your full name.";
    if (!f.signer_title?.trim()) found.signer_title = "Please enter your title.";
    if (!f.signer_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.signer_email.trim()))
      found.signer_email = "Please enter a valid email.";
    if (!signature) found.signature = "Please add your signature.";
    if (!consent) found.consent = "Please confirm the statement.";
    setErrors(found);
    if (Object.keys(found).length) {
      setProblems(Object.values(found));
      setErrOpen(true);
      return;
    }

    const payload: OnboardingPayload = {
      kind: "nda",
      answers: { ...f },
      signerName: f.signer_name!.trim(),
      signerTitle: f.signer_title!.trim(),
      signerEmail: f.signer_email!.trim(),
      company: f.client_legal_name!.trim(),
      signature: signature!,
      consent,
      website: "",
    };
    await submit(payload);
  }

  const summary: [string, string][] = [
    ["Signed by", f.signer_name ?? ""],
    ["Title", f.signer_title ?? ""],
    ["Company", f.client_legal_name ?? ""],
    ["Email", f.signer_email ?? ""],
    ["Effective date", f.effective_date ?? ""],
  ];

  const field = (
    name: string,
    label: string,
    opts: { type?: string; required?: boolean; half?: boolean } = {}
  ) => (
    <div className={opts.half ? "" : "sm:col-span-2"}>
      <label htmlFor={name} className={labelCls}>
        {label}
        {opts.required && <span className="text-maroon"> *</span>}
      </label>
      <input
        id={name}
        type={opts.type ?? "text"}
        value={f[name] ?? ""}
        onChange={(e) => set(name, e.target.value)}
        className={inputCls + (errors[name] ? " " + errCls : "")}
      />
      <FieldError message={errors[name]} />
    </div>
  );

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-10">
        <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <legend className="mb-1 text-h4 font-semibold text-ink sm:col-span-2">Your details</legend>
          {field("client_legal_name", "Company / legal name", { required: true })}
          {field("signer_name", "Your full name", { required: true, half: true })}
          {field("signer_title", "Your title", { required: true, half: true })}
          {field("signer_email", "Email", { type: "email", required: true, half: true })}
          {field("effective_date", "Effective date", { half: true })}
          {field("company_address", "Company address (optional)")}
        </fieldset>

        <div className="rounded-sm border border-line bg-surface p-6">
          <div className="mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openCopy("read", copyBody())}
                className="btn--secondary"
                disabled={copyBusy !== null}
              >
                {copyBusy === "read" ? "Preparing…" : "Read it first"}
              </button>
              <button
                type="button"
                onClick={() => openCopy("print", copyBody())}
                className="btn--secondary"
                disabled={copyBusy !== null}
              >
                {copyBusy === "print" ? "Preparing…" : "Download to print & sign"}
              </button>
            </div>
            <p className="mt-4 max-w-measure text-small text-muted">
              <strong className="font-semibold text-ink">Read it first</strong> opens an unsigned
              copy in a new tab, marked DRAFT on every page. Take it to your lawyer if you want to.
            </p>
            <p className="mt-2 max-w-measure text-small text-muted">
              <strong className="font-semibold text-ink">Print &amp; sign</strong> downloads the same
              NDA with signature lines instead of the signature box. Sign it by hand, scan it and
              email it to hello@aperturemethod.com and it counts the same as signing here. Either
              way, it is in force once both of us have signed.
            </p>
            {copyFailed && (
              <p className="mt-3 text-small text-maroon">
                That did not work. Email hello@aperturemethod.com and I will send a copy.
              </p>
            )}
          </div>
          <p className="text-body text-body">
            This Mutual Non-Disclosure Agreement is entered into as of the Effective Date by and
            between <strong>The Aperture Method</strong> (&ldquo;Aperture&rdquo;) and{" "}
            <strong>{f.client_legal_name?.trim() || "the Counterparty"}</strong>. Each Party may be
            the disclosing or the receiving party, and the obligations are the same in both
            directions.
          </p>
          <div className="mt-5 max-h-[420px] space-y-4 overflow-y-auto pr-3 text-body text-body">
            {ndaClauses.map((c) => (
              <div key={c.n}>
                <h4 className="text-small font-semibold text-maroon">
                  {c.n}. {c.title}
                </h4>
                {c.body.length === 1 ? (
                  <p className="mt-1 text-small leading-relaxed">{c.body[0]}</p>
                ) : (
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-small leading-relaxed">
                    {c.body.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <fieldset className="space-y-5 border-t border-line pt-8">
          <legend className="text-h4 font-semibold text-ink">Sign</legend>
          <label className="flex items-start gap-3 text-body text-body">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-maroon"
            />
            <span>{ESIGN_CONSENT}</span>
          </label>
          <FieldError message={errors.consent} />
          <div>
            <p className={labelCls}>Signature</p>
            <div className="mt-2">
              <SignaturePad value={signature} onChange={setSignature} error={errors.signature} />
            </div>
          </div>
        </fieldset>

        {status === "error" && (
          <p className="rounded-sm border border-maroon bg-maroon/5 p-4 text-small font-medium text-maroon">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn w-full justify-center py-4 text-base sm:w-auto sm:px-10 disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting…" : "Sign & submit NDA"}
        </button>
      </form>
      <ErrorDialog open={errOpen} problems={problems} onClose={() => setErrOpen(false)} />
      <SuccessDialog
        open={status === "success"}
        title="NDA signed"
        summary={summary}
        onDownload={download}
        onHome={() => router.push("/onboarding")}
      />
    </>
  );
}
