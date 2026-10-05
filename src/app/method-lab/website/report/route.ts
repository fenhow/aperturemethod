import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";
import { loadSite, parseRange } from "@/lib/websiteCheckStats";
import { generateWebsiteReportPdf } from "@/lib/websiteCheckPdf";

/** /method-lab/website/report — the website Clarity Check as a branded PDF. Method Lab only. */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await hasMethodLabAccess(cookies().get(METHOD_LAB_COOKIE)?.value))) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const q = new URL(request.url).searchParams;
  const s = await loadSite(parseRange({ range: q.get("range") ?? undefined, from: q.get("from") ?? undefined, to: q.get("to") ?? undefined }));
  if (!s) return NextResponse.json({ ok: false, message: "Service key not set." }, { status: 503 });
  const { bytes, filename } = await generateWebsiteReportPdf(s);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
