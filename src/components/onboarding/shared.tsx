"use client";

import { useState } from "react";
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
      setMessage(data.message ?? "Something went wrong. Please email fen@aperturemethod.com.");
      setStatus("error");
      return false;
    } catch {
      setMessage("We couldn't reach the server. Please email fen@aperturemethod.com and we'll help.");
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

export function SuccessPanel({
  title,
  email,
  onDownload,
}: {
  title: string;
  email: string;
  onDownload: () => void;
}) {
  return (
    <div role="status" aria-live="polite" className="rounded border border-line bg-surface p-8">
      <h3 className="text-h3 font-semibold text-ink">{title}</h3>
      <p className="mt-4 text-body-lg text-body">
        Thank you — we&apos;ve received it and sent a signed copy to{" "}
        <span className="font-medium text-ink">{email}</span>.
      </p>
      <p className="mt-3 text-body text-muted">
        You can also find it any time in your secure client area. Sign in at{" "}
        <a href="/portal" className="link-inline">
          the client portal
        </a>{" "}
        with this email and we&apos;ll send a one-time link.
      </p>
      <button type="button" onClick={onDownload} className="btn mt-6">
        Download your PDF
      </button>
    </div>
  );
}
