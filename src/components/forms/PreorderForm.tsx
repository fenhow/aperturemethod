"use client";

import { useId, useState } from "react";
import { EMAIL_RE } from "@/lib/contact";
import { track } from "@/lib/analytics";

/**
 * Book pre-order capture (light background). Same posture as NewsletterForm —
 * client validation, honeypot, graceful states — posted to the newsletter
 * endpoint tagged as a book pre-order.
 */
export function PreorderForm() {
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
        body: JSON.stringify({ email, website, source: "book-preorder" }),
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
      <div role="status" aria-live="polite" className="rounded-lg border border-line bg-paper p-5">
        <p className="text-body font-semibold text-ink">You&apos;re on the pre-order list.</p>
        <p className="mt-1 text-small text-muted">
          We&apos;ll email you the moment it ships — and you&apos;ll get first access.
        </p>
      </div>
    );
  }

  const errId = `${uid}-error`;
  const hasError = status === "error";

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Pre-order the book" className="mt-2 max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={`${uid}-email`} className="sr-only">
            Email address
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@yourcompany.com"
            aria-invalid={hasError}
            aria-describedby={hasError ? errId : undefined}
            className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition-colors placeholder:text-muted focus:border-maroon"
          />
        </div>
        {/* honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <button type="submit" disabled={status === "submitting"} className="btn shrink-0">
          {status === "submitting" ? "Adding…" : "Pre-order"}
        </button>
      </div>
      {hasError && (
        <p id={errId} role="alert" className="mt-2 text-small text-maroon">
          {message}
        </p>
      )}
      <p className="mt-2 text-small text-muted">
        Reserve your copy — no charge now. We&apos;ll email you first when it ships.
      </p>
    </form>
  );
}
