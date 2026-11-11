/**
 * Global site configuration: organization identity, navigation, and external links.
 * Edit this file to update the header, footer, and site-wide details.
 */

import { isRegistrationOpen } from "./ethicsBowlRegistration";
import { isVolunteerFormOpen } from "./ethicsBowlVolunteer";

/** Ethics Bowl registration links only appear while registration is open. */
const registrationOpen = isRegistrationOpen();

export const siteConfig = {
  name: "Princeton Undergraduate Society of Ethics",
  shortName: "Princeton Society of Ethics",
  founded: 2023,
  founder: "Joel Ibabao",
  /** General contact address, used by "Get in touch" buttons. */
  contactEmail: "ethics@princeton.edu",
  description:
    "Fostering rigorous ethical inquiry and moral reflection within the Princeton community. We seek to cultivate a space where students can wrestle with life's most important questions.",
  links: {
    instagram: "https://www.instagram.com/princetonethics",
    universityCenterForHumanValues: "https://ethics.princeton.edu",
  },
} as const;

export interface Sponsor {
  name: string;
  /** Short line under the name describing who they are. */
  description: string;
  href: string;
}

/** Organizations listed in the home page "Sponsors & partners" section. */
export const sponsors: Sponsor[] = [
  {
    name: "The Marc Sanders Foundation",
    description: "Supporting public philosophy and the National High School Ethics Bowl",
    href: "https://www.marcsandersfoundation.org/",
  },
  {
    name: "Parr Center for Ethics",
    description: "University of North Carolina at Chapel Hill",
    href: "https://parrcenter.unc.edu/",
  },
];

export interface NavItem {
  label: string;
  href: string;
}

/** Links shown in the scrolled-in desktop header (JOIN US renders as a button). */
export const primaryNav: NavItem[] = [
  { label: "ABOUT", href: "/about" },
  { label: "INITIATIVES", href: "/initiatives" },
];

/** Links shown in the full-page menu overlay. */
export const menuNav: NavItem[] = [
  { label: "ABOUT", href: "/about" },
  { label: "TEAM", href: "/team" },
  { label: "INITIATIVES", href: "/initiatives" },
  { label: "JOIN US", href: "/join" },
];

export const footerNav: { heading: string; items: (NavItem & { external?: boolean })[] }[] = [
  {
    heading: "Connect",
    items: [
      { label: "Join Us", href: "/join" },
      ...(registrationOpen ? [{ label: "Ethics Bowl Registration", href: "/register" }] : []),
      ...(isVolunteerFormOpen()
        ? [{ label: "Volunteer at the Ethics Bowl", href: "/volunteer" }]
        : []),
      { label: "Instagram", href: siteConfig.links.instagram, external: true },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "Initiatives", href: "/initiatives" },
      { label: "Our Team", href: "/team" },
      {
        label: "University Center for Human Values",
        href: siteConfig.links.universityCenterForHumanValues,
        external: true,
      },
    ],
  },
];
