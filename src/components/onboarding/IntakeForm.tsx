"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  intakeIntro,
  sharedIntro,
  sharedSections,
  segments as allSegments,
  intakeConsentLine,
  type IntakeField,
  type IntakeSection,
} from "@/lib/onboarding/intake";
import type { OnboardingPayload, SignaturePayload } from "@/lib/onboarding/types";
import { SignaturePad } from "./SignaturePad";
import { inputCls, labelCls, errCls, FieldError, useOnboardingSubmit, ErrorDialog, SuccessDialog, SavedDialog } from "./shared";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALL_KEYS = allSegments.map((s) => s.key);

function CheckGroup({
  field,
  selected,
  onToggle,
}: {
  field: IntakeField;
  selected: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      {field.options!.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onToggle(opt)}
            className={
              "flex items-start gap-3 rounded-sm border px-4 py-2.5 text-left text-body transition-colors " +
              (on ? "border-maroon bg-maroon/5" : "border-line hover:border-ink")
            }
          >
            <span
              className={
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border text-[13px] font-bold " +
                (on ? "border-maroon bg-maroon text-paper" : "border-line text-transparent")
              }
              aria-hidden="true"
            >
              ✓
            </span>
            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

export function IntakeForm() {
  const [ans, setAns] = useState<Record<string, string>>({});
  // Full Method (all five) is the default; a client can narrow to fewer.
  const [selected, setSelected] = useState<string[]>([...ALL_KEYS]);
  const [signature, setSignature] = useState<SignaturePayload | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errOpen, setErrOpen] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string>("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error" | "gone">("idle");
  const [savedOpen, setSavedOpen] = useState(false);
  const [linkEmailed, setLinkEmailed] = useState(false);
  const explained = useRef(false);
  const [saving, setSaving] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const { status, message, result, submit, download } = useOnboardingSubmit();
  const router = useRouter();

  const set = (name: string, v: string) => setAns((a) => ({ ...a, [name]: v }));

  const getArr = (name: string): string[] => {
    try {
      const v = ans[name];
      return v ? (JSON.parse(v) as string[]) : [];
    } catch {
      return [];
    }
  };
  const toggleInGroup = (name: string, opt: string) => {
    const cur = getArr(name);
    const next = cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt];
    set(name, JSON.stringify(next));
  };

  const toggleSegment = (key: string) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  const selectFull = () =>
    setSelected((s) => (ALL_KEYS.every((k) => s.includes(k)) ? [] : [...ALL_KEYS]));

  // ---- Draft persistence ----------------------------------------------------
  // Two layers, deliberately. The server is the real store; this browser is the
  // seatbelt for when it is unreachable. Losing a part-finished intake is the worst
  // thing this form can do, so it never depends on a single mechanism — and it never
  // waits for the client to press a button before it starts protecting their work.
  const LS_KEY = "aperture-intake-draft-v1";
  const EXPLAINED_KEY = "aperture-intake-explained-v1";
  const tokenRef = useRef<string | null>(null);
  const dirtyRef = useRef(false);
  const hydrated = useRef(false);
  const lastSavedAt = useRef(0);
  const stateRef = useRef({ ans, selected });
  stateRef.current = { ans, selected };

  const hasContent = (a: Record<string, string>) =>
    Object.values(a).some((v) => (v ?? "").trim() !== "" && v !== "[]");

  const persistLocal = () => {
    try {
      window.localStorage.setItem(
        LS_KEY,
        JSON.stringify({ ...stateRef.current, token: tokenRef.current, at: Date.now() })
      );
    } catch {
      /* private browsing / quota — the server copy is still the primary */
    }
  };

  const buildBody = (extra: Record<string, unknown> = {}) => ({
    token: tokenRef.current ?? undefined,
    email: (stateRef.current.ans.contact_email ?? "").trim(),
    company: stateRef.current.ans.b_legal ?? "",
    signerName: stateRef.current.ans.contact_name ?? "",
    segments: stateRef.current.selected,
    answers: stateRef.current.ans,
    ...extra,
  });

  async function saveNow(extra: Record<string, unknown> = {}) {
    setSaveState("saving");
    try {
      const res = await fetch("/api/intake/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(buildBody(extra)),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

      if (res.status === 410 || data?.gone) {
        setSaveState("gone");
        setSaveMsg(
          (data?.message as string) ??
            "This draft link is no longer active. Please copy your answers somewhere safe before leaving."
        );
        return { ok: false as const };
      }
      if (!res.ok || !data?.ok) {
        setSaveState("error");
        return { ok: false as const };
      }

      const newToken = data.token as string | undefined;
      if (newToken && newToken !== tokenRef.current) {
        tokenRef.current = newToken;
        setToken(newToken);
        // The tab itself becomes the resume link, so closing it is no longer fatal
        // even if the client never asks us to email them one.
        const url = new URL(window.location.href);
        url.searchParams.set("draft", newToken);
        window.history.replaceState(null, "", url.toString());
      }
      dirtyRef.current = false;
      lastSavedAt.current = Date.now();
      persistLocal();
      setSaveState("saved");

      // Tell the client once, the first time their work reaches us. Not on every save —
      // that would be nagging — and not when they arrived via a resume link, since they
      // already know how this works.
      if (!explained.current) {
        explained.current = true;
        let seen = false;
        try {
          seen = window.localStorage.getItem(EXPLAINED_KEY) === "1";
        } catch {
          /* ignore */
        }
        if (!seen) {
          try {
            window.localStorage.setItem(EXPLAINED_KEY, "1");
          } catch {
            /* ignore */
          }
          setSavedOpen(true);
        }
      }
      return { ok: true as const, emailed: Boolean(data.emailed) };
    } catch {
      setSaveState("error");
      return { ok: false as const };
    }
  }

  // Resume from ?draft=<token>, or fall back to whatever this browser still holds.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("draft");
    if (t) {
      setLoadingDraft(true);
      fetch(`/api/intake/draft?token=${encodeURIComponent(t)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.ok && data.draft) {
            tokenRef.current = data.draft.token;
            setToken(data.draft.token);
            setAns(data.draft.answers ?? {});
            // An empty segments array must never hide sections the client already
            // answered — the answers survive, but it reads to them as data loss.
            setSelected(data.draft.segments?.length ? data.draft.segments : [...ALL_KEYS]);
            if (data.draft.email) set("contact_email", data.draft.email);
            if (data.draft.signerName) set("contact_name", data.draft.signerName);
            setSaveMsg("Welcome back — your answers are filled in.");
            setSaveState("saved");
            explained.current = true;
          } else if (data?.completed) {
            setSaveMsg("This intake has already been submitted.");
            setSaveState("gone");
          } else {
            setSaveMsg("We couldn't open that link, but anything you type here will still be saved.");
          }
        })
        .catch(() =>
          setSaveMsg("We couldn't reach the server. Your answers are being kept in this browser.")
        )
        .finally(() => {
          hydrated.current = true;
          setLoadingDraft(false);
        });
      return;
    }
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      const cached = raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
      const cachedAns = cached?.ans as Record<string, string> | undefined;
      if (cachedAns && hasContent(cachedAns)) {
        setAns(cachedAns);
        const seg = cached?.selected as string[] | undefined;
        if (seg?.length) setSelected(seg);
        if (cached?.token) {
          tokenRef.current = cached.token as string;
          setToken(cached.token as string);
        }
        setSaveMsg("We restored the answers you had in progress on this device.");
      }
    } catch {
      /* ignore a corrupted cache rather than blocking the form */
    }
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave. Not gated on a token: the first keystroke creates the draft, so a client
  // who fills the whole form in one sitting and closes the tab has still lost nothing.
  useEffect(() => {
    if (!hydrated.current || saveState === "gone") return;
    if (!hasContent(ans)) return;
    dirtyRef.current = true;
    persistLocal();
    // Debounced — but a fast typist never leaves a 1.2s gap, so force a save every 15s
    // regardless, or a long passage would never reach the server at all.
    const overdue = Date.now() - lastSavedAt.current > 15000;
    const id = setTimeout(() => void saveNow(), overdue ? 0 : 1200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ans, selected]);

  // Flush on tab close / hide, and warn before leaving with unsaved work.
  useEffect(() => {
    const flush = () => {
      if (!dirtyRef.current) return;
      persistLocal();
      try {
        navigator.sendBeacon(
          "/api/intake/draft",
          new Blob([JSON.stringify(buildBody())], { type: "application/json" })
        );
      } catch {
        /* best effort */
      }
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    const onUnload = (e: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", onUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function emailLinkFromDialog() {
    setSaving(true);
    const res = await saveNow({ sendLink: true });
    if (res.ok && res.emailed) setLinkEmailed(true);
    else if (res.ok) {
      setSaveMsg("Saved, but we couldn't send the email just now. Your link is above — please copy it.");
      setSavedOpen(false);
    }
    setSaving(false);
  }

  /** Save now and hand over the resume link. The dialog collects the email if they want it
   *  posted to them — asking for an address before showing them anything is friction for no
   *  reason, since the link works without one. */
  async function saveAndFinishLater() {
    setSaving(true);
    setSaveMsg("");
    const res = await saveNow();
    setSaving(false);
    if (res.ok) {
      setSavedOpen(true);
    } else if (saveState !== "gone") {
      setSaveMsg(
        "We couldn't reach the server just now. Your answers are safe in this browser — please try again in a moment."
      );
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (!ans.contact_name?.trim()) found.contact_name = "Please enter your full name.";
    if (!ans.contact_email?.trim() || !EMAIL_RE.test(ans.contact_email.trim()))
      found.contact_email = "Please enter a valid email.";
    if (!ans.b_legal?.trim()) found.b_legal = "Please enter your business name.";
    if (selected.length === 0) found.segments = "Choose at least one part of the Method.";
    if (!signature) found.signature = "Please add your signature.";
    if (!consent) found.consent = "Please confirm the statement.";
    setErrors(found);
    if (Object.keys(found).length) {
      setProblems(Object.values(found));
      setErrOpen(true);
      return;
    }

    dirtyRef.current = false;
    try {
      window.localStorage.removeItem(LS_KEY);
    } catch {
      /* nothing to clean up */
    }

    const payload: OnboardingPayload = {
      kind: "intake",
      answers: ans,
      signerName: ans.contact_name!.trim(),
      signerTitle: ans.contact_title?.trim() || undefined,
      signerEmail: ans.contact_email!.trim(),
      company: ans.b_legal!.trim(),
      signature: signature!,
      consent,
      segments: selected,
      draftToken: token ?? undefined,
      website: "",
    };
    await submit(payload);
  }

  const summary: [string, string][] = [
    ["Name", (ans.contact_name ?? "").trim()],
    ["Company", (ans.b_legal ?? "").trim()],
    ["Email", (ans.contact_email ?? "").trim()],
    ["Parts", selected.map((k) => allSegments.find((s) => s.key === k)?.name).filter(Boolean).join(", ")],
  ];

  const renderField = (f: IntakeField) => {
    const err = errors[f.name];
    if (f.type === "checkgroup") {
      return (
        <div key={f.name}>
          <p className={labelCls}>{f.label}</p>
          <CheckGroup field={f} selected={getArr(f.name)} onToggle={(opt) => toggleInGroup(f.name, opt)} />
        </div>
      );
    }
    const common = {
      id: f.name,
      value: ans[f.name] ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(f.name, e.target.value),
      className: inputCls + (err ? " " + errCls : ""),
    };
    return (
      <div key={f.name}>
        <label htmlFor={f.name} className={labelCls}>
          {f.label}
        </label>
        {f.type === "textarea" ? <textarea {...common} rows={f.rows ?? 3} /> : <input {...common} type="text" />}
        <FieldError message={err} />
      </div>
    );
  };

  const renderSection = (section: IntakeSection) => (
    <fieldset key={section.id} className="space-y-5">
      <legend className="text-h4 font-semibold text-ink">{section.title}</legend>
      {section.help && <p className="text-small text-muted">{section.help}</p>}
      {section.fields.map(renderField)}
    </fieldset>
  );

  const chosenSegments = allSegments.filter((s) => selected.includes(s.key));
  const fullOn = ALL_KEYS.every((k) => selected.includes(k));

  return (
    <>
      <form onSubmit={onSubmit} noValidate className="space-y-12">
        {/* Your details */}
        <fieldset className="space-y-5">
          <legend className="text-h4 font-semibold text-ink">Your details</legend>
          <p className="text-small text-muted">
            So we know who we&apos;re speaking with — and where to send your copy and your resume link.
          </p>
          <div>
            <label htmlFor="contact_name" className={labelCls}>
              Full name<span className="text-maroon"> *</span>
            </label>
            <input
              id="contact_name"
              value={ans.contact_name ?? ""}
              onChange={(e) => set("contact_name", e.target.value)}
              className={inputCls + (errors.contact_name ? " " + errCls : "")}
            />
            <FieldError message={errors.contact_name} />
          </div>
          <div>
            <label htmlFor="contact_title" className={labelCls}>
              Your title
            </label>
            <input
              id="contact_title"
              value={ans.contact_title ?? ""}
              onChange={(e) => set("contact_title", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="contact_email" className={labelCls}>
              Email<span className="text-maroon"> *</span>
            </label>
            <input
              id="contact_email"
              type="email"
              value={ans.contact_email ?? ""}
              onChange={(e) => set("contact_email", e.target.value)}
              className={inputCls + (errors.contact_email ? " " + errCls : "")}
            />
            <FieldError message={errors.contact_email} />
          </div>
        </fieldset>

        {/* Which parts of the Method */}
        <fieldset className="space-y-4">
          <legend className="text-h4 font-semibold text-ink">Which parts of the Method are we doing?</legend>
          <p className="text-small text-muted">
            Everyone answers the shared foundation below. The <span className="font-semibold text-ink">Full
            Method</span> is selected by default — most clients do the complete engagement. Doing just part
            of it? Deselect it and choose only the part(s) you&apos;ve engaged, and we&apos;ll show just
            those questions.
          </p>

          {/* Full Method — primary, default, red-bordered */}
          <button
            type="button"
            onClick={selectFull}
            className={
              "flex w-full flex-col rounded-lg border-2 p-5 text-left transition-colors " +
              (fullOn ? "border-maroon bg-maroon/5" : "border-line hover:border-maroon")
            }
          >
            <span className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <span className="rounded-sm bg-maroon px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-paper">
                  Recommended
                </span>
                <span className="text-body font-semibold text-ink">Full Method — all five</span>
              </span>
              <span
                className={
                  "flex h-6 w-6 items-center justify-center rounded-[4px] border text-[15px] font-bold " +
                  (fullOn ? "border-maroon bg-maroon text-paper" : "border-line text-transparent")
                }
                aria-hidden="true"
              >
                ✓
              </span>
            </span>
            <span className="mt-2 text-small text-muted">
              The complete engagement — all five phases, in sequence. You get:{" "}
              <span className="font-semibold text-maroon">
                {allSegments.map((s) => s.gives).join(" · ")}
              </span>
              .
            </span>
          </button>

          <p className="pt-1 text-caption font-semibold uppercase tracking-overline text-muted">
            Or choose individual parts
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {allSegments.map((s) => {
              const on = selected.includes(s.key);
              return (
                <button
                  type="button"
                  key={s.key}
                  onClick={() => toggleSegment(s.key)}
                  className={
                    "flex flex-col rounded-lg border p-4 text-left transition-colors " +
                    (on ? "border-maroon bg-maroon/5" : "border-line hover:border-ink")
                  }
                >
                  <span className="flex items-center justify-between">
                    <span className="text-small font-semibold text-maroon">{s.phase} · {s.verb}</span>
                    <span
                      className={
                        "flex h-5 w-5 items-center justify-center rounded-[3px] border text-[13px] font-bold " +
                        (on ? "border-maroon bg-maroon text-paper" : "border-line text-transparent")
                      }
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </span>
                  <span className="mt-1 text-body font-semibold text-ink">{s.name}</span>
                  <span className="mt-2 inline-block w-fit rounded-sm bg-maroon/10 px-2 py-0.5 text-[12px] font-semibold text-maroon">
                    You get: {s.gives}
                  </span>
                  <span className="mt-2 text-small text-muted">{s.blurb}</span>
                </button>
              );
            })}
          </div>
          <FieldError message={errors.segments} />
        </fieldset>

        {/* Shared foundation */}
        <div className="space-y-10 border-t border-line pt-10">
          <p className="max-w-measure text-body text-muted">{sharedIntro}</p>
          {sharedSections.map(renderSection)}
        </div>

        {/* Chosen segments */}
        {chosenSegments.map((seg) => (
          <div key={seg.key} className="space-y-10 border-t border-line pt-10">
            <div>
              <p className="eyebrow mb-2">{seg.phase} · {seg.verb}</p>
              <h2 className="text-h3 font-semibold text-ink">{seg.name}</h2>
              <p className="mt-2 max-w-measure text-body text-muted">{seg.blurb}</p>
            </div>
            {seg.sections.map(renderSection)}
          </div>
        ))}

        {/* Consent + signature */}
        <fieldset className="space-y-5 border-t border-line pt-10">
          <legend className="text-h4 font-semibold text-ink">Consent &amp; signature</legend>
          <label className="flex items-start gap-3 text-body text-body">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-maroon"
            />
            <span>{intakeConsentLine}</span>
          </label>
          <FieldError message={errors.consent} />
          <div>
            <p className={labelCls}>Signature</p>
            <div className="mt-2">
              <SignaturePad value={signature} onChange={setSignature} error={errors.signature} />
            </div>
          </div>
        </fieldset>

        {status === "error" && (
          <p className="rounded-sm border border-maroon bg-maroon/5 p-4 text-small font-medium text-maroon">{message}</p>
        )}
        {/* A persistent, honest save signal — FIXED, not in the flow.
            It first shipped inline above the submit button, which put it ~600px below
            a 108-question form: autosave fired on the first keystroke at the top and
            reported success where nobody could see it. A save indicator that scrolls
            out of view is the same as no indicator. */}
        {/* Floating save signal. Once there is a draft to return to, it also becomes the
            way back into the explainer — a one-time popup is easy to miss, and the client
            should never have to hunt for their own resume link. */}
        {saveState !== "idle" && (
          saveState === "saved" && token ? (
            <button
              type="button"
              onClick={() => setSavedOpen(true)}
              aria-live="polite"
              className="fixed bottom-4 right-4 z-50 flex max-w-[min(22rem,calc(100vw-2rem))] items-start gap-2
                         rounded-sm border border-line bg-surface px-3.5 py-2.5 text-left text-small
                         font-medium text-ink shadow-lg transition-colors hover:border-ink"
            >
              <span aria-hidden="true" className="leading-5">✓</span>
              <span>
                Saved. You can close this page and come back to it.
                <span className="mt-0.5 block text-maroon underline">Get my link →</span>
              </span>
            </button>
          ) : (
            <div
              aria-live="polite"
              className={
                "fixed bottom-4 right-4 z-50 flex max-w-[min(22rem,calc(100vw-2rem))] items-start gap-2 " +
                "rounded-sm border px-3.5 py-2.5 text-small font-medium shadow-lg " +
                (saveState === "error" || saveState === "gone"
                  ? "border-maroon bg-maroon text-paper"
                  : "border-line bg-surface text-ink")
              }
            >
              <span aria-hidden="true" className="leading-5">
                {saveState === "saving" ? "⟳" : saveState === "saved" ? "✓" : "!"}
              </span>
              <span>
                {saveState === "saving" && "Saving…"}
                {saveState === "saved" && "Saved. You can close this page and come back to it."}
                {saveState === "error" &&
                  "Not saved to our server — your answers are being kept in this browser. We'll keep retrying."}
                {saveState === "gone" &&
                  "This draft is no longer active. Copy your answers somewhere safe before leaving this page."}
              </span>
            </div>
          )
        )}
        {saveMsg && (
          <p className="rounded-sm border border-line bg-surface p-4 text-small font-medium text-ink">{saveMsg}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn w-full justify-center py-4 text-base sm:w-auto sm:px-10 disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting…" : "Submit intake"}
          </button>
          <button
            type="button"
            onClick={saveAndFinishLater}
            disabled={saving || loadingDraft}
            className="btn--secondary w-full justify-center py-4 sm:w-auto sm:px-8 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save & finish later"}
          </button>
        </div>
        <p className="text-small text-muted">
          Short on time? Save and we&apos;ll email you a private link to finish on any device.
        </p>
      </form>

      <ErrorDialog open={errOpen} problems={problems} onClose={() => setErrOpen(false)} />
      <SavedDialog
        open={savedOpen}
        resumeUrl={token ? `${typeof window === "undefined" ? "" : window.location.origin}/onboarding/intake?draft=${token}` : ""}
        email={ans.contact_email ?? ""}
        onEmailChange={(v) => set("contact_email", v)}
        onEmailLink={emailLinkFromDialog}
        emailing={saving}
        emailed={linkEmailed}
        onClose={() => setSavedOpen(false)}
      />
      <SuccessDialog
        open={status === "success"}
        title="Intake received"
        summary={summary}
        onDownload={download}
        onHome={() => router.push("/")}
        note={
          result?.emailed && result?.stored
            ? "A signed copy has been emailed to you and saved to your secure client area."
            : result?.emailed
              ? "A signed copy has been emailed to you. Please keep it — download it below as well."
              : result?.stored
                ? "Saved to your secure client area. Download a signed copy below for your records."
                : "We have your submission. Please download your signed copy below and keep it — we could not email it."
        }
      />
    </>
  );
}

// Re-exported so the route page can show the intro copy without a second import.
export const intakeFormIntro = intakeIntro;
