import { redirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { PortalDocs, type PortalDoc } from "./PortalDocs";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  if (!supabaseConfigured) {
    return (
      <Section className="pt-28 md:pt-36">
        <div className="mx-auto max-w-md text-center">
          <p className="eyebrow mb-4">Client portal</p>
          <h1 className="text-h2 font-semibold text-ink">The portal is being set up.</h1>
          <p className="mt-4 text-body text-muted">
            It isn&apos;t available just yet. Please check back shortly.
          </p>
        </div>
      </Section>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?next=/portal");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company, role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin");

  const { data: docs } = await supabase
    .from("documents")
    .select("id, name, size, created_at, path, folder")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const name = profile?.full_name || user.email || "there";

  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">Your documents</p>
            <h1 className="text-h1 font-semibold text-ink">Welcome, {name}.</h1>
            {profile?.company && <p className="mt-2 text-body text-muted">{profile.company}</p>}
          </div>
        </div>
        <p className="mt-5 text-body text-muted">
          These are the documents we&apos;ve shared with you. Only you can see them. Download links are
          private and expire after a minute for security.
        </p>
        <div className="mt-8">
          <PortalDocs docs={(docs ?? []) as PortalDoc[]} email={user.email ?? ""} />
        </div>
      </div>
    </Section>
  );
}
