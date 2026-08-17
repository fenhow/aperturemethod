"use client";

import { useId, useState } from "react";
import { validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact";
import { track } from "@/lib/analytics";

/**
 * Compact "Contact us" card, sized to sit in the empty grid slot beside the
 * five component cards on the homepage. Collects the four required fields
 * (name, email, company, message) and posts to the same /api/contact handler
 * as the full consultation form.
 */

/*
 * 16px on phones is not a style choice: iOS Safari zooms the whole page in
 * when you focus an input smaller than that, and the visitor has to pinch back
 * out to carry on. The compact 14px is restored from `sm` up.
 */
const baseInput =
  "block w-full rounded-sm border bg-paper px-3 py-2 text-[16px] text-body transition-colors placeholder:text-muted/70 focus:outline-none sm:text-[14px]";

export function QuickContactCard() {
  const uid = useId();
  const fid = (n: string) => `${uid}-${n}`;

  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const cls = (name: keyof ContactErrors) =>
    `${baseInput} ${errors[name] ? "border-maroon focus:border-maroon" : "border-line focus:border-ink"}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: ContactPayload = {
      inquiryType: "Consultation",
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      challenge: String(fd.get("challenge") ?? ""),
      website: String(fd.get("website") ?? ""),
    };

    const found = validateContact(payload);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setErrors({});
    setStatus("submitting");
    track("contact_form_submit", { inquiry_type: "Consultation" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: ContactErrors;
        message?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        track("contact_form_success", { inquiry_type: "Consultation" });
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      setServerMessage(data.message ?? "Something went wrong. Please email hello@aperturemethod.com.");
      setStatus("error");
      track("contact_form_error", { inquiry_type: "Consultation" });
    } catch {
      setServerMessage("Couldn't reach the server. Please email hello@aperturemethod.com.");
      setStatus("error");
      track("contact_form_error", { inquiry_type: "Consultation" });
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex h-full flex-col justify-center rounded-lg border border-maroon/30 bg-surface p-7"
      >
        <p className="eyebrow text-maroon">Message sent</p>
        <h3 className="mt-2 text-h4 font-semibold text-ink">Thanks. We&apos;ve got it.</h3>
        <p className="mt-2 text-small text-muted">
          Fenwick reads these personally and will reply within one business day, usually sooner.
        </p>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex h-full flex-col rounded-lg border border-line bg-paper p-7"
    >
      <p className="eyebrow">Have a question?</p>
      <h3 className="mt-2 text-h4 font-semibold text-ink">Contact us</h3>
      <p className="mt-1 text-small text-muted">A quick note: Fenwick replies personally.</p>

      <div className="mt-4 flex flex-1 flex-col gap-2.5">
        <div>
          <label htmlFor={fid("name")} className="sr-only">
            Your name
          </label>
          <input
            id={fid("name")}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={errors.name ? true : undefined}
            className={cls("name")}
          />
        </div>
        <div>
          <label htmlFor={fid("email")} className="sr-only">
            Work email
          </label>
          <input
            id={fid("email")}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Work email"
            aria-invalid={errors.email ? true : undefined}
            className={cls("email")}
          />
        </div>
        <div>
          <label htmlFor={fid("company")} className="sr-only">
            Company
          </label>
          <input
            id={fid("company")}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Company"
            aria-invalid={errors.company ? true : undefined}
            className={cls("company")}
          />
        </div>
        <div className="flex flex-1 flex-col">
          <label htmlFor={fid("challenge")} className="sr-only">
            How can we help?
          </label>
          <textarea
            id={fid("challenge")}
            name="challenge"
            rows={2}
            placeholder="How can we help?"
            aria-invalid={errors.challenge ? true : undefined}
            className={`${cls("challenge")} min-h-[64px] flex-1 resize-y`}
          />
        </div>
      </div>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -m-px h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)]"
      >
        <label htmlFor={fid("website")}>Leave this field blank</label>
        <input id={fid("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {hasErrors && (
        <p role="alert" className="mt-3 text-small font-medium text-maroon">
          Please add your name, a valid email, company, and a short message.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-3 text-small font-medium text-maroon">
          {serverMessage}
        </p>
      )}

      <button type="submit" className="btn mt-4 w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
