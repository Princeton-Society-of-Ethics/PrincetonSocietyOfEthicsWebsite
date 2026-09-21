import { isApiConfigured, request } from "./client";

export interface JoinInquiry {
  email: string;
}

export type SubmissionResult = { ok: true } | { ok: false; reason: string };

const NO_BACKEND_MESSAGE =
  "Online submissions aren't set up yet — please reach out to us on Instagram or attend an event!";

/** Submit a join inquiry. Returns a friendly failure instead of throwing. */
export async function submitJoinInquiry(inquiry: JoinInquiry): Promise<SubmissionResult> {
  if (!isApiConfigured) return { ok: false, reason: NO_BACKEND_MESSAGE };
  try {
    await request("/join-inquiries", { method: "POST", body: inquiry });
    return { ok: true };
  } catch {
    return { ok: false, reason: "Something went wrong submitting your inquiry. Please try again." };
  }
}
