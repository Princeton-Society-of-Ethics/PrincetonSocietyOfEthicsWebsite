/**
 * Global site configuration: organization identity, navigation, and external links.
 * Edit this file to update the header, footer, and site-wide details.
 */

export const siteConfig = {
  name: "Princeton Undergraduate Society of Ethics",
  shortName: "Princeton Society of Ethics",
  founded: 2023,
  founder: "Joel Ibabao",
  description:
    "Fostering rigorous ethical inquiry and moral reflection within the Princeton community. We seek to cultivate a space where students can wrestle with life's most important questions.",
  links: {
    instagram: "https://www.instagram.com/princetonethics",
    universityCenterForHumanValues: "https://ethics.princeton.edu",
  },
} as const;

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
