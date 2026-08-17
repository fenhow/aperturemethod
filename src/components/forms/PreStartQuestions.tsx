"use client";

import { useState } from "react";
import Link from "next/link";
import { EMAIL_RE } from "@/lib/contact";

/**
 * The short form on /onboarding, for someone who is not ready to sign.
 *
 * Onboarding is a two-step commitment funnel, and until now the only exit for a
 * visitor with a question was an email address in small print at the foot of
 * the page. This keeps them on the page. It posts to the same contact endpoint
 * as the main form, with its own source, so a question raised here is visibly
 * different in the inbox from a general enquiry.
 */

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "company" | "question", string>>;

const inputCls =
  "mt-1.5 w-full rounded-sm border border-line bg-paper px-4 py-3 text-body text-ink " +
  "transition-colors placeholder:text-muted/70 focus:border-maroon focus:outline-none " +
  "focus:ring-2 focus:ring-maroon/20";

export function PreStartQuestions() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const question = String(data.get("question") ?? "").trim();
    const website = String(data.get("website") ?? "");

    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!email || !EMAIL_RE.test(email)) next.email = "Please enter a valid email address.";
    if (!company) next.company = "Please enter your company name.";
    if (!question) next.question = "What would you like to ask?";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          inquiryType: "Something else",
          name,
          email,
          company,
          challenge: question,
          website,
          source: "website:/onboarding",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        setStatus("error");
        setMessage(json?.message ?? "Something went wrong. Please email hello@aperturemethod.com.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please email hello@aperturemethod.com.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-line bg-surface p-8">
        <h2 className="text-h4 font-semibold text-ink">Thanks, that has reached me.</h2>
        <p className="mt-3 text-body text-muted">
          I answer these myself, usually the same working day. Nothing is signed and nothing starts
          until you say so.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-surface p-8">
      <h2 className="text-h4 font-semibold text-ink">Have questions before you start?</h2>
      <p className="mt-3 max-w-measure text-body text-muted">
        Ask before you sign anything. This goes straight to me, not to a queue, and asking does not
        begin an engagement or commit you to a phase.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ps-name" className="text-small font-medium text-ink">
            Name
          </label>
          <input id="ps-name" name="name" type="text" autoComplete="name" className={inputCls} />
          {errors.name && <p className="mt-1.5 text-small text-maroon">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="ps-email" className="text-small font-medium text-ink">
            Email
          </label>
          <input id="ps-email" name="email" type="email" autoComplete="email" className={inputCls} />
          {errors.email && <p className="mt-1.5 text-small text-maroon">{errors.email}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ps-company" className="text-small font-medium text-ink">
            Company
          </label>
          <input
            id="ps-company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputCls}
          />
          {errors.company && <p className="mt-1.5 text-small text-maroon">{errors.company}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="ps-question" className="text-small font-medium text-ink">
            Your question
          </label>
          <textarea
            id="ps-question"
            name="question"
            rows={4}
            className={inputCls}
            placeholder="Scope, fees, timing, what happens to my data, anything at all."
          />
          {errors.question && <p className="mt-1.5 text-small text-maroon">{errors.question}</p>}
        </div>

        {/* Honeypot. Bots fill it; nobody else can see it. */}
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="ps-website">Website</label>
          <input id="ps-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2">
          <button type="submit" className="btn" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send my question"}
          </button>
          {status === "error" && <p className="mt-3 text-small text-maroon">{message}</p>}
          <p className="mt-4 max-w-measure text-small text-muted">
            By submitting, you agree we may use your details to respond to your enquiry, in line
            with our{" "}
            <Link href="/privacy" className="link-inline">
              Privacy Policy
            </Link>
            . We do not sell or share your information.
          </p>
        </div>
      </form>
    </div>
  );
}
