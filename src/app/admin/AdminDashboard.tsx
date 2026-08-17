"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  sharedSections,
  segments as segList,
  segmentByKey,
  type IntakeField,
  type IntakeSection,
} from "@/lib/onboarding/intake";

export type AdminClient = {
  id: string;
  full_name: string | null;
  company: string | null;
  email: string | null;
};

export type AdminDoc = {
  id: string;
  name: string;
  size: number | null;
  created_at: string;
  path: string;
  owner_id: string;
  folder: string | null;
};

export type AdminIntakeSub = {
  id: string;
  company: string | null;
  signer_name: string | null;
  signer_title: string | null;
  signer_email: string | null;
  segments: string[] | null;
  answers: Record<string, unknown> | null;
  document_id: string | null;
  created_at: string;
};

export type AdminDraft = {
  token: string;
  company: string | null;
  signer_name: string | null;
  email: string | null;
  segments: string[] | null;
  answers: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

/** A completed intake or an in-progress draft, normalized for the list. */
type IntakeRow = {
  key: string;
  status: "completed" | "in-progress";
  name: string;
  company: string;
  email: string;
  title: string;
  segments: string[];
  answers: Record<string, string>;
  documentId: string | null;
  updated: string;
};

function segNames(keys: string[]): string {
  const names = keys.map((k) => segmentByKey[k]?.name ?? k);
  if (names.length === segList.length) return "Full Method (all five)";
  return names.join(", ") || "—";
}

function answerValue(f: IntakeField, raw: string): string {
  if (f.type === "checkgroup") {
    try {
      const arr = JSON.parse(raw || "[]") as string[];
      return arr.length ? arr.join("; ") : "";
    } catch {
      return raw;
    }
  }
  return raw;
}

const NEW_FOLDER = "__new__";
const NO_FOLDER = "__none__";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let n = bytes;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function AdminDashboard({
  adminId,
  clients,
  docs,
  intakeSubs = [],
  drafts = [],
}: {
  adminId: string;
  clients: AdminClient[];
  docs: AdminDoc[];
  intakeSubs?: AdminIntakeSub[];
  drafts?: AdminDraft[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"documents" | "intakes">("documents");
  const [openIntake, setOpenIntake] = useState<string | null>(null);
  const [owner, setOwner] = useState<string>(adminId);
  const [folderSel, setFolderSel] = useState<string>(NO_FOLDER);
  const [newFolder, setNewFolder] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const label = (id: string) => {
    if (id === adminId) return "My private documents";
    const c = clients.find((x) => x.id === id);
    return c ? c.full_name || c.company || c.email || "Client" : "Unknown";
  };

  const grouped = useMemo(() => {
    const map = new Map<string, AdminDoc[]>();
    for (const d of docs) {
      const arr = map.get(d.owner_id) ?? [];
      arr.push(d);
      map.set(d.owner_id, arr);
    }
    return map;
  }, [docs]);

  // Existing folder names for the currently-selected owner.
  const ownerFolders = useMemo(() => {
    const set = new Set<string>();
    for (const d of docs) if (d.owner_id === owner && d.folder) set.add(d.folder);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [docs, owner]);

  const docsById = useMemo(() => {
    const m = new Map<string, AdminDoc>();
    for (const d of docs) m.set(d.id, d);
    return m;
  }, [docs]);

  // Completed intakes + in-progress drafts, normalized and sorted newest-first.
  const intakeRows = useMemo<IntakeRow[]>(() => {
    const norm = (a: Record<string, unknown> | null): Record<string, string> => {
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(a ?? {})) out[k] = v == null ? "" : String(v);
      return out;
    };
    const rows: IntakeRow[] = [];
    for (const s of intakeSubs) {
      const ans = norm(s.answers);
      rows.push({
        key: `sub-${s.id}`,
        status: "completed",
        name: s.signer_name || ans.contact_name || "—",
        company: s.company || ans.b_legal || "—",
        email: s.signer_email || ans.contact_email || "",
        title: s.signer_title || ans.contact_title || "",
        segments: s.segments ?? [],
        answers: ans,
        documentId: s.document_id,
        updated: s.created_at,
      });
    }
    for (const d of drafts) {
      const ans = norm(d.answers);
      rows.push({
        key: `draft-${d.token}`,
        status: "in-progress",
        name: d.signer_name || ans.contact_name || "—",
        company: d.company || ans.b_legal || "—",
        email: d.email || ans.contact_email || "",
        title: ans.contact_title || "",
        segments: d.segments ?? [],
        answers: ans,
        documentId: null,
        updated: d.updated_at,
      });
    }
    return rows.sort((a, b) => b.updated.localeCompare(a.updated));
  }, [intakeSubs, drafts]);

  async function openIntakePdf(documentId: string) {
    const doc = docsById.get(documentId);
    if (doc) return openDoc(doc);
    // fall back: look the path up directly if it isn't in the current doc list
    const supabase = createClient();
    const { data: row } = await supabase.from("documents").select("path").eq("id", documentId).single();
    if (row?.path) {
      const { data } = await supabase.storage.from("documents").createSignedUrl(row.path, 60);
      if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    }
  }

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }
  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    const folder =
      folderSel === NEW_FOLDER ? newFolder.trim() || null : folderSel === NO_FOLDER ? null : folderSel;

    setBusy(true);
    setError(null);
    const supabase = createClient();
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        setProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
        const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
        const path = `${owner}/${crypto.randomUUID()}${ext}`;
        const up = await supabase.storage
          .from("documents")
          .upload(path, file, { contentType: file.type || "application/octet-stream" });
        if (up.error) {
          setError(`${file.name}: ${up.error.message}`);
          setBusy(false);
          setProgress("");
          return;
        }
        const ins = await supabase.from("documents").insert({
          owner_id: owner,
          name: file.name,
          path,
          size: file.size,
          content_type: file.type || null,
          uploaded_by: adminId,
          folder,
        });
        if (ins.error) {
          await supabase.storage.from("documents").remove([path]);
          setError(`${file.name}: ${ins.error.message}`);
          setBusy(false);
          setProgress("");
          return;
        }
      }
      setFiles([]);
      setNewFolder("");
      if (folderSel === NEW_FOLDER) setFolderSel(NO_FOLDER);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  async function openDoc(d: AdminDoc) {
    const supabase = createClient();
    const { data } = await supabase.storage.from("documents").createSignedUrl(d.path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }
  async function downloadDoc(d: AdminDoc) {
    const supabase = createClient();
    const { data } = await supabase.storage.from("documents").createSignedUrl(d.path, 60, { download: d.name });
    if (data?.signedUrl) window.location.href = data.signedUrl;
  }
  async function remove(d: AdminDoc) {
    if (!window.confirm(`Delete "${d.name}"? This can't be undone.`)) return;
    const supabase = createClient();
    await supabase.storage.from("documents").remove([d.path]);
    await supabase.from("documents").delete().eq("id", d.id);
    router.refresh();
  }

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/portal/login");
    router.refresh();
  }

  const ownerOrder = [adminId, ...clients.map((c) => c.id)];

  // Group an owner's docs by folder (folders sorted; "No folder" last).
  function byFolder(list: AdminDoc[]): [string | null, AdminDoc[]][] {
    const map = new Map<string | null, AdminDoc[]>();
    for (const d of list) {
      const k = d.folder || null;
      const arr = map.get(k) ?? [];
      arr.push(d);
      map.set(k, arr);
    }
    const named = [...map.entries()].filter(([k]) => k !== null).sort((a, b) => (a[0] as string).localeCompare(b[0] as string));
    const none = map.has(null) ? ([[null, map.get(null)!]] as [string | null, AdminDoc[]][]) : [];
    return [...named, ...none];
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-8 flex gap-6 border-b border-line">
        {([["documents", "Documents"], ["intakes", "Intakes"]] as const).map(([k, lbl]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={
              "relative -mb-px border-b-2 px-1 pb-3 text-body font-semibold transition-colors " +
              (tab === k ? "border-maroon text-ink" : "border-transparent text-muted hover:text-ink")
            }
          >
            {lbl}
            {k === "intakes" && intakeRows.length > 0 ? (
              <span className="ml-2 rounded-full bg-maroon/10 px-2 py-0.5 text-caption font-semibold text-maroon">
                {intakeRows.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "documents" && (
      <div>
      {/* Upload */}
      <form onSubmit={upload} className="rounded-lg border border-line bg-surface p-6">
        <p className="text-body-lg font-medium text-ink">Add documents</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-small font-medium text-ink">Assign to</span>
            <select
              value={owner}
              onChange={(e) => {
                setOwner(e.target.value);
                setFolderSel(NO_FOLDER);
              }}
              className="w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-maroon"
            >
              <option value={adminId}>My private documents</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name || c.company || c.email}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-small font-medium text-ink">Folder</span>
            <select
              value={folderSel}
              onChange={(e) => setFolderSel(e.target.value)}
              className="w-full rounded-sm border border-line bg-paper px-3 py-2.5 text-body text-ink outline-none focus:border-maroon"
            >
              <option value={NO_FOLDER}>No folder</option>
              {ownerFolders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
              <option value={NEW_FOLDER}>＋ Create new folder…</option>
            </select>
            {folderSel === NEW_FOLDER && (
              <input
                type="text"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                placeholder="New folder name"
                className="mt-2 w-full rounded-sm border border-line bg-paper px-3 py-2 text-body text-ink outline-none focus:border-maroon"
              />
            )}
          </label>
        </div>

        {/* Drag & drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={
            "mt-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors " +
            (dragOver ? "border-maroon bg-maroon/5" : "border-line bg-paper")
          }
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={(e) => addFiles(e.target.files)}
            className="hidden"
          />
          <p className="text-body text-ink">Drag &amp; drop files here</p>
          <p className="mt-1 text-small text-muted">
            or{" "}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="font-medium text-maroon underline underline-offset-2"
            >
              browse your computer
            </button>
          </p>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 divide-y divide-line rounded-lg border border-line bg-paper">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="min-w-0 truncate text-small text-ink">
                  {f.name} <span className="text-muted">· {formatSize(f.size)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="shrink-0 text-small font-medium text-muted hover:text-maroon"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="mt-3 text-small text-maroon">{error}</p>}
        {progress && <p className="mt-3 text-small text-muted">{progress}</p>}

        <button type="submit" disabled={files.length === 0 || busy} className="btn mt-4 disabled:opacity-60">
          {busy ? "Uploading…" : files.length > 1 ? `Upload ${files.length} files` : "Upload"}
        </button>

        {clients.length === 0 && (
          <p className="mt-3 text-small text-muted">
            No client accounts yet. A client appears here once they sign in for the first time at the
            portal (or after you invite them from Supabase).
          </p>
        )}
      </form>

      {/* Documents by owner → folder */}
      <div className="mt-10 space-y-8">
        {ownerOrder.map((id) => {
          const list = grouped.get(id) ?? [];
          return (
            <div key={id}>
              <div className="flex items-baseline justify-between">
                <h2 className="text-h4 font-semibold text-ink">{label(id)}</h2>
                <span className="text-small text-muted">
                  {list.length} {list.length === 1 ? "file" : "files"}
                </span>
              </div>
              {list.length === 0 ? (
                <p className="mt-3 rounded-lg border border-dashed border-line p-4 text-small text-muted">
                  No documents yet.
                </p>
              ) : (
                <div className="mt-3 space-y-4">
                  {byFolder(list).map(([folder, items]) => (
                    <div key={folder ?? "__nofolder__"}>
                      {folder && (
                        <p className="mb-1.5 flex items-center gap-1.5 text-small font-semibold text-maroon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h5l2 3h9v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
                          </svg>
                          {folder}
                        </p>
                      )}
                      <ul className="divide-y divide-line rounded-lg border border-line bg-paper">
                        {items.map((d) => (
                          <li key={d.id} className="flex items-center justify-between gap-4 p-4">
                            <div className="min-w-0">
                              <p className="truncate text-body font-medium text-ink">{d.name}</p>
                              <p className="mt-0.5 text-small text-muted">
                                {formatDate(d.created_at)}
                                {formatSize(d.size) ? ` · ${formatSize(d.size)}` : ""}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3 text-small font-medium">
                              <button type="button" onClick={() => openDoc(d)} className="text-ink underline-offset-4 hover:text-maroon hover:underline">
                                Open
                              </button>
                              <button type="button" onClick={() => downloadDoc(d)} className="text-ink underline-offset-4 hover:text-maroon hover:underline">
                                Download
                              </button>
                              <button type="button" onClick={() => remove(d)} className="text-muted underline-offset-4 hover:text-maroon hover:underline">
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
      )}

      {tab === "intakes" && (
        <div>
          {intakeRows.length === 0 ? (
            <p className="rounded-lg border border-dashed border-line p-6 text-small text-muted">
              No intakes yet. Completed questionnaires and saved drafts both appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {intakeRows.map((r) => {
                const open = openIntake === r.key;
                return (
                  <li key={r.key} className="overflow-hidden rounded-lg border border-line bg-paper">
                    <button
                      type="button"
                      onClick={() => setOpenIntake(open ? null : r.key)}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-body font-medium text-ink">
                          {r.name} <span className="text-muted">· {r.company}</span>
                        </p>
                        <p className="mt-0.5 truncate text-small text-muted">
                          {segNames(r.segments)} · {formatDate(r.updated)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={
                            "rounded-full px-2.5 py-1 text-caption font-semibold " +
                            (r.status === "completed" ? "bg-maroon/10 text-maroon" : "bg-line/60 text-muted")
                          }
                        >
                          {r.status === "completed" ? "Completed" : "In progress"}
                        </span>
                        <span aria-hidden="true" className={"text-muted transition-transform " + (open ? "rotate-180" : "")}>
                          ▾
                        </span>
                      </div>
                    </button>
                    {open && <IntakeDetail row={r} onOpenPdf={openIntakePdf} />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <div className="mt-10 flex justify-end border-t border-line pt-6">
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="text-small font-medium text-ink underline-offset-4 hover:text-maroon hover:underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2 py-0.5">
      <dt className="shrink-0 text-small text-muted">{k}:</dt>
      <dd className="min-w-0 text-small font-medium text-ink">{v || "—"}</dd>
    </div>
  );
}

/** Expanded detail for one intake: identity, PDF link, and every answer
 * grouped by the shared foundation plus each engaged segment. */
function IntakeDetail({ row, onOpenPdf }: { row: IntakeRow; onOpenPdf: (id: string) => void }) {
  const secs: IntakeSection[] = [
    ...sharedSections,
    ...row.segments.flatMap((k) => segmentByKey[k]?.sections ?? []),
  ];
  return (
    <div className="border-t border-line bg-surface px-4 py-5 sm:px-5">
      <dl className="grid gap-x-8 sm:grid-cols-2">
        <KV k="Name" v={row.name} />
        {row.title ? <KV k="Title" v={row.title} /> : null}
        <KV k="Company" v={row.company} />
        <KV k="Email" v={row.email} />
        <KV k="Parts" v={segNames(row.segments)} />
        <KV k="Status" v={row.status === "completed" ? "Completed" : "In progress"} />
      </dl>

      {row.documentId ? (
        <button type="button" onClick={() => onOpenPdf(row.documentId!)} className="btn--secondary mt-4">
          Open signed PDF
        </button>
      ) : (
        <p className="mt-4 text-small text-muted">No signed PDF yet: this intake is still in progress.</p>
      )}

      {secs.map((s) => (
        <div key={s.id} className="mt-6">
          <p className="text-small font-semibold text-maroon">{s.title}</p>
          <dl className="mt-2 divide-y divide-line border-t border-line">
            {s.fields.map((f) => {
              const val = answerValue(f, row.answers[f.name] ?? "");
              return (
                <div key={f.name} className="grid gap-1 py-2 sm:grid-cols-[minmax(0,44%)_1fr] sm:gap-4">
                  <dt className="text-small text-muted">{f.label}</dt>
                  <dd className={"whitespace-pre-wrap text-small " + (val ? "text-ink" : "text-muted/50")}>
                    {val || "—"}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </div>
  );
}
