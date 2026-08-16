import { NextResponse } from "next/server";
import { createAdminClient, serviceRoleConfigured } from "@/lib/supabase/admin";
import { workbenchAuthorised } from "@/lib/workbenchAuth";

/**
 * A single engagement: fetch the whole session back, or archive it.
 *
 * Delete is a soft archive rather than a destructive delete — a mis-click in a
 * list of client engagements should not be unrecoverable.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TABLE = "analytics_engagements";
const notFound = () => new NextResponse("Not found", { status: 404 });

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await workbenchAuthorised())) return notFound();
  if (!serviceRoleConfigured) return NextResponse.json({ configured: false }, { status: 503 });

  const { id } = await ctx.params;
  const db = createAdminClient();
  const { data, error } = await db.from(TABLE).select("*").eq("id", id).maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return notFound();
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await workbenchAuthorised())) return notFound();
  if (!serviceRoleConfigured) return NextResponse.json({ configured: false }, { status: 503 });

  const { id } = await ctx.params;
  const db = createAdminClient();
  const { error } = await db.from(TABLE).update({ archived: true }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ archived: true });
}
