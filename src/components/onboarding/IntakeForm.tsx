"use client";

import { useState } from "react";
import {
  intakeSections,
  intakeConsent,
  SYSTEM_ROWS,
  type IntakeField,
} from "@/lib/onboarding/content";
import type { OnboardingPayload, SignaturePayload } from "@/lib/onboarding/types";
import { SignaturePad } from "./SignaturePad";
import { inputCls, labelCls, errCls, FieldError, useOnboardingSubmit, SuccessPanel } from "./shared";

type Row = { area: string; system: string; available: string; share: string };
const initialRows: Row[] = SYSTEM_ROWS.map((area) => ({ area, system: "", available: "", share: "" }));

function Radio({
  field,
  value,
  onChange,
}: {
  field: IntakeField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {field.options!.map((opt) => {
        const sel = opt === value;
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(sel ? "" : opt)}
            className={
              "cursor-pointer select-none rounded-sm border px-4 py-2 text-small font-semibold transition-colors " +
              (sel ? "border-ink bg-ink text-paper" : "border-line text-body hover:border-ink")
            }
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function IntakeForm() {
  const [ans, setAns] = useState<Record<string, string>>({});
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [signature, setSignature] = useState<SignaturePayload | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { status, message, result, submit, download } = useOnboardingSubmit();

  const set = (name: string, v: string) => setAns((a) => ({ ...a, [name]: v }));
  const setRow = (i: number, key: keyof Row, v: string) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, [key]: v } : r)));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const answers: Record<string, string> = { ...ans, systems_matrix: JSON.stringify(rows) };
    const found: Record<string, string> = {};
    if (!answers.business_name?.trim()) found.business_name = "Please enter your company name.";
    if (!answers.first_name?.trim()) found.first_name = "Please enter your first name.";
    if (!answers.last_name?.trim()) found.last_name = "Please enter your last name.";
    if (!answers.contact_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.contact_email.trim()))
      found.contact_email = "Please enter a valid email.";
    if (!signature) found.signature = "Please add your signature.";
    if (!consent) found.consent = "Please confirm the statement.";
    setErrors(found);
    if (Object.keys(found).length) return;

    const payload: OnboardingPayload = {
      kind: "intake",
      answers,
      signerName: `${answers.first_name!.trim()} ${answers.last_name!.trim()}`.trim(),
      signerTitle: answers.title?.trim() || undefined,
      signerEmail: answers.contact_email!.trim(),
      company: answers.business_name!.trim(),
      signature: signature!,
      consent,
      website: "",
    };
    await submit(payload);
  }

  if (status === "success" && result) {
    return (
      <SuccessPanel
        title="Your intake is in."
        email={ans.contact_email ?? ""}
        onDownload={download}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      {intakeSections.map((section) => (
        <fieldset key={section.id} className="space-y-5">
          <legend className="text-h4 font-semibold text-ink">{section.title}</legend>
          {section.help && <p className="text-small text-muted">{section.help}</p>}

          {section.fields.map((f) => {
            if (f.type === "systems") {
              return (
                <div key={f.name} className="overflow-hidden rounded-sm border border-line">
                  <table className="w-full text-small">
                    <thead className="bg-surface text-left text-muted">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Area</th>
                        <th className="px-3 py-2 font-semibold">System (name)</th>
                        <th className="px-3 py-2 font-semibold">Data?</th>
                        <th className="px-3 py-2 font-semibold">Share?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={r.area} className="border-t border-line align-middle">
                          <td className="px-3 py-2 text-body">{r.area}</td>
                          <td className="px-3 py-2">
                            <input
                              value={r.system}
                              onChange={(e) => setRow(i, "system", e.target.value)}
                              className="w-full rounded-sm border border-line px-2 py-1.5 text-small focus:border-ink focus:outline-none"
                            />
                          </td>
                          {(["available", "share"] as const).map((key) => (
                            <td key={key} className="px-3 py-2">
                              <div className="flex gap-1">
                                {["Yes", "No"].map((opt) => {
                                  const sel = r[key] === opt;
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => setRow(i, key, sel ? "" : opt)}
                                      className={
                                        "rounded-sm border px-2 py-1 text-[13px] font-semibold " +
                                        (sel ? "border-ink bg-ink text-paper" : "border-line text-muted hover:border-ink")
                                      }
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }

            const err = errors[f.name];
            const common = {
              id: f.name,
              value: ans[f.name] ?? "",
              onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                set(f.name, e.target.value),
              className: inputCls + (err ? " " + errCls : ""),
              placeholder: f.placeholder,
            };
            return (
              <div key={f.name}>
                <label htmlFor={f.name} className={labelCls}>
                  {f.label}
                  {f.required && <span className="text-maroon"> *</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea {...common} rows={f.rows ?? 3} />
                ) : f.type === "radio" ? (
                  <Radio field={f} value={ans[f.name] ?? ""} onChange={(v) => set(f.name, v)} />
                ) : (
                  <input
                    {...common}
                    type={f.type === "email" ? "email" : f.type === "tel" ? "tel" : f.type === "url" ? "url" : "text"}
                  />
                )}
                <FieldError message={err} />
              </div>
            );
          })}
        </fieldset>
      ))}

      {/* Consent + signature */}
      <fieldset className="space-y-5 border-t border-line pt-8">
        <legend className="text-h4 font-semibold text-ink">7. Consent & signature</legend>
        <label className="flex items-start gap-3 text-body text-body">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-maroon"
          />
          <span>{intakeConsent}</span>
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

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn w-full justify-center py-4 text-base sm:w-auto sm:px-10 disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit intake form"}
      </button>
    </form>
  );
}
