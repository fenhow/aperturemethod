"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/env";

type Info = { name: string; role: string } | null;

/**
 * Auth status shown in the header's top utility strip. Logged out → a discreet
 * "Client login" link. Logged in → a greeting, a link to the right place
 * (Admin vs. My documents), and Sign out. Renders nothing until the session is
 * resolved, so there's no flash or hydration mismatch.
 */
export function AuthBar() {
  const [info, setInfo] = useState<Info>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        setInfo(null);
        setReady(true);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();
      if (!active) return;
      setInfo({
        name: profile?.full_name || user.email || "there",
        role: profile?.role || "client",
      });
      setReady(true);
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setInfo(null);
    window.location.href = "/";
  }

  if (!supabaseConfigured || !ready) return null;

  const Divider = () => (
    <span className="text-white/30" aria-hidden="true">
      |
    </span>
  );

  if (!info) {
    return (
      <span className="flex items-center gap-5">
        <Divider />
        <Link href="/portal/login" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Client login
        </Link>
      </span>
    );
  }

  const first = info.name.split(/[\s@]/)[0] || info.name;
  const dest = info.role === "admin" ? "/admin" : "/portal";
  const destLabel = info.role === "admin" ? "Admin" : "My documents";

  return (
    <span className="flex items-center gap-4">
      <Divider />
      <span className="text-white">Hi, {first}</span>
      <Link href={dest} className="transition-colors hover:text-white">
        {destLabel}
      </Link>
      <button type="button" onClick={signOut} className="transition-colors hover:text-white">
        Sign out
      </button>
    </span>
  );
}
