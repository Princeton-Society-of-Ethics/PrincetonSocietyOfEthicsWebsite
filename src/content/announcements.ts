import { Trophy, type LucideIcon } from "lucide-react";

export interface Announcement {
  title: string;
  /** Display date, e.g. "November 2026". */
  date: string;
  /** One string per paragraph. */
  body: string[];
  /** Optional decorative icon shown large at the right edge, e.g. Trophy for good news. */
  icon?: LucideIcon;
  /** Optional link shown under the title. */
  cta?: { label: string; href: string };
}

/** News shown on the home page, newest first. The section hides itself when this is empty. */
export const announcements: Announcement[] = [
  {
    title: "Princeton Ethics Bowl Qualifies for Nationals",
    date: "November 2026",
    icon: Trophy,
    body: [
      "Princeton’s Ethics Bowl team is headed to Pittsburgh! On November 7, the team placed second out of 18 teams at the Online Regional Ethics Bowl, earning a spot at the 2027 APPE Intercollegiate Ethics Bowl National Championship.",
      "Congratulations to the team and coach David North. Princeton will compete at nationals on March 6 and 7 at the Wyndham Grand Pittsburgh Downtown.",
    ],
    cta: { label: "Meet the team", href: "/team" },
  },
];
