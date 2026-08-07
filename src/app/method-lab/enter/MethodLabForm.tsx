"use client";

import { useState } from "react";

export function MethodLabForm() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/method-lab/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase: value }),
      });
      if (res.ok) {
        window.location.href = "/method-lab";
        return;
      }
      setError("invalid");
    } catch {
      setError("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <label htmlFor="passphrase" className="block text-caption font-medium text-ink">
        Passphrase
      </label>
      <input
        id="passphrase"
        name="passphrase"
        type="password"
        autoComplete="current-password"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full rounded-md border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      />

      {error ? (
        <p className="mt-3 text-caption text-accent" role="alert">
          That passphrase isn&apos;t right. Please check it and try again.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || value.length === 0}
        className="mt-5 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-caption font-semibold uppercase tracking-wide text-paper transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
