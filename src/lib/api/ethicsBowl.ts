import { ethicsBowlRegistration } from "@/content/ethicsBowlRegistration";

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
  /** When the coach clicked "Start Registration", to measure time spent on the form. */
  startedAt: Date | null;
}

export type RegistrationResult =
  | {
      ok: true;
      /** e.g. "NJHSEB-27-0001"; null if the server didn't send one. */ registrationId:
        string | null;
    }
  | { ok: false; reason: string };

/**
 * Context sent along with each registration so organizers can audit and follow
 * up: the coach's local time and time zone, how long the form took, the page
 * that sent them here, and their browser. The server adds its own timestamp
 * and a registration number.
 */
function submissionMetadata(startedAt: Date | null) {
  const now = new Date();
  return {
    clientSubmittedAt: now.toISOString(),
    clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
    completionSeconds: startedAt ? Math.round((now.getTime() - startedAt.getTime()) / 1000) : null,
    referrer: document.referrer,
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
  };
}

/**
 * Submit a team registration to the Google Apps Script web app that appends it
 * to the registrations sheet. Returns a friendly failure instead of throwing.
 *
 * The body is sent as text/plain (fetch's default for a string body) on
 * purpose: Apps Script can't answer CORS preflight requests, which a JSON
 * content type would trigger.
 */
export async function submitTeamRegistration({
  startedAt,
  ...registration
}: TeamRegistration): Promise<RegistrationResult> {
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
      body: JSON.stringify({ ...registration, season, ...submissionMetadata(startedAt) }),
    });
    const result = (await response.json()) as { ok?: boolean; id?: string };
    if (!response.ok || !result.ok) throw new Error("Registration was not saved");
    return { ok: true, registrationId: result.id ?? null };
  } catch {
    return {
      ok: false,
      reason: `Something went wrong submitting your registration. Please try again, or ${reachOut}.`,
    };
  }
}

export interface VolunteerRegistration {
  /** Comma-separated, e.g. "Judge, Moderator". */
  roles: string;
  multipleRoles: string;
  fullName: string;
  email: string;
  phone: string;
  fullDay: string;
  /** Only when not available for the full day. */
  availableHours: string;
  priorExperience: string;
  experienceDetails: string;
  needs: string;
  /** The chosen option, or "Other: …" with what they typed. */
  heardFrom: string;
  comments: string;
  /** Hidden honeypot field; real people leave it empty. */
  website: string;
  startedAt: Date | null;
}

/**
 * Submit a volunteer sign-up. It goes to the same Apps Script web app as team
 * registrations; `formType: "volunteer"` sends it to the Volunteers tab.
 */
export async function submitVolunteerRegistration({
  startedAt,
  ...volunteer
}: VolunteerRegistration): Promise<{ ok: true } | { ok: false; reason: string }> {
  const { submitUrl, season } = ethicsBowlRegistration;
  const reachOut = "please email us at ethics@princeton.edu";

  if (!submitUrl) {
    return {
      ok: false,
      reason: `Online volunteer sign-up isn't connected yet. To volunteer, ${reachOut}.`,
    };
  }

  try {
    const response = await fetch(submitUrl, {
      method: "POST",
      body: JSON.stringify({
        formType: "volunteer",
        ...volunteer,
        season,
        ...submissionMetadata(startedAt),
      }),
    });
    const result = (await response.json()) as { ok?: boolean };
    if (!response.ok || !result.ok) throw new Error("Volunteer sign-up was not saved");
    return { ok: true };
  } catch {
    return {
      ok: false,
      reason: `Something went wrong submitting your sign-up. Please try again, or ${reachOut}.`,
    };
  }
}
