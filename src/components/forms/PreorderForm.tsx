"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EMAIL_RE } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { Confetti } from "./Confetti";
import { MAYS_OFFER } from "@/lib/book";

/**
 * Book pre-order capture for "Look Closer".
 *
 * Posts to /api/book/preorder, which stores the address, the Mays MBA flag and
 * the timestamp in Supabase and notifies Fenwick. It used to post to the
 * newsletter endpoint, where a reservation could vanish into the server log.
 *
 * On success: confetti and a thank-you dialog, then a quiet inline confirmation
 * that stays put, because the celebration should not be the only receipt.
 *
 * `tone="dark"` is for the dark bookend sections; `compact` drops the trailing
 * helper copy for the hero, where the surrounding text already says it.
 */
export function PreorderForm({
  source = "book",
  tone = "light",
  compact = false,
}: {
  /** Which part of the site this sign-up came from; stored with the row. */
  source?: string;
  tone?: "light" | "dark";
  compact?: boolean;
}) {
  const uid = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [mays, setMays] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [thanksOpen, setThanksOpen] = useState(false);
  const [alreadyOn, setAlreadyOn] = useState(false);

  const dark = tone === "dark";

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
    track("book_preorder_submit", { mays });
    try {
      const res = await fetch("/api/book/preorder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, website, mays, source }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        alreadyOn?: boolean;
      };
      if (res.ok && data.ok) {
        setAlreadyOn(Boolean(data.alreadyOn));
        setStatus("success");
        setCelebrate(true);
        setThanksOpen(true);
        track("book_preorder_success", { mays });
        return;
      }
      setStatus("error");
      setMessage(data.message ?? "Something went wrong. Please try again shortly.");
      track("book_preorder_error");
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Please try again shortly.");
      track("book_preorder_error");
    }
  }

  if (status === "success") {
    return (
      <>
        <Overlay>
          <Confetti fire={celebrate} onDone={() => setCelebrate(false)} />
          <ThanksDialog
            open={thanksOpen}
            mays={mays}
            alreadyOn={alreadyOn}
            onClose={() => setThanksOpen(false)}
          />
        </Overlay>
        <div
          role="status"
          aria-live="polite"
          className={
            dark
              ? "rounded-lg border border-white/15 bg-white/5 p-5"
              : "rounded-lg border border-line bg-paper p-5"
          }
        >
          <p className={`text-body font-semibold ${dark ? "text-paper" : "text-ink"}`}>
            {alreadyOn ? "You were already on the list." : "You’re on the pre-order list."}
          </p>
          <p className={`mt-1 text-small ${dark ? "text-white/70" : "text-muted"}`}>
            {mays
              ? "Mays MBA cohort noted — your copy is covered. We’ll email the sample chapter first, then the book."
              : "We’ll email you the sample chapter first, and again the week it ships."}
          </p>
        </div>
      </>
    );
  }

  const errId = `${uid}-error`;
  const hasError = status === "error";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Pre-order the book"
      className="mt-2 max-w-md"
    >
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
            className={
              dark
                ? "w-full rounded-sm border border-white/25 bg-white/10 px-4 py-3 text-body text-paper outline-none transition-colors placeholder:text-white/50 focus:border-maroon-soft"
                : "w-full rounded-sm border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition-colors placeholder:text-muted focus:border-maroon"
            }
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

      <label
        className={`mt-3 flex items-start gap-2.5 text-small ${dark ? "text-white/80" : "text-body"}`}
      >
        <input
          type="checkbox"
          checked={mays}
          onChange={(e) => setMays(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-maroon"
        />
        <span>
          I&apos;m in a <strong className={dark ? "text-paper" : "text-ink"}>Mays MBA</strong> cohort.
          {/* The hero card already carries the offer as a badge; don't say it twice. */}
          {!compact && (
            <>
              {" "}
              <span className={dark ? "text-white/60" : "text-muted"}>{MAYS_OFFER.short}</span>
            </>
          )}
        </span>
      </label>

      {hasError && (
        <p
          id={errId}
          role="alert"
          className={`mt-2 text-small ${dark ? "text-maroon-onDark" : "text-maroon"}`}
        >
          {message}
        </p>
      )}
      {!compact && (
        <p className={`mt-3 text-small ${dark ? "text-white/60" : "text-muted"}`}>
          Reserve your copy, no charge now. We&apos;ll email you first when it ships.
        </p>
      )}
    </form>
  );
}

/** Renders into <body>. This form lives inside an animated <Reveal>, and a CSS
 *  transform makes a containing block for position:fixed, which would otherwise
 *  pin the confetti and the dialog inside a 400px-wide card under the header. */
function Overlay({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/** The thank-you. Escape or the backdrop closes it; the inline confirmation
 *  behind it is what remains. */
function ThanksDialog({
  open,
  mays,
  alreadyOn,
  onClose,
}: {
  open: boolean;
  mays: boolean;
  alreadyOn: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preorder-thanks-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-dark/70 backdrop-blur-[2px]"
      />
      <div className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-lg border border-line bg-paper shadow-2xl">
        <div className="sticky top-0 h-1.5 w-full bg-maroon" aria-hidden="true" />
        <div className="p-7 sm:p-9">
          <p className="eyebrow">{mays ? "Mays MBA · on the house" : "Pre-order confirmed"}</p>
          <h2
            id="preorder-thanks-title"
            className="mt-4 text-h2 font-semibold leading-tight text-ink"
          >
            {alreadyOn
              ? "You were already on the list."
              : mays
                ? "You’re on the list — and it’s on me."
                : "Thank you. You’re on the list."}
          </h2>
          <div className="mt-5 space-y-4 text-body text-body">
            <p>
              <em>Look Closer</em> is being written now, one chapter at a time, out of real
              engagements rather than theory. You have just put your name on a copy of a book that
              does not exist yet — a generous thing to do with an email address, and not something
              I take lightly.
            </p>
            {mays ? (
              <p>
                <strong className="font-semibold text-ink">{MAYS_OFFER.long}</strong> I will confirm
                how to claim it when the book is ready — nothing for you to do now.
              </p>
            ) : (
              <p>
                You will get the sample chapter before anyone else, and a note the week the book is
                available. No charge today, and nothing else in between.
              </p>
            )}
            <p className="text-muted">
              Two emails, maybe three. Unsubscribe in one click, any time.
            </p>
          </div>
          <p className="mt-6 border-l-2 border-maroon pl-4 text-small font-semibold text-ink">
            Fenwick How · The Aperture Method
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button ref={closeRef} type="button" onClick={onClose} className="btn">
              Wonderful
            </button>
            <a href="#excerpt" onClick={onClose} className="link-arrow text-small font-semibold">
              Read an excerpt while you wait
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
