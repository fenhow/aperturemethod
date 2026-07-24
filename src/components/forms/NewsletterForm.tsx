"use client";

import { useId, useState } from "react";
import { EMAIL_RE } from "@/lib/contact";
import { track } from "@/lib/analytics";

/**
 * "In Focus" opt-in used on the Insights hub. Same posture as the contact form:
 * client validation, honeypot, graceful states, analytics. On dark backgrounds.
 */
export function NewsletterForm() {
  const uid = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const website = String(fd.get("website") ?? "");

    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    track("newsletter_submit");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) {
        setStatus("success");
        track("newsletter_success");
        return;
      }
      setStatus("error");
      setMessage(data.message ?? "Something went wrong. Please try again shortly.");
      track("newsletter_error");
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Please try again shortly.");
      track("newsletter_error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="rounded-sm border border-white/20 bg-white/5 p-5">
        <p className="text-body font-semibold text-paper">You&apos;re on the list.</p>
        <p className="mt-1 text-small text-white/70">
          Look out for the next note from Fenwick. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  const errId = `${uid}-error`;
  const hasError = status === "error";

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Subscribe to In Focus" className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={`${uid}-email`} className="sr-only">
            Email address
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errId : undefined}
            className="h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 text-[16px] text-paper placeholder:text-white/40 focus:border-white focus:outline-none"
          />
        </div>
        {/* Honeypot (clip technique — never affects layout or horizontal scroll) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -m-px h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)]"
        >
          <label htmlFor={`${uid}-website`}>Leave blank</label>
          <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" className="btn--on-dark h-12" disabled={status === "submitting"}>
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {hasError && (
        <p id={errId} role="alert" className="text-small font-medium text-maroon-onDark">
          {message}
        </p>
      )}
    </form>
  );
}
