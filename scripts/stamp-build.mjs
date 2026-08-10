#!/usr/bin/env node
/**
 * Writes src/lib/buildInfo.generated.ts at build time.
 *
 * Answers one question from the deployed site itself: is what I am looking at the thing I
 * pushed, and was it built against the ratified rubric? Vercel knows the commit; only the
 * build knows when it ran and which rubric snapshot it compiled against. Nothing else in the
 * app can work that out at runtime, so it is captured here and baked in.
 *
 * Run: node scripts/stamp-build.mjs   (wired into `prebuild`, ahead of check-lenses)
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

function git(args, fallback = "") {
  // --no-optional-locks is not optional here. `git status` refreshes the index and takes
  // .git/index.lock to do it; if the build is interrupted mid-status the lock is orphaned and
  // every subsequent git operation fails, including GitHub Desktop, with no obvious cause.
  // This flag tells git to skip anything that would need to write. (It happened.)
  try {
    return execSync(`git --no-optional-locks ${args}`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5000,
    }).trim();
  } catch {
    return fallback;
  }
}

// Vercel sets these during a deploy; git is the fallback for a local build.
const commit = process.env.VERCEL_GIT_COMMIT_SHA || git("rev-parse HEAD", "unknown");
const branch =
  process.env.VERCEL_GIT_COMMIT_REF || git("rev-parse --abbrev-ref HEAD", "unknown");
const message =
  process.env.VERCEL_GIT_COMMIT_MESSAGE || git("log -1 --pretty=%s", "");
const env = process.env.VERCEL_ENV || (process.env.NODE_ENV === "production" ? "local-prod" : "development");

// Uncommitted work is the most common reason a local build does not match the repo.
const dirty = process.env.VERCEL ? false : git("status --porcelain", "") !== "";

let rubricVersion = "unknown";
let ratified = false;
let lensSignature = "unknown";
try {
  const snap = JSON.parse(readFileSync(path.join(root, "src", "lib", "rubric.snapshot.json"), "utf8"));
  rubricVersion = snap.rubric_version;
  ratified = snap.ratified === true;
  // A short, eyeballable fingerprint of the instrument: id:weight pairs, order-independent.
  const basis = Object.entries(snap.lenses).sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`).join("|");
  let h = 0;
  for (const ch of basis) h = (Math.imul(31, h) + ch.charCodeAt(0)) | 0;
  lensSignature = (h >>> 0).toString(16).padStart(8, "0");
} catch {
  /* the snapshot check in check-lenses.mjs is what fails the build; this only reports */
}

const out = `/**
 * GENERATED — do not edit. Written by scripts/stamp-build.mjs on every build.
 * Committed so a clean checkout type-checks; overwritten before each build.
 */

export type BuildInfo = {
  commit: string;
  shortCommit: string;
  branch: string;
  message: string;
  builtAt: string;
  env: string;
  dirty: boolean;
  rubricVersion: string;
  ratified: boolean;
  lensSignature: string;
};

export const BUILD: BuildInfo = {
  commit: ${JSON.stringify(commit)},
  shortCommit: ${JSON.stringify(commit.slice(0, 7))},
  branch: ${JSON.stringify(branch)},
  message: ${JSON.stringify(message)},
  builtAt: ${JSON.stringify(new Date().toISOString())},
  env: ${JSON.stringify(env)},
  dirty: ${dirty},
  rubricVersion: ${JSON.stringify(rubricVersion)},
  ratified: ${ratified},
  lensSignature: ${JSON.stringify(lensSignature)},
};
`;

writeFileSync(path.join(root, "src", "lib", "buildInfo.generated.ts"), out);
console.log(
  `  ✓ build stamped — ${commit.slice(0, 7)}${dirty ? "+dirty" : ""} on ${branch} · rubric ${rubricVersion} · lenses ${lensSignature}`
);
