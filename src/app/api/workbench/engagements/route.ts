import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { workbenchAuthorised } from "@/lib/workbenchAuth";

/**
 * Aperture Analytics workbench — engagement list and upsert.
 *
 * Never confirms that anything exists to an unauthorised caller: a failed gate
 * returns 404, not 401, so the endpoint is indistinguishable from a typo.
 *
 * The browser autosaves locally first and syncs here on a debounce, so a slow or
 * absent network degrades to "saved on this machine" rather than to lost work.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLE = "analytics_engagements";
const notFound = () => new NextResponse("Not found", { status: 404 });

/** Fields the list view needs — deliberately never the whole `state` blob. */
const LIST_COLUMNS =
  "id, slug, company, code, entity_status, release, analyst, updated_at, created_at, archived";

export async function GET() {
  if (!(await workbenchAuthorised())) return notFound();
  if (!serviceRoleConfigured) {
    return NextResponse.json({ configured: false, engagements: [] });
  }
  const db = createAdminClient();
  const { data, error } = await db
    .from(TABLE)
    .select(LIST_COLUMNS)
    .eq("archived", false)
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ configured: true, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ configured: true, engagements: data ?? [] });
}

export async function POST(request: NextRequest) {
  if (!(await workbenchAuthorised())) return notFound();
  if (!serviceRoleConfigured) {
    return NextResponse.json({ configured: false }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON." }, { status: 400 });
  }

  const state = body.state;
  if (!state || typeof state !== "object") {
    return NextResponse.json({ error: "A session state object is required." }, { status: 400 });
  }

  const row = {
    slug: str(body.slug),
    company: str(body.company),
    code: str(body.code),
    entity_status: str(body.entity_status),
    release: str(body.release),
    analyst: str(body.analyst),
    state,
    schema_version: typeof body.schema_version === "number" ? body.schema_version : 1,
  };

  const db = createAdminClient();
  const id = str(body.id);

  // An id present means "update the engagement I already have open". Absent means
  // a new one — the server mints the id so two tabs can never collide on it.
  const query = id
    ? db.from(TABLE).update(row).eq("id", id).select("id, updated_at").maybeSingle()
    : db.from(TABLE).insert(row).select("id, updated_at").single();

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Engagement not found." }, { status: 404 });

  return NextResponse.json({ id: data.id, updated_at: data.updated_at });
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 300) : null;
}
