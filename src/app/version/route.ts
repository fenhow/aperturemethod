import { NextResponse } from "next/server";

import { BUILD } from "@/lib/buildInfo.generated";
import { LENSES, lensWeightTotal } from "@/lib/lenses";
import { XRAY_FEE, FULL_METHOD_FEE, ATLAS_FEE } from "@/lib/pricing";

/**
 * GET /version: what this deployment actually is.
 *
 * The question this answers is "is the site I am looking at the thing I pushed, and was it
 * built against the ratified rubric?" The commit answers the first half; the rubric version
 * and lens signature answer the second. Both are baked at build time, so this cannot report
 * anything other than what was compiled.
 *
 * Public on purpose: it contains a commit hash and figures already published on the site,
 * nothing more. Keeping it public means it can be checked from anywhere, including by a
 * monitor, without a passphrase.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      commit: BUILD.commit,
      shortCommit: BUILD.shortCommit,
      branch: BUILD.branch,
      message: BUILD.message,
      builtAt: BUILD.builtAt,
      environment: BUILD.env,
      builtFromDirtyTree: BUILD.dirty,
      rubric: {
        version: BUILD.rubricVersion,
        ratified: BUILD.ratified,
        lensSignature: BUILD.lensSignature,
        lenses: LENSES.map((l) => ({ id: l.id, name: l.name, weight: l.weight })),
        weightTotal: Number(lensWeightTotal.toFixed(4)),
      },
      pricing: { xray: XRAY_FEE, fullMethod: FULL_METHOD_FEE, atlas: ATLAS_FEE },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
