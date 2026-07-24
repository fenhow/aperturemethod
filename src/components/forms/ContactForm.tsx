"use client";

import { useId, useRef, useState } from "react";
import {
  validateContact,
  inquiryTypes,
  industryOptions,
  revenueOptions,
  timelineOptions,
  PRIVACY_LINE,
  type ContactErrors,
  type ContactPayload,
  type InquiryType,
} from "@/lib/contact";
import { track } from "@/lib/analytics";

const inputCls =
  "mt-2 block w-full rounded-sm border border-line bg-paper px-4 py-3 text-[16px] text-body transition-colors placeholder:text-muted/70 focus:border-ink focus:outline-none";
const errorInputCls = "border-maroon focus:border-maroon";
const labelCls = "block text-small font-semibold text-ink";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-small font-medium text-maroon">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="mt-0.5 h-4 w-4 shrink-0 fill-maroon"
      >
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.9.9 0 01.9.9v3.6a.9.9 0 11-1.8 0V4.9A.9.9 0 018 4zm0 7.7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
      <span>{message}</span>
    </p>
  );
}

export function ContactForm() {
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [inquiryType, setInquiryType] = useState<InquiryType>("Consultation");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [started, setStarted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const isConsultation = inquiryType === "Consultation";

  function onFirstInput() {
    if (!started) {
      setStarted(true);
      track("contact_form_start", { inquiry_type: inquiryType });
    }
  }

  function focusField(name: keyof ContactErrors) {
    const el = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fid(name))}`);
    el?.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload: ContactPayload = {
      inquiryType,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      challenge: String(fd.get("challenge") ?? ""),
      role: String(fd.get("role") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      revenue: String(fd.get("revenue") ?? ""),
      timeline: String(fd.get("timeline") ?? ""),
      referral: String(fd.get("referral") ?? ""),
      newsletter: fd.get("newsletter") === "on",
      website: String(fd.get("website") ?? ""),
    };

    const found = validateContact(payload);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Move focus to the summary so screen readers announce it.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setStatus("submitting");
    track("contact_form_submit", { inquiry_type: inquiryType });

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
        track("contact_form_success", { inquiry_type: inquiryType });
        return;
      }

      if (data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }

      setServerMessage(
        data.message ?? "Something went wrong. Please email hello@aperturemethod.com."
      );
      setStatus("error");
      track("contact_form_error", { inquiry_type: inquiryType });
    } catch {
      setServerMessage(
        "We couldn't reach the server. Please email hello@aperturemethod.com and we'll pick it up."
      );
      setStatus("error");
      track("contact_form_error", { inquiry_type: inquiryType });
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded border border-line bg-surface p-8"
      >
        {isConsultation ? (
          <>
            <h3 className="text-h3 font-semibold text-ink">Thank you — your message is in.</h3>
            <p className="mt-4 text-body-lg text-body">
              Fenwick reads every one of these personally and will reply within one business day,
              usually sooner. Prefer to skip the wait?{" "}
              <a href="#book" className="link-inline">
                Book a time directly →
              </a>
            </p>
          </>
        ) : (
          <>
            <h3 className="text-h3 font-semibold text-ink">Thanks — we&apos;ve got it.</h3>
            <p className="mt-4 text-body-lg text-body">
              We&apos;ll route your note to the right person and be in touch. For anything
              time-sensitive:{" "}
              <a href="mailto:hello@aperturemethod.com" className="link-inline">
                hello@aperturemethod.com
              </a>
              .
            </p>
          </>
        )}
      </div>
    );
  }

  const errorList = Object.entries(errors) as [keyof ContactErrors, string][];
  const describe = (name: keyof ContactErrors) => (errors[name] ? fid(`${name}-error`) : undefined);
  const invalid = (name: keyof ContactErrors) => (errors[name] ? true : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={onFirstInput} noValidate className="space-y-6">
      {/* Error summary (assertive) */}
      <div
        ref={summaryRef}
        tabIndex={-1}
        aria-live="assertive"
        className={errorList.length ? "rounded-sm border border-maroon bg-maroon/5 p-4 outline-none" : "sr-only"}
      >
        {errorList.length > 0 && (
          <>
            <p className="text-small font-semibold text-maroon">
              Please check the {errorList.length === 1 ? "field" : "fields"} below.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-maroon">
              {errorList.map(([name, message]) => (
                <li key={name}>
                  <button
                    type="button"
                    className="underline underline-offset-2"
                    onClick={() => focusField(name)}
                  >
                    {message}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Inquiry type */}
      <fieldset>
        <legend className={labelCls}>What&apos;s this about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {inquiryTypes.map((type) => {
            const selected = type === inquiryType;
            return (
              <label
                key={type}
                className={
                  "cursor-pointer select-none rounded-sm border px-4 py-2 text-small font-semibold transition-colors " +
                  (selected
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-body hover:border-ink")
                }
              >
                <input
                  type="radio"
                  name="inquiryType"
                  value={type}
                  checked={selected}
                  onChange={() => setInquiryType(type)}
                  className="sr-only"
                />
                {type}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Name + Email */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={fid("name")} className={labelCls}>
            Your name <span className="text-maroon">*</span>
          </label>
          <input
            id={fid("name")}
            name="name"
            type="text"
            autoComplete="name"
            aria-required="true"
            aria-invalid={invalid("name")}
            aria-describedby={describe("name")}
            className={inputCls + (errors.name ? " " + errorInputCls : "")}
          />
          <FieldError id={fid("name-error")} message={errors.name} />
        </div>
        <div>
          <label htmlFor={fid("email")} className={labelCls}>
            Work email <span className="text-maroon">*</span>
          </label>
          <input
            id={fid("email")}
            name="email"
            type="email"
            autoComplete="email"
            aria-required="true"
            aria-invalid={invalid("email")}
            aria-describedby={
              [describe("email"), fid("email-help")].filter(Boolean).join(" ") || undefined
            }
            className={inputCls + (errors.email ? " " + errorInputCls : "")}
          />
          <FieldError id={fid("email-error")} message={errors.email} />
          {!errors.email && (
            <p id={fid("email-help")} className="mt-2 text-small text-muted">
              We&apos;ll reply here. Never shared.
            </p>
          )}
        </div>
      </div>

      {/* Company + Role */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={fid("company")} className={labelCls}>
            Company <span className="text-maroon">*</span>
          </label>
          <input
            id={fid("company")}
            name="company"
            type="text"
            autoComplete="organization"
            aria-required="true"
            aria-invalid={invalid("company")}
            aria-describedby={describe("company")}
            className={inputCls + (errors.company ? " " + errorInputCls : "")}
          />
          <FieldError id={fid("company-error")} message={errors.company} />
        </div>
        <div>
          <label htmlFor={fid("role")} className={labelCls}>
            Your role <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id={fid("role")}
            name="role"
            type="text"
            placeholder="e.g., Owner, CEO, President"
            autoComplete="organization-title"
            className={inputCls}
          />
        </div>
      </div>

      {/* Challenge */}
      <div>
        <label htmlFor={fid("challenge")} className={labelCls}>
          {isConsultation
            ? "What's the main thing you're trying to figure out?"
            : "How can we help?"}{" "}
          <span className="text-maroon">*</span>
        </label>
        <textarea
          id={fid("challenge")}
          name="challenge"
          rows={4}
          aria-required="true"
          aria-invalid={invalid("challenge")}
          aria-describedby={
            [describe("challenge"), fid("challenge-help")].filter(Boolean).join(" ") || undefined
          }
          className={inputCls + " resize-y" + (errors.challenge ? " " + errorInputCls : "")}
        />
        <FieldError id={fid("challenge-error")} message={errors.challenge} />
        {!errors.challenge && (
          <p id={fid("challenge-help")} className="mt-2 text-small text-muted">
            A sentence or two is plenty.
          </p>
        )}
      </div>

      {/* Optional detail */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={fid("industry")} className={labelCls}>
            Industry <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id={fid("industry")} name="industry" defaultValue="" className={inputCls}>
            <option value="">Select…</option>
            {industryOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        {isConsultation && (
          <div>
            <label htmlFor={fid("revenue")} className={labelCls}>
              Annual revenue <span className="font-normal text-muted">(optional)</span>
            </label>
            <select id={fid("revenue")} name="revenue" defaultValue="" className={inputCls}>
              <option value="">Prefer not to say</option>
              {revenueOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isConsultation && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={fid("timeline")} className={labelCls}>
              When are you hoping to move? <span className="font-normal text-muted">(optional)</span>
            </label>
            <select id={fid("timeline")} name="timeline" defaultValue="" className={inputCls}>
              <option value="">Select…</option>
              {timelineOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={fid("referral")} className={labelCls}>
              How did you hear about us? <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id={fid("referral")} name="referral" type="text" className={inputCls} />
          </div>
        </div>
      )}

      {/* Newsletter opt-in — separate, unchecked */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="newsletter"
          className="mt-1 h-4 w-4 shrink-0 rounded-sm border-line text-maroon focus:ring-maroon"
        />
        <span className="text-small text-body">
          Send me occasional Insights (about monthly). Unsubscribe anytime.
        </span>
      </label>

      {/* Honeypot — hidden from users and assistive tech (clip technique: no
          off-screen positioning, so it can never cause horizontal scroll on mobile) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -m-px h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)]"
      >
        <label htmlFor={fid("website")}>Leave this field blank</label>
        <input id={fid("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <div role="alert" className="rounded-sm border border-maroon bg-maroon/5 p-4 text-small text-maroon">
          {serverMessage}
        </div>
      )}

      <div>
        <button type="submit" className="btn w-full sm:w-auto" disabled={status === "submitting"}>
          {status === "submitting"
            ? "Sending…"
            : isConsultation
              ? "Request a consultation"
              : "Send message"}
        </button>
        <p className="mt-4 max-w-measure text-small text-muted">{PRIVACY_LINE}</p>
      </div>
    </form>
  );
}
