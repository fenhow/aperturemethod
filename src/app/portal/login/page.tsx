"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/portal";
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) setError(error.message);
      else setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-md">
        <p className="eyebrow mb-4">Client portal</p>
        <h1 className="text-h1 font-semibold text-ink">Sign in to your documents</h1>

        {!supabaseConfigured ? (
          <p className="mt-6 rounded-lg border border-line bg-surface p-5 text-body text-muted">
            The client portal is being set up and isn&apos;t available yet. Please check back shortly,
            or contact us and we&apos;ll send your documents directly.
          </p>
        ) : sent ? (
          <div className="mt-6 rounded-lg border border-line bg-surface p-6">
            <p className="text-body-lg font-medium text-ink">Check your email.</p>
            <p className="mt-2 text-body text-muted">
              We sent a secure sign-in link to <span className="font-medium text-ink">{email}</span>.
              Open it on this device to reach your documents. The link expires shortly and can only be
              used once.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-4 text-body text-muted">
              Enter your email and we&apos;ll send you a one-time sign-in link — no password to
              remember.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-small font-medium text-ink">Email address</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-body text-ink outline-none transition-colors focus:border-maroon"
                />
              </label>
              {error && <p className="text-small text-maroon">{error}</p>}
              <button type="submit" disabled={loading} className="btn w-full disabled:opacity-60">
                {loading ? "Sending…" : "Email me a sign-in link"}
              </button>
            </form>
            <p className="mt-5 text-small text-muted">
              Access is by invitation. If you don&apos;t have an account yet, contact us and we&apos;ll
              set one up.
            </p>
          </>
        )}
      </div>
    </Section>
  );
}
