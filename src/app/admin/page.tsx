import { redirect } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import {
  AdminDashboard,
  type AdminClient,
  type AdminDoc,
  type AdminIntakeSub,
  type AdminDraft,
} from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!supabaseConfigured) {
    return (
      <Section className="pt-28 md:pt-36">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-h2 font-semibold text-ink">Admin isn&apos;t set up yet.</h1>
          <p className="mt-4 text-body text-muted">Configure Supabase to enable this area.</p>
        </div>
      </Section>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <Section className="pt-28 md:pt-36">
        <div className="mx-auto max-w-md text-center">
          <p className="eyebrow mb-3">Admin</p>
          <h1 className="text-h2 font-semibold text-ink">You don&apos;t have access here.</h1>
          <p className="mt-4 text-body text-muted">
            This area is for the administrator only. You&apos;re signed in as {user.email}.
          </p>
          <p className="mt-6">
            <a href="/portal" className="btn--secondary">
              Go to your documents
            </a>
          </p>
        </div>
      </Section>
    );
  }

  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, company, email")
    .eq("role", "client")
    .order("full_name");

  const { data: docs } = await supabase
    .from("documents")
    .select("id, name, size, created_at, path, owner_id, folder")
    .order("created_at", { ascending: false });

  // Completed intakes (every submitted questionnaire) + in-progress drafts.
  const { data: intakeSubs } = await supabase
    .from("onboarding_submissions")
    .select("id, company, signer_name, signer_title, signer_email, segments, answers, document_id, created_at")
    .eq("kind", "intake")
    .order("created_at", { ascending: false });

  const { data: drafts } = await supabase
    .from("intake_drafts")
    .select("token, company, signer_name, email, segments, answers, created_at, updated_at")
    .eq("completed", false)
    .order("updated_at", { ascending: false });

  return (
    <Section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-3">Admin</p>
        <h1 className="text-h1 font-semibold text-ink">Console</h1>
        <p className="mt-4 text-body text-muted">
          Your documents and every client intake in one place. Clients only ever see files assigned
          to them.
        </p>
        <div className="mt-8">
          <AdminDashboard
            adminId={user.id}
            clients={(clients ?? []) as AdminClient[]}
            docs={(docs ?? []) as AdminDoc[]}
            intakeSubs={(intakeSubs ?? []) as AdminIntakeSub[]}
            drafts={(drafts ?? []) as AdminDraft[]}
          />
        </div>
      </div>
    </Section>
  );
}
