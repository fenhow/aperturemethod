"use client";

import { useEffect, useState } from "react";
import type { OnboardingErrors, OnboardingPayload } from "@/lib/onboarding/types";

export const inputCls =
  "mt-2 block w-full rounded-sm border border-line bg-paper px-4 py-3 text-[16px] text-body transition-colors placeholder:text-muted/70 focus:border-ink focus:outline-none";
export const labelCls = "block text-small font-semibold text-ink";
export const errCls = "border-maroon focus:border-maroon";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-small font-medium text-maroon">{message}</p>;
}

export type SubmitResult = {
  pdfBase64: string;
  filename: string;
  stored: boolean;
  emailed: boolean;
};

export function useOnboardingSubmit() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverErrors, setServerErrors] = useState<OnboardingErrors>({});
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);

  async function submit(payload: OnboardingPayload): Promise<boolean> {
    setStatus("submitting");
    setServerErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: OnboardingErrors;
        message?: string;
      } & Partial<SubmitResult>;

      if (res.ok && data.ok) {
        setResult({
          pdfBase64: data.pdfBase64 ?? "",
          filename: data.filename ?? "document.pdf",
          stored: Boolean(data.stored),
          emailed: Boolean(data.emailed),
        });
        setStatus("success");
        return true;
      }
      if (data.errors) {
        setServerErrors(data.errors);
        setStatus("idle");
        return false;
      }
      setMessage(data.message ?? "Something went wrong. Please email hello@aperturemethod.com.");
      setStatus("error");
      return false;
    } catch {
      setMessage("We couldn't reach the server. Please email hello@aperturemethod.com and we'll help.");
      setStatus("error");
      return false;
    }
  }

  function download() {
    if (!result?.pdfBase64) return;
    const bytes = Uint8Array.from(atob(result.pdfBase64), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return { status, serverErrors, message, result, submit, download };
}

/** Centered modal overlay. Locks body scroll and scrolls the page to top so it
 * is always visible (fixes the "stuck at the bottom" issue). Closes on backdrop
 * click or Escape. */
export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  scrollToTop = true,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: React.ReactNode;
  /** Jump the page to the top when opening. Correct for validation errors; wrong for a
   *  dialog that appears while the client is typing: it would throw away their place. */
  scrollToTop?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, scrollToTop]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-paper p-8 shadow-xl">{children}</div>
    </div>
  );
}

/** Popup listing validation problems when a required field is missing. */
export function ErrorDialog({
  open,
  problems,
  onClose,
}: {
  open: boolean;
  problems: string[];
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="onb-err-title">
      <h3 id="onb-err-title" className="text-h3 font-semibold text-ink">
        Please check the form
      </h3>
      <p className="mt-3 text-body text-muted">A few things need your attention before we can submit:</p>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-body font-medium text-maroon">
        {problems.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <button type="button" onClick={onClose} className="btn mt-6 w-full justify-center py-3.5 sm:w-auto sm:px-10">
        Got it
      </button>
    </Modal>
  );
}

/** Confirmation popup shown after a successful submit. Summarizes the signed
 * data, offers the PDF, and returns to the home page. */
export function SuccessDialog({
  open,
  title,
  summary,
  onDownload,
  onHome,
  note,
}: {
  open: boolean;
  title: string;
  summary: [string, string][];
  onDownload: () => void;
  onHome: () => void;
  /** What actually happened. Defaults to a claim that is true regardless of whether
   *  storage and email were configured; never assert delivery we cannot confirm. */
  note?: string;
}) {
  return (
    <Modal open={open} onClose={onHome} labelledBy="onb-ok-title">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-lg text-paper" aria-hidden="true">
          ✓
        </span>
        <div>
          <h3 id="onb-ok-title" className="text-h3 font-semibold text-ink">
            {title}
          </h3>
          <p className="mt-2 text-body text-muted">
            {note ?? "We have your submission. Download your signed copy below and keep it for your records."}
          </p>
        </div>
      </div>
      <dl className="mt-5 divide-y divide-line rounded-md border border-line">
        {summary.filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
            <dt className="text-small text-muted">{k}</dt>
            <dd className="text-right text-small font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onDownload} className="btn--secondary w-full justify-center py-3.5 sm:w-auto sm:px-8">
          Download PDF
        </button>
        <button type="button" onClick={onHome} className="btn w-full justify-center py-3.5 sm:w-auto sm:px-8">
          Done, return home
        </button>
      </div>
    </Modal>
  );
}


/** Shown once, the first time a client's answers reach the server.
 *
 * The form saves silently from the first keystroke, which is only reassuring if somebody
 * says so. Without this, a client filling in a hundred questions has no way of knowing
 * whether closing the tab would cost them the lot, so they either push through in one
 * exhausting sitting, or abandon it. This is the moment to tell them plainly, hand them
 * the link back, and offer to email it. */
export function SavedDialog({
  open,
  resumeUrl,
  email,
  onEmailChange,
  onEmailLink,
  emailing,
  emailed,
  onClose,
}: {
  open: boolean;
  resumeUrl: string;
  email: string;
  onEmailChange: (v: string) => void;
  onEmailLink: () => void;
  emailing: boolean;
  emailed: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function copy() {
    try {
      await navigator.clipboard.writeText(resumeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked: the link is visible and selectable anyway */
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="onb-saved-title" scrollToTop={false}>
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-lg text-paper"
          aria-hidden="true"
        >
          ✓
        </span>
        <div>
          <h3 id="onb-saved-title" className="text-h3 font-semibold text-ink">
            Your answers are being saved
          </h3>
          <p className="mt-2 text-body text-muted">
            This is a long form and you are not expected to finish it in one go. Everything you
            type is saved automatically as you go. You can close this page at any point and
            pick up exactly where you left off.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-line bg-surface p-4">
        <p className="text-small font-semibold text-ink">Your private link back</p>
        <p className="mt-1 text-small text-muted">
          Bookmark it, or let us email it to you. Anyone with this link can open your answers,
          so keep it to yourself.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={resumeUrl}
            onFocus={(e) => e.currentTarget.select()}
            className={inputCls + " mt-0 flex-1 text-small"}
            aria-label="Your private resume link"
          />
          <button type="button" onClick={copy} className="btn--secondary shrink-0 justify-center px-5 py-3">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="mt-4">
        {emailed ? (
          <p className="text-small font-medium text-ink">
            ✓ Sent. Check your inbox for the link. It comes from The Aperture Method.
          </p>
        ) : (
          <>
            <label className={labelCls} htmlFor="onb-saved-email">
              Email it to me as well
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="onb-saved-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@yourbusiness.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className={inputCls + " mt-0 flex-1"}
              />
              <button
                type="button"
                onClick={onEmailLink}
                disabled={!valid || emailing}
                className="btn shrink-0 justify-center px-6 py-3 disabled:opacity-50"
              >
                {emailing ? "Sending…" : "Send link"}
              </button>
            </div>
          </>
        )}
      </div>

      <button type="button" onClick={onClose} className="btn mt-6 w-full justify-center py-3.5 sm:w-auto sm:px-10">
        Got it, keep going
      </button>
    </Modal>
  );
}
