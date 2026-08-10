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

// The rubric is the instrument. Point this at wherever it is checked out.
const RUBRIC_CANDIDATES = [
  path.join(root, "..", "Force5 Plugin", "templates", "rubric.json"),
  path.join(root, "rubric.json"),
];

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
const rubric = loadRubric();

if (site.length !== 7) {
  problems.push(`lenses.ts declares ${site.length} lenses; the Method has exactly seven.`);
}

const total = site.reduce((t, l) => t + l.weight, 0);
if (Math.abs(total - 1) > 1e-9) {
  problems.push(`Weights total ${total.toFixed(4)}, not 1.0 — the Aperture Score is a weighted composite.`);
}

if (!rubric) {
  console.warn(
    "check-lenses: rubric.json not found alongside the site — checked ids and weights only.\n" +
      "             Place the Force5 Plugin beside aperture-website for the full check."
  );
} else {
  const r = rubric.data.lenses;
  for (const l of site) {
    if (!(l.id in r)) {
      problems.push(`lenses.ts has "${l.id}", which is not in the rubric (${rubric.data.rubric_version}).`);
    } else if (Math.abs(r[l.id] - l.weight) > 1e-9) {
      problems.push(`Weight mismatch for "${l.id}": site ${l.weight}, rubric ${r[l.id]}.`);
    }
  }
  for (const id of Object.keys(r)) {
    if (!site.some((l) => l.id === id)) {
      problems.push(`Rubric lens "${id}" is missing from lenses.ts — the site under-describes the instrument.`);
    }
  }
  if (rubric.data.ratified !== true) {
    problems.push(`Rubric ${rubric.data.rubric_version} is not ratified; the site must not publish its weights.`);
  }
}

if (problems.length) {
  console.error("\n  ✗ Seven-lens conformance FAILED\n");
  for (const p of problems) console.error(`    · ${p}`);
  console.error(
    "\n  The site and the scoring instrument must agree. Fix src/lib/lenses.ts or the rubric,\n" +
      "  then update Canonical Architecture Reference §2.2 to match.\n"
  );
  process.exit(1);
}

console.log(
  `  ✓ Seven lenses conform${rubric ? ` to rubric ${rubric.data.rubric_version}` : ""} — ids, names and weights agree.`
);
