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
};

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
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  const [owner, setOwner] = useState<string>(adminId); // adminId = "my private documents"
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
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

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
      const path = `${owner}/${crypto.randomUUID()}${ext}`;
      const up = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type || "application/octet-stream" });
      if (up.error) {
        setError(up.error.message);
        return;
      }
      const ins = await supabase.from("documents").insert({
        owner_id: owner,
        name: file.name,
        path,
        size: file.size,
        content_type: file.type || null,
        uploaded_by: adminId,
      });
      if (ins.error) {
        // roll back the stored object if the row insert failed
        await supabase.storage.from("documents").remove([path]);
        setError(ins.error.message);
        return;
      }
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } finally {
      setBusy(false);
    }
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

  // Ordered owner groups: admin's own first, then each client.
  const ownerOrder = [adminId, ...clients.map((c) => c.id)];

  return (
    <div>
      {/* Upload */}
      <form onSubmit={upload} className="rounded-lg border border-line bg-surface p-6">
        <p className="text-body-lg font-medium text-ink">Add a document</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-small font-medium text-ink">Assign to</span>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
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
            <span className="mb-1.5 block text-small font-medium text-ink">File</span>
            <input
              ref={fileRef}
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-small text-ink file:mr-3 file:rounded-sm file:border-0 file:bg-maroon file:px-3 file:py-1.5 file:text-paper"
            />
          </label>
        </div>
        {error && <p className="mt-3 text-small text-maroon">{error}</p>}
        <button type="submit" disabled={!file || busy} className="btn mt-4 disabled:opacity-60">
          {busy ? "Uploading…" : "Upload"}
        </button>
        {clients.length === 0 && (
          <p className="mt-3 text-small text-muted">
            No client accounts yet. A client appears here once they sign in for the first time at the
            portal (or after you invite them from Supabase).
          </p>
        )}
      </form>

      {/* Documents by owner */}
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
                <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-paper">
                  {list.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <p className="truncate text-body font-medium text-ink">{d.name}</p>
                        <p className="mt-0.5 text-small text-muted">
                          {formatDate(d.created_at)}
                          {formatSize(d.size) ? ` · ${formatSize(d.size)}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(d)}
                        className="shrink-0 text-small font-medium text-muted underline-offset-4 hover:text-maroon hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
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
