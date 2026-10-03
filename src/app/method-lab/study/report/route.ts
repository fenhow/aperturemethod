import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { METHOD_LAB_COOKIE, hasMethodLabAccess } from "@/lib/methodLab";
import { loadStudy } from "@/lib/realityStudyStats";
import { studyFields } from "@/lib/realityStudy";
import { generateStudyReportPdf } from "@/lib/realityStudyPdf";

/**
 * /method-lab/study/report — the study results as a branded PDF.
 * Same filters as the dashboard (?revenue=…&industry=…&source=…).
 * Method Lab passphrase only (middleware, and checked again here).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await hasMethodLabAccess(cookies().get(METHOD_LAB_COOKIE)?.value))) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const q = new URL(request.url).searchParams;
  const filter = {
    revenue: q.get("revenue") || undefined,
    industry: q.get("industry") || undefined,
    source: q.get("source") || undefined,
  };
  const s = await loadStudy(filter);
  if (!s) return NextResponse.json({ ok: false, message: "Service key not set." }, { status: 503 });

  const label = (id: "revenue" | "industry", v?: string) =>
    v ? studyFields.find((f) => f.id === id)?.options.find((o) => o.value === v)?.label ?? v : null;
  const parts = [label("revenue", filter.revenue), label("industry", filter.industry), filter.source ? `source ${filter.source}` : null].filter(Boolean);

  const { bytes, filename } = await generateStudyReportPdf(s, parts.length ? parts.join(", ") : null);
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
