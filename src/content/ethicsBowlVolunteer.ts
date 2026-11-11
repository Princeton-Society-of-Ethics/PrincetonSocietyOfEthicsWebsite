/**
 * NJ High School Ethics Bowl volunteer registration (/volunteer).
 *
 * The event's date, time, and venue come from `ethicsBowlRegistration.event`,
 * so they only need updating in one place. Submissions go to the same Google
 * Apps Script as team registrations (scripts/ethics-bowl-registration.gs),
 * which writes them to a separate "Volunteers" tab.
 *
 * Each year: check `isOpen` and the event details in ethicsBowlRegistration.ts.
 * To close the form, set `isOpen: false`; its links disappear and /volunteer
 * shows a short "closed" notice.
 */

import { ethicsBowlRegistration } from "./ethicsBowlRegistration";

export const ethicsBowlVolunteer = {
  /** Manual on/off switch for volunteer sign-ups. */
  isOpen: true,
  /** Where volunteers send questions. */
  contactEmail: "ethics@princeton.edu",
  rulesUrl: "https://nhseb.org/rules-documents",
};

/** True while volunteers can sign up. */
export function isVolunteerFormOpen(): boolean {
  return ethicsBowlVolunteer.isOpen;
}

/** "2026–2027" → "2027": the calendar year the bowl takes place. */
export const eventYear = ethicsBowlRegistration.season.split(/[–-]/).pop()?.trim() ?? "";

export interface VolunteerRole {
  name: "Judge" | "Moderator" | "Assistant";
  preferred: string;
  description: string;
}

export const volunteerRoles: VolunteerRole[] = [
  {
    name: "Judge",
    preferred: "Faculty and graduate students preferred",
    description:
      "Judges evaluate teams' performances using a standardized rubric, assessing the clarity, relevance, and ethical depth of their arguments. They ask questions, provide constructive feedback, and help ensure fair deliberation. Undergraduate students may also serve as judges if needed.",
  },
  {
    name: "Moderator",
    preferred: "Undergraduate students, staff, and community members preferred",
    description:
      "Moderators oversee the flow of each match. They introduce teams, read cases aloud, manage time, and ensure competition rules are followed. Moderators receive a detailed script to guide them through each match.",
  },
  {
    name: "Assistant",
    preferred: "Undergraduate students, staff, and community members preferred",
    description:
      "Assistants support event logistics, including room setup, distributing materials, directing participants, and assisting judges and moderators.",
  },
];

export const heardFromOptions = [
  "University or Department Email",
  "Ethics Bowl Website",
  "Social Media",
  "Professor or Colleague",
  "Friend or Fellow Student",
  "Other",
] as const;
