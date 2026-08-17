import { BUILD } from "@/lib/buildInfo.generated";

/**
 * The build stamp in the footer.
 *
 * Small and quiet, a prospect has no use for a commit hash, but present on every page, so
 * the question "is the deployed site the thing I pushed?" is answered by looking at the site
 * rather than by trusting a dashboard. The full detail, including the lens weights this build
 * compiled against, is one click away at /version.
 *
 * `dirty` only ever shows on a local build: it means the tree had uncommitted changes, so
 * what you are looking at exists nowhere in git.
 */
export function BuildStamp({ className = "" }: { className?: string }) {
  const date = BUILD.builtAt.slice(0, 10);
  const time = BUILD.builtAt.slice(11, 16);
  const preview = BUILD.env !== "production";

  return (
    <a
      href="/version"
      rel="nofollow"
      title={`${BUILD.branch} · ${BUILD.message || "no commit message"} · rubric ${BUILD.rubricVersion} · lenses ${BUILD.lensSignature}`}
      className={`font-mono tabular-nums transition-colors duration-fast hover:text-white ${className}`}
    >
      build {BUILD.shortCommit}
      {BUILD.dirty ? "+dirty" : ""} · {date} {time}Z
      {preview ? ` · ${BUILD.env}` : ""}
    </a>
  );
}
