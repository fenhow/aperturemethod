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
import { inputCls, labelCls, errCls, FieldError, useOnboardingSubmit, ErrorDialog, SuccessDialog } from "./shared";

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
  const [saving, setSaving] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const { status, message, submit, download } = useOnboardingSubmit();
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

  // ---- Resume a saved draft from ?draft=<token> -----------------------------
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("draft");
    if (!t) return;
    setLoadingDraft(true);
    fetch(`/api/intake/draft?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && data.draft) {
          setToken(data.draft.token);
          setAns(data.draft.answers ?? {});
          setSelected(data.draft.segments ?? []);
          if (data.draft.email) set("contact_email", data.draft.email);
          if (data.draft.signerName) set("contact_name", data.draft.signerName);
          setSaveMsg("Welcome back — your answers are filled in.");
        } else if (data?.completed) {
          setSaveMsg("This intake has already been submitted.");
        }
      })
      .catch(() => {})
      .finally(() => setLoadingDraft(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Silent autosave once a draft token exists ----------------------------
  const firstAutosave = useRef(true);
  useEffect(() => {
    if (!token) return;
    if (firstAutosave.current) {
      firstAutosave.current = false;
      return;
    }
    const id = setTimeout(() => {
      void fetch("/api/intake/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          email: ans.contact_email ?? "",
          company: ans.b_legal ?? "",
          signerName: ans.contact_name ?? "",
          segments: selected,
          answers: ans,
        }),
      }).catch(() => {});
    }, 1200);
    return () => clearTimeout(id);
  }, [ans, selected, token]);

  async function saveAndFinishLater() {
    const email = (ans.contact_email ?? "").trim();
    if (!EMAIL_RE.test(email)) {
      setErrors((e) => ({ ...e, contact_email: "Add your email so we can send your resume link." }));
      setProblems(["Add your email at the top so we can send you a private link to finish later."]);
      setErrOpen(true);
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/intake/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          company: ans.b_legal ?? "",
          signerName: ans.contact_name ?? "",
          segments: selected,
          answers: ans,
          sendLink: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data?.ok) {
        if (data.token) setToken(data.token);
        setSaveMsg(
          data.emailed
            ? `Saved. We emailed a private link to ${email} — open it any time to pick up where you left off.`
            : "Saved. You can return to this link to continue."
        );
      } else {
        setSaveMsg(data?.message ?? "We couldn't save just now. Please try again.");
      }
    } catch {
      setSaveMsg("We couldn't reach the server. Please try again.");
    } finally {
      setSaving(false);
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
      <SuccessDialog
        open={status === "success"}
        title="Intake received"
        summary={summary}
        onDownload={download}
        onHome={() => router.push("/")}
      />
    </>
  );
}

// Re-exported so the route page can show the intro copy without a second import.
export const intakeFormIntro = intakeIntro;
