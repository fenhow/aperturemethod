"use client";

import { useEffect, useId, useState } from "react";
import { EMAIL_RE } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { lookCloserPacket } from "@/lib/lookCloser";

const STORAGE_KEY = "aperture:look-closer:unlocked";

/**
 * Download block for the Look Closer packet.
 *
 * The one-page overview is always open — it is the sheet a teacher forwards to
 * a principal, and a forward that hits a form goes nowhere. Everything else
 * asks for an email once; the choice lives on each item's `gated` flag in
 * `lib/lookCloser.ts`, so opening the whole packet up later is a one-line edit.
 */
export function PacketDownloads() {
  const uid = useId();
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  // Remember the teacher who already gave us an email, so a second visit (or a
  // second file) doesn't ask again.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {
      /* storage unavailable (private mode) — the form still works, it just re-asks */
    }
  }, []);

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
    track("look_closer_unlock_submit");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, website, source: "look-closer-packet" }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) {
        try {
          window.localStorage.setItem(STORAGE_KEY, "1");
        } catch {
          /* non-fatal */
        }
        setUnlocked(true);
        setStatus("idle");
        track("look_closer_unlock_success");
        return;
      }
      setStatus("error");
      setMessage(data.message ?? "Something went wrong. Please try again shortly.");
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Please try again shortly.");
    }
  }

  const errId = `${uid}-error`;
  const hasError = status === "error";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
      {/* The files */}
      <ul className="space-y-4">
        {lookCloserPacket.map((item) => {
          const open = !item.gated || unlocked;
          return (
            <li
              key={item.file}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-h4 font-semibold text-paper">{item.title}</h3>
                <span className="text-small text-white/45">{item.pages}</span>
              </div>
              <p className="mt-2 text-body text-white/65">{item.blurb}</p>
              <div className="mt-4">
                {open ? (
                  <a
                    href={item.file}
                    download
                    onClick={() => track("look_closer_download", { file: item.title })}
                    className="link-arrow text-paper hover:text-maroon-soft"
                  >
                    Download
                    <svg
                      className="arrow h-[1.05em] w-[1.05em]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="M12 3v13m0 0 5-5m-5 5-5-5M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ) : (
                  <p className="text-small text-white/40">Add your email to open this file →</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* The gate */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        {unlocked ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border border-white/20 bg-white/5 p-6"
          >
            <p className="text-body-lg font-semibold text-paper">The packet is open.</p>
            <p className="mt-2 text-body text-white/65">
              Everything is yours to print, copy and change. You do not need to tell us you used it,
              and you do not need us in the room.
            </p>
            <p className="mt-4 text-small text-white/45">
              If you&apos;d rather we came and ran it, email{" "}
              <a href="mailto:hello@aperturemethod.com" className="text-paper underline underline-offset-4">
                hello@aperturemethod.com
              </a>
              .
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            aria-label="Get the Look Closer packet"
            className="rounded-lg border border-white/20 bg-white/5 p-6"
          >
            <p className="text-body-lg font-semibold text-paper">One email and it&apos;s yours.</p>
            <p className="mt-2 text-body text-white/65">
              We ask so we can send you the new business cards as we write them — and so we know
              which schools are using this. Nothing else, and never to your students.
            </p>

            <label htmlFor={`${uid}-email`} className="mt-5 block text-small font-medium text-white/70">
              Your email
            </label>
            <input
              id={`${uid}-email`}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@yourschool.edu"
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? errId : undefined}
              className="mt-2 h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 text-[16px] text-paper placeholder:text-white/35 focus:border-white focus:outline-none"
            />

            {/* Honeypot */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -m-px h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)]"
            >
              <label htmlFor={`${uid}-website`}>Leave blank</label>
              <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button type="submit" className="btn--on-dark mt-4 h-12 w-full" disabled={status === "submitting"}>
              {status === "submitting" ? "Opening…" : "Open the packet"}
            </button>

            {hasError && (
              <p id={errId} role="alert" className="mt-3 text-small font-medium text-maroon-onDark">
                {message}
              </p>
            )}

            <p className="mt-4 text-small text-white/40">
              The one-page overview above is open to everyone — grab that if you just need something
              to forward.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
