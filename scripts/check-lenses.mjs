#!/usr/bin/env node
/**
 * Conformance check: the website's seven lenses must equal the ratified scoring rubric.
 *
 * This exists because the same seven lenses were found in three different forms — the SOP,
 * the Build Spec with different weights, and a delivered client X-Ray that scored a lens
 * ("Marketing & growth engine") the rubric does not contain. Nothing caught it, because
 * nothing was comparing them.
 *
 * The site sells a weighted, reproducible instrument. If the marketing copy and the
 * instrument disagree, the claim is false — quietly, and in the client's favour to disbelieve.
 * So this fails the build rather than warning.
 *
 * Run:  node scripts/check-lenses.mjs
 * Wire: "prebuild": "node scripts/check-lenses.mjs"
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

// The rubric is the instrument, and it lives OUTSIDE this repository — the website is its
// own git repo, so on Vercel `Force5 Plugin/templates/rubric.json` simply is not there. The
// old behaviour was to warn and pass, which meant the strongest checks (names match the
// rubric, rubric is ratified) silently did not run on the only build that ships.
//
// So the governing fields are committed here as a snapshot, and the check runs in two tiers:
//   · always      — lenses.ts must agree with the snapshot
//   · when local  — the snapshot must agree with the real rubric, or it is stale
const RUBRIC_CANDIDATES = [
  path.join(root, "..", "Force5 Plugin", "templates", "rubric.json"),
  path.join(root, "rubric.json"),
];
const SNAPSHOT = path.join(root, "src", "lib", "rubric.snapshot.json");

function loadRubric() {
  for (const p of RUBRIC_CANDIDATES) {
    try {
      return { data: JSON.parse(readFileSync(p, "utf8")), path: p };
    } catch {
      /* try the next */
    }
  }
  return null;
}

function loadSnapshot() {
  try {
    return JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  } catch {
    return null;
  }
}

// Parse lenses.ts without needing a TS toolchain — id, name and weight only.
function loadSiteLenses() {
  const src = readFileSync(path.join(root, "src", "lib", "lenses.ts"), "utf8");
  const out = [];
  const re = /id:\s*"([a-z-]+)",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*weight:\s*([0-9.]+)/g;
  let m;
  while ((m = re.exec(src))) out.push({ id: m[1], name: m[2], weight: Number(m[3]) });
  return out;
}

const problems = [];
const site = loadSiteLenses();
const snapshot = loadSnapshot();
const rubric = loadRubric();

if (site.length !== 7) {
  problems.push(`lenses.ts declares ${site.length} lenses; the Method has exactly seven.`);
}

const total = site.reduce((t, l) => t + l.weight, 0);
if (Math.abs(total - 1) > 1e-9) {
  problems.push(`Weights total ${total.toFixed(4)}, not 1.0 — the Aperture Score is a weighted composite.`);
}

if (!snapshot) {
  problems.push(
    "src/lib/rubric.snapshot.json is missing. It is what lets this check run on Vercel, where " +
      "the plugin is not present. Regenerate it with: node scripts/sync-rubric-snapshot.mjs"
  );
} else {
  // Tier 1 — always. The site must match the committed snapshot.
  const r = snapshot.lenses;
  for (const l of site) {
    if (!(l.id in r)) {
      problems.push(`lenses.ts has "${l.id}", which is not in the rubric (${snapshot.rubric_version}).`);
    } else if (Math.abs(r[l.id] - l.weight) > 1e-9) {
      problems.push(`Weight mismatch for "${l.id}": site ${l.weight}, rubric ${r[l.id]}.`);
    }
  }
  for (const id of Object.keys(r)) {
    if (!site.some((l) => l.id === id)) {
      problems.push(`Rubric lens "${id}" is missing from lenses.ts — the site under-describes the instrument.`);
    }
  }
  for (const l of site) {
    const expected = snapshot.names?.[l.id];
    if (expected && expected !== l.name) {
      problems.push(`Lens "${l.id}" is named "${l.name}" on the site but "${expected}" in the rubric.`);
    }
  }
  if (snapshot.ratified !== true) {
    problems.push(`Rubric ${snapshot.rubric_version} is not ratified; the site must not publish its weights.`);
  }

  // Tier 2 — only where the real rubric is reachable. Is the snapshot itself current?
  if (rubric) {
    const a = JSON.stringify({
      v: rubric.data.rubric_version,
      r: rubric.data.ratified,
      l: Object.fromEntries(Object.entries(rubric.data.lenses).sort()),
    });
    const b = JSON.stringify({
      v: snapshot.rubric_version,
      r: snapshot.ratified,
      l: Object.fromEntries(Object.entries(snapshot.lenses).sort()),
    });
    if (a !== b) {
      problems.push(
        `src/lib/rubric.snapshot.json is stale — it disagrees with ${path.relative(root, rubric.path)}. ` +
          "Regenerate it with: node scripts/sync-rubric-snapshot.mjs"
      );
    }
  }
}

// ---------------------------------------------------------------------------
// The intake form is where the client meets the lenses first. Its section
// headings must be the same seven, in the same order, with the same names —
// otherwise a client reads "Lens 1 · Operations" on the form and "01 Finance"
// on the site, and the instrument looks improvised.
// ---------------------------------------------------------------------------
try {
  const intake = readFileSync(path.join(root, "src", "lib", "onboarding", "intake.ts"), "utf8");
  const headings = [...intake.matchAll(/title:\s*"Lens (\d+) · ([^"]+)"/g)].map((m) => ({
    n: Number(m[1]),
    name: m[2],
  }));
  if (headings.length !== site.length) {
    problems.push(
      `intake.ts declares ${headings.length} lens sections; lenses.ts declares ${site.length}.`
    );
  } else {
    headings.forEach((h, i) => {
      if (h.n !== i + 1) {
        problems.push(`intake.ts lens headings are misnumbered at position ${i + 1} (found "Lens ${h.n}").`);
      }
      if (h.name !== site[i].name) {
        problems.push(
          `intake.ts Lens ${i + 1} is "${h.name}"; the canonical order has "${site[i].name}" there.`
        );
      }
    });
  }
} catch {
  problems.push("intake.ts could not be read — the intake form's lens headings went unchecked.");
}

// ---------------------------------------------------------------------------
// Retired lens names. These came from an earlier draft that reached a delivered
// client report; "Marketing & growth engine" was scored as a lens and is not
// one. Marketing evidence belongs to Customers & Retention.
// ---------------------------------------------------------------------------
const RETIRED = [
  "Marketing & growth engine",
  "Operations & service delivery",
  "Leadership & organization",
  "Market & competitive position",
  "Process & systems",
];
try {
  const { execSync } = await import("node:child_process");
  const pattern = RETIRED.join("|");
  const hits = execSync(
    `grep -rlF ${RETIRED.map((r) => `-e ${JSON.stringify(r)}`).join(" ")} src || true`,
    { cwd: root, encoding: "utf8" }
  )
    .split("\n")
    .filter(Boolean)
    .filter((f) => !f.endsWith("check-lenses.mjs"));
  void pattern;
  for (const f of hits) {
    problems.push(`${f} uses a retired lens name. The seven canonical names are in src/lib/lenses.ts.`);
  }
} catch {
  /* grep unavailable — skip rather than fail the build for the wrong reason */
}

// ---------------------------------------------------------------------------
// Retired product names. "Aperture Live" was the old public name for component
// 05; Atlas is now the single name, used internally and with clients. Comment
// lines are exempt so the code can explain the retirement without tripping it.
// ---------------------------------------------------------------------------
const RETIRED_PRODUCTS = ["Aperture Live"];
try {
  const { execSync } = await import("node:child_process");
  const files = execSync("grep -rl --include=*.ts --include=*.tsx -e 'Aperture Live' src || true", {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
  for (const f of files) {
    const lines = readFileSync(path.join(root, f), "utf8").split("\n");
    lines.forEach((line, i) => {
      const t = line.trim();
      const isComment = t.startsWith("*") || t.startsWith("//") || t.startsWith("/*");
      if (isComment) return;
      for (const name of RETIRED_PRODUCTS) {
        if (line.includes(name)) {
          problems.push(`${f}:${i + 1} uses the retired product name "${name}" — component 05 is Aperture Atlas.`);
        }
      }
    });
  }
} catch {
  /* grep unavailable — skip rather than fail the build for the wrong reason */
}

// ---------------------------------------------------------------------------
// Fees belong in one file. Three separate files carried their own hard-coded
// fees and all three were stale — the homepage quoted one number while the
// contract the client signed quoted another.
//
// Only OUR fees are policed, not every currency figure: illustrative amounts in
// demo data (a customer's lifetime value, a worked example) are legitimate. A
// file whose money is illustrative declares itself once, at the top, with the
// marker below — which is a deliberate statement rather than a silent skip.
// ---------------------------------------------------------------------------
const ILLUSTRATIVE = "@illustrative-figures";
try {
  const { execSync } = await import("node:child_process");
  const files = execSync(
    "grep -rlE '\\$[0-9],?[0-9]{3}' --include=*.ts --include=*.tsx src || true",
    { cwd: root, encoding: "utf8" }
  )
    .split("\n")
    .filter(Boolean)
    .filter((f) => f !== "src/lib/pricing.ts");
  for (const f of files) {
    const src_ = readFileSync(path.join(root, f), "utf8");
    if (src_.slice(0, 2000).includes(ILLUSTRATIVE)) continue;
    const lines = src_.split("\n");
    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith("*") || t.startsWith("//") || t.startsWith("/*")) return;
      const m = line.match(/\$[0-9],?[0-9]{3}/);
      if (m) {
        problems.push(
          `${f}:${i + 1} hard-codes ${m[0]}. Our fees live in src/lib/pricing.ts; if this figure is illustrative, mark the file with ${ILLUSTRATIVE}.`
        );
      }
    });
  }
} catch {
  /* grep unavailable — skip rather than fail the build for the wrong reason */
}

if (problems.length) {
  console.error("\n  ✗ Seven-lens conformance FAILED\n");
  for (const p of problems) console.error(`    · ${p}`);
  console.error(
    "\n  The site, the scoring instrument and the product names must agree. Fix src/lib/lenses.ts,\n" +
      "  src/lib/content.ts or the rubric, then update the Canonical Architecture Reference to match.\n"
  );
  process.exit(1);
}

console.log(
  `  ✓ Seven lenses conform to rubric ${snapshot?.rubric_version ?? "?"} ` +
    `(${rubric ? "verified against the plugin" : "snapshot only — plugin not present"}) ` +
    "— ids, names and weights agree."
);
