"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
}: {
  adminId: string;
  clients: AdminClient[];
  docs: AdminDoc[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
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
