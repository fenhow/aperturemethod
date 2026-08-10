import { NextResponse } from "next/server";
import { saveDraft, loadDraft, emailResumeLink, draftsEnabled, type DraftInput } from "@/lib/onboarding/drafts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/intake/draft?token=... — load a saved draft to resume it.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";
  if (!token) return NextResponse.json({ ok: false, message: "Missing token." }, { status: 400 });
  const draft = await loadDraft(token);
  if (!draft) return NextResponse.json({ ok: false, message: "Draft not found." }, { status: 404 });
  if (draft.completed) return NextResponse.json({ ok: false, completed: true, message: "This intake is already submitted." });
  return NextResponse.json({ ok: true, draft });
}

// POST /api/intake/draft — save progress. Body: DraftInput + optional { sendLink }.
// When sendLink is true (and an email is present), also emails a resume link.
export async function POST(request: Request) {
  if (!draftsEnabled) {
    return NextResponse.json(
      { ok: false, message: "Saving isn't available right now. You can still complete the form in one sitting." },
      { status: 503 }
    );
  }

  let body: DraftInput & { sendLink?: boolean };
  try {
    body = (await request.json()) as DraftInput & { sendLink?: boolean };
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  if (body.sendLink && !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email so we can send your resume link." },
      { status: 422 }
    );
  }

  const saved = await saveDraft({
    token: body.token,
    email,
    company: body.company,
    signerName: body.signerName,
    segments: body.segments,
    answers: body.answers,
  });
  if (!saved.ok && saved.error === "gone") {
    // The draft no longer exists, expired, or was already submitted. Say so loudly —
    // the client needs to copy their answers out before they lose them.
    return NextResponse.json(
      {
        ok: false,
        gone: true,
        message:
          "This draft link is no longer active — it may have been submitted already. Please copy your answers somewhere safe before leaving this page.",
      },
      { status: 410 }
    );
  }
  if (!saved.ok || !saved.token) {
    return NextResponse.json({ ok: false, message: "We couldn't save your progress. Please try again." }, { status: 500 });
  }

  let emailed = false;
  if (body.sendLink && EMAIL_RE.test(email)) {
    const res = await emailResumeLink({
      token: saved.token,
      email,
      signerName: body.signerName,
      segments: body.segments,
    });
    emailed = res.ok;
  }

  return NextResponse.json({ ok: true, token: saved.token, emailed });
}
