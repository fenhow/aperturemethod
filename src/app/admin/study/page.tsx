import { redirect } from "next/navigation";

/** The study dashboard moved behind the Method Lab passphrase (Oct 2026). */
export default function AdminStudyRedirect() {
  redirect("/method-lab/study");
}
