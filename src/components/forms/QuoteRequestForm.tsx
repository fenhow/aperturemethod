"use client";

import { useId, useState } from "react";
import { PRIVACY_LINE } from "@/lib/contact";
import { track } from "@/lib/analytics";

/**
 * Quote request for work beyond the one-market fixed fee: multi-market,
 * national, international and specialty studies. Posts to the same
 * /api/contact handler as the main form (so it lands in the same inbox and
 * CRM webhook), tagged with its own source so it is distinguishable on sight.
 */

export const QUOTE_SCOPES = [
  "Several metro markets",
  "Statewide or regional",
  "National (USA)",
  "International / other countries",
  "Specialty or custom analysis",
] as const;

const inputCls =
  "mt-2 block w-full rounded-sm border border-line bg-paper px-4 py-3 text-[16px] text-body transition-colors placeholder:text-muted/70 focus:border-ink focus:outline-none";
const labelCls = "block text-small font-semibold text-ink";

export function QuoteRequestForm({ source = "website:/market-map#quote" }: { source?: string }) {
  const uid = useId();
  const fid = (n: string) => `${uid}-${n}`;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const scope = get("scope");
    const footprint = get("footprint");
    const locations = get("locations");
    const details = get("details");
    const challenge = [
      `QUOTE REQUEST: ${scope || "Scope not given"}`,
      footprint && `Footprint / markets: ${footprint}`,
      locations && `Locations (today / planned): ${locations}`,
      details && `Details: ${details}`,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          inquiryType: "Consultation",
          name: get("name"),
          email: get("email"),
          company: get("company"),
          role: get("role"),
          challenge,
          timeline: get("timeline"),
          website: get("website"),
          source,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        track("quote_request_submit", { scope });
      } else {
        setStatus("error");
        setMessage(
          data.errors
            ? "Please fill in your name, a valid email, your company and the markets you have in mind."
            : data.message ?? "Something went wrong. Please try again or email us directly."
        );
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again or email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-lg border border-line bg-paper p-8">
        <p className="eyebrow mb-2">Request received</p>
        <p className="text-h3 font-semibold text-ink">Thank you. Fenwick will be in touch within one business day.</p>
        <p className="mt-3 text-body text-muted">
          He will come back with a short list of questions about the footprint and the decision, then a fixed-fee scope you can review before anything starts.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-lg border border-line bg-paper p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor={fid("name")} className={labelCls}>Name</label>
          <input id={fid("name")} name="name" required autoComplete="name" className={inputCls} />
        </div>
        <div>
          <label htmlFor={fid("email")} className={labelCls}>Work email</label>
          <input id={fid("email")} name="email" type="email" required autoComplete="email" className={inputCls} />
        </div>
        <div>
          <label htmlFor={fid("company")} className={labelCls}>Company</label>
          <input id={fid("company")} name="company" required autoComplete="organization" className={inputCls} />
        </div>
        <div>
          <label htmlFor={fid("role")} className={labelCls}>Role <span className="font-normal text-muted">(optional)</span></label>
          <input id={fid("role")} name="role" autoComplete="organization-title" className={inputCls} />
        </div>
        <div>
          <label htmlFor={fid("scope")} className={labelCls}>Scope</label>
          <select id={fid("scope")} name="scope" required defaultValue="" className={inputCls}>
            <option value="" disabled>Choose one</option>
            {QUOTE_SCOPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={fid("timeline")} className={labelCls}>Decision timeline <span className="font-normal text-muted">(optional)</span></label>
          <select id={fid("timeline")} name="timeline" defaultValue="" className={inputCls}>
            <option value="">Not sure yet</option>
            <option>Next 1–3 months</option>
            <option>3–6 months</option>
            <option>6–12 months</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor={fid("footprint")} className={labelCls}>Markets, states or countries in scope</label>
          <input id={fid("footprint")} name="footprint" required placeholder="e.g. Texas, Arizona and the Southeast; or all of the US" className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor={fid("locations")} className={labelCls}>Locations today, and planned <span className="font-normal text-muted">(optional)</span></label>
          <input id={fid("locations")} name="locations" placeholder="e.g. 12 today, 6 to 10 more over three years" className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor={fid("details")} className={labelCls}>What decision is this for?</label>
          <textarea id={fid("details")} name="details" rows={4} placeholder="Opening sites, closing weak ones, finding where the best customers are, entering a new country..." className={inputCls} />
        </div>
        {/* Honeypot */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor={fid("website")}>Website</label>
          <input id={fid("website")} name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-5 text-small font-medium text-maroon">{message}</p>
      )}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md text-small text-muted">{PRIVACY_LINE}</p>
        <button type="submit" disabled={status === "submitting"} className="btn shrink-0">
          {status === "submitting" ? "Sending…" : "Request a quote"}
        </button>
      </div>
    </form>
  );
}
