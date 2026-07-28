"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type PortalDoc = {
  id: string;
  name: string;
  size: number | null;
  created_at: string;
  path: string;
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

export function PortalDocs({ docs, email }: { docs: PortalDoc[]; email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function download(d: PortalDoc) {
    setBusy(d.id);
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(d.path, 60, { download: d.name });
      if (error || !data?.signedUrl) {
        setError("That download link couldn't be created. Please try again.");
        return;
      }
      window.location.href = data.signedUrl;
    } finally {
      setBusy(null);
    }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/portal/login");
    router.refresh();
  }

  return (
    <div>
      {docs.length === 0 ? (
        <div className="rounded-lg border border-line bg-surface p-8 text-center">
          <p className="text-body-lg font-medium text-ink">No documents yet.</p>
          <p className="mt-2 text-body text-muted">
            When we share a document with you, it will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-paper">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="truncate text-body font-medium text-ink">{d.name}</p>
                <p className="mt-0.5 text-small text-muted">
                  {formatDate(d.created_at)}
                  {formatSize(d.size) ? ` · ${formatSize(d.size)}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => download(d)}
                disabled={busy === d.id}
                className="btn--secondary shrink-0 disabled:opacity-60"
              >
                {busy === d.id ? "Preparing…" : "Download"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-4 text-small text-maroon">{error}</p>}

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <p className="text-small text-muted">Signed in as {email}</p>
        <button
          type="button"
          onClick={signOut}
          className="text-small font-medium text-ink underline-offset-4 hover:text-maroon hover:underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
