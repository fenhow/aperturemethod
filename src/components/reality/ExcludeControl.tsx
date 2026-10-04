"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Exclude / Restore / Delete, one set per row of the dashboard's response
 * table (Oct 2026). Excluding asks for a reason; restoring is one click;
 * deleting asks "Delete for good?" first, in the page, never a browser dialog.
 * The page refreshes so every figure, chart and the PDF recalculate.
 */
export function ExcludeControl({
  runId,
  removed,
  canExclude,
  reasons,
}: {
  runId: string;
  /** True when Fenwick removed it (restorable). */
  removed: boolean;
  /** False for automatic exclusions (test, repeat, too fast): only Delete applies. */
  canExclude: boolean;
  reasons: readonly string[];
}) {
  return (
    <div className="flex items-start justify-end gap-2">
      {canExclude ? <ExcludeOrRestore runId={runId} removed={removed} reasons={reasons} /> : null}
      <DeleteButton runId={runId} />
    </div>
  );
}

async function post(body: object) {
  const res = await fetch("/method-lab/study/exclude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { ok?: boolean; message?: string };
  if (!res.ok || !data.ok) throw new Error(data.message ?? "Could not save.");
}

function DeleteButton({ runId }: { runId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function del() {
    setBusy(true);
    setErr(null);
    try {
      await post({ runId, action: "delete" });
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete.");
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="whitespace-nowrap px-1 py-1 text-[12px] text-muted underline-offset-2 hover:text-maroon hover:underline"
      >
        Delete
      </button>
    );
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <span className="whitespace-nowrap text-[12px] font-semibold text-maroon">Delete for good?</span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={del}
          className="rounded-full bg-maroon px-3 py-1 text-[12px] font-semibold text-white disabled:opacity-50"
        >
          {busy ? "…" : "Yes, delete"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-[12px] text-muted hover:text-ink">
          No
        </button>
      </div>
      {err ? <p className="max-w-[200px] text-[11px] text-maroon">{err}</p> : null}
    </div>
  );
}

function ExcludeOrRestore({
  runId,
  removed,
  reasons,
}: {
  runId: string;
  removed: boolean;
  reasons: readonly string[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0] ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function send(r: string | null) {
    setBusy(true);
    setErr(null);
    try {
      await post({ runId, reason: r });
      setOpen(false);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  if (removed) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => send(null)}
        className="whitespace-nowrap rounded-full border border-line px-3 py-1 text-[12px] font-semibold text-ink transition-colors hover:border-maroon disabled:opacity-50"
      >
        {busy ? "…" : "Restore"}
      </button>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="whitespace-nowrap rounded-full border border-line px-3 py-1 text-[12px] font-semibold text-maroon transition-colors hover:border-maroon"
      >
        Exclude
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="rounded-md border border-line bg-paper px-2 py-1 text-[12px] text-ink"
        aria-label="Reason for excluding"
      >
        {reasons.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => send(reason)}
          className="rounded-full bg-maroon px-3 py-1 text-[12px] font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Exclude"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-[12px] text-muted hover:text-ink">
          Cancel
        </button>
      </div>
      {err ? <p className="max-w-[200px] text-[11px] text-maroon">{err}</p> : null}
    </div>
  );
}
