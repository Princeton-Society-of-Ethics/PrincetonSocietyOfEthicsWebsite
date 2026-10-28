import { ethicsBowlRegistration } from "@/content/ethicsBowlRegistration";
import type { SubmissionResult } from "./membership";

export interface TeamRegistration {
  schoolName: string;
  schoolCity: string;
  /** True when the school was picked from the NJ high school directory. */
  schoolVerified: boolean;
  coachName: string;
  coachPhone: string;
  coachEmail: string;
  roster: string;
  dietaryRestrictions: string;
  additionalGuests: string;
  additionalTeams: string;
  confirmed: boolean;
  /** Hidden honeypot field; real people leave it empty. */
  website: string;
}

/**
 * Submit a team registration to the Google Apps Script web app that appends it
 * to the registrations sheet. Returns a friendly failure instead of throwing.
 *
 * The body is sent as text/plain (fetch's default for a string body) on
 * purpose: Apps Script can't answer CORS preflight requests, which a JSON
 * content type would trigger.
 */
export async function submitTeamRegistration(
  registration: TeamRegistration
): Promise<SubmissionResult> {
  const { submitUrl, contactEmail, season } = ethicsBowlRegistration;
  const reachOut = contactEmail
    ? `please email us at ${contactEmail}`
    : "please contact the Princeton Society of Ethics";

  if (!submitUrl) {
    return {
      ok: false,
      reason: `Online registration isn't connected yet. To register your team, ${reachOut}.`,
    };
  }

  try {
    const response = await fetch(submitUrl, {
      method: "POST",
      body: JSON.stringify({ ...registration, season }),
    });
    const result = (await response.json()) as { ok?: boolean };
    if (!response.ok || !result.ok) throw new Error("Registration was not saved");
    return { ok: true };
  } catch {
    return {
      ok: false,
      reason: `Something went wrong submitting your registration. Please try again, or ${reachOut}.`,
    };
  }
}
