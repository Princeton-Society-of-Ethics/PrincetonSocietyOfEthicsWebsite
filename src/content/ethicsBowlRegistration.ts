/**
 * NJ High School Ethics Bowl team registration.
 *
 * Registration is seasonal. While it is open, the site shows the form at
 * /register (also reachable at /njhseb) and links to it from the home page,
 * the menu, the footer, and the Initiatives page. When it closes, every one of
 * those links disappears and /register shows a short "registration is closed"
 * notice for anyone following an old link.
 *
 * Each year:
 *   1. Update `season` and `event` (and `closesAt` if there is a deadline).
 *   2. Set `isOpen: true`.
 *   3. Make sure `submitUrl` points at the Google Apps Script web app that
 *      writes to the registrations sheet (setup: scripts/ethics-bowl-registration.gs).
 * To close early, set `isOpen: false`.
 */

export const ethicsBowlRegistration = {
  /** Manual on/off switch for registration. */
  isOpen: true,
  /**
   * Optional deadline. Once it passes, registration closes automatically even
   * if `isOpen` is still true. ISO 8601 with an offset, e.g.
   * "2026-12-15T23:59:00-05:00", or null for no automatic deadline.
   */
  closesAt: null as string | null,
  season: "2026–2027",
  eventName: "New Jersey High School Ethics Bowl",
  /** When and where the bowl takes place. Set `dateIsTentative: false` once it's confirmed. */
  event: {
    date: "Saturday, February 6, 2027",
    dateIsTentative: true,
    venue: "Friend Center",
    place: "Princeton University",
  },
  /** Google Apps Script web app URL ("https://script.google.com/macros/s/.../exec"). */
  submitUrl: "",
  /** Who coaches email when their school isn't in the high school list. */
  unlistedSchoolEmail: "ji7445@princeton.edu",
  /** Where coaches can send questions. Leave null to hide. */
  contactEmail: null as string | null,
  roster: { min: 3, max: 7, maxPerMatch: 5 },
};

/** True while teams can register. */
export function isRegistrationOpen(now: Date = new Date()): boolean {
  if (!ethicsBowlRegistration.isOpen) return false;
  const { closesAt } = ethicsBowlRegistration;
  return closesAt === null || now < new Date(closesAt);
}

/** Human-readable deadline, e.g. "December 15, 2026", or null if none is set. */
export function registrationDeadlineLabel(): string | null {
  const { closesAt } = ethicsBowlRegistration;
  if (!closesAt) return null;
  return new Date(closesAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}
