"use client";

import { useEffect, useId, useState } from "react";
import { EMAIL_RE } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { lookCloserPacket } from "@/lib/lookCloser";

const STORAGE_KEY = "aperture:look-closer:unlocked";

/**
 * The materials block on /look-closer.
 *
 * This is a preview, not a DIY kit — Fenwick runs the session himself, and a
 * teacher looks at these so they know exactly what will be handed to their
 * students before they give up a period. The one-page overview stays open
 * because it is the sheet a teacher forwards to a principal, and a forward that
 * lands on a form goes nowhere. Everything else asks once for name, school and
 * email; the choice lives on each item's `gated` flag in `lib/lookCloser.ts`.
 */
export function PacketDownloads() {
  const uid = useId();
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

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
    const name = String(fd.get("name") ?? "").trim();
    const school = String(fd.get("school") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const website = String(fd.get("website") ?? "");

    if (!name) {
      setStatus("error");
      setMessage("Please add your name.");
      return;
    }
    if (!school) {
      setStatus("error");
      setMessage("Please add your school.");
      return;
    }
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
        body: JSON.stringify({ email, name, org: school, website, source: "look-closer-materials" }),
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
  const field =
    "mt-2 h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 text-[16px] text-paper placeholder:text-white/35 focus:border-white focus:outline-none";
  const label = "block text-small font-medium text-white/70";

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
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("look_closer_download", { file: item.title })}
                    className="link-arrow text-paper hover:text-maroon-soft"
                  >
                    Open the PDF
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
                  <p className="text-small text-white/40">Add your details to open this →</p>
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
            <p className="text-body-lg font-semibold text-paper">Everything&apos;s open.</p>
            <p className="mt-2 text-body text-white/65">
              Read anything you like. If something in there wouldn&apos;t work for your class — a
              business you&apos;d rather swap, a number you want simplified — tell me and I&apos;ll
              change it before I come.
            </p>
            <p className="mt-4 text-small text-white/45">
              To pick a date, email{" "}
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
            aria-label="See the Look Closer materials"
            className="rounded-lg border border-white/20 bg-white/5 p-6"
          >
            <p className="text-body-lg font-semibold text-paper">Have a look at everything.</p>
            <p className="mt-2 text-body text-white/65">
              Tell me who you are and I&apos;ll open the full set. I ask so I know which schools are
              interested and can reach you about a date — nothing else, and never anything to your
              students.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor={`${uid}-name`} className={label}>
                  Your name
                </label>
                <input id={`${uid}-name`} name="name" type="text" autoComplete="name" placeholder="Jane Alvarez" className={field} />
              </div>
              <div>
                <label htmlFor={`${uid}-school`} className={label}>
                  School
                </label>
                <input
                  id={`${uid}-school`}
                  name="school"
                  type="text"
                  autoComplete="organization"
                  placeholder="Roosevelt High School"
                  className={field}
                />
              </div>
              <div>
                <label htmlFor={`${uid}-email`} className={label}>
                  Email
                </label>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@yourschool.edu"
                  aria-invalid={hasError || undefined}
                  aria-describedby={hasError ? errId : undefined}
                  className={field}
                />
              </div>
            </div>

            {/* Honeypot */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -m-px h-px w-px overflow-hidden border-0 p-0 [clip:rect(0,0,0,0)]"
            >
              <label htmlFor={`${uid}-website`}>Leave blank</label>
              <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button type="submit" className="btn--on-dark mt-5 h-12 w-full" disabled={status === "submitting"}>
              {status === "submitting" ? "Opening…" : "Show me the materials"}
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
