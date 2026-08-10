#!/usr/bin/env node
/**
 * Copies the governing fields of the ratified rubric into src/lib/rubric.snapshot.json.
 *
 * The website is its own git repository, so `Force5 Plugin/templates/rubric.json` is not in
 * the deploy. Without a committed copy, the Vercel build cannot check the site's lenses
 * against the instrument at all — it warned and passed, which is worse than not checking,
 * because it reads as a green light.
 *
 * Run this whenever the rubric changes, then commit the snapshot. check-lenses.mjs fails the
 * build if you forget: on a machine where the plugin is present it compares the two.
 *
 *   node scripts/sync-rubric-snapshot.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const CANDIDATES = [
  path.join(root, "..", "Force5 Plugin", "templates", "rubric.json"),
  path.join(root, "rubric.json"),
];

let rubric = null;
let from = "";
for (const p of CANDIDATES) {
  try {
    rubric = JSON.parse(readFileSync(p, "utf8"));
    from = p;
    break;
  } catch {
    /* next */
  }
}

if (!rubric) {
  console.error(
    "\n  ✗ rubric.json not found. This script must run on a machine that has the Force5 Plugin\n" +
      "    beside aperture-website — it is the only place the real rubric lives.\n"
  );
  process.exit(1);
}

const names = {
  finance: "Finance",
  operations: "Operations",
  "customers-retention": "Customers & Retention",
  "market-competition": "Market & Competition",
  "leadership-team": "Leadership & Team",
  processes: "Processes",
  "technology-data": "Technology & Data",
};

const snapshot = {
  _comment:
    "GENERATED from Force5 Plugin/templates/rubric.json by scripts/sync-rubric-snapshot.mjs. " +
    "Do not edit by hand — edit the rubric and re-run. This exists so the Vercel build, which " +
    "does not have the plugin, can still check the published lenses against the instrument.",
  rubric_version: rubric.rubric_version,
  ratified: rubric.ratified === true,
  ratified_by: rubric.ratified_by ?? null,
  ratified_on: rubric.ratified_on ?? null,
  lenses: Object.fromEntries(Object.entries(rubric.lenses).sort()),
  names: Object.fromEntries(Object.keys(rubric.lenses).sort().map((k) => [k, names[k] ?? k])),
};

const out = path.join(root, "src", "lib", "rubric.snapshot.json");
writeFileSync(out, JSON.stringify(snapshot, null, 2) + "\n");
console.log(
  `  ✓ snapshot written from ${path.relative(root, from)} — rubric ${snapshot.rubric_version}, ` +
    `${Object.keys(snapshot.lenses).length} lenses, ratified: ${snapshot.ratified}`
);
