export interface TeamMember {
  name: string;
  role: string;
  /** Public LinkedIn profile URL. Omit or set null when unknown. */
  linkedinUrl?: string | null;
  /** University faculty profile URL (e.g. a department people page). */
  facultyPageUrl?: string;
  /** Path under /public, e.g. /images/team/jane-doe.png. Falls back to initials. */
  imageSrc?: string;
  imageAlt?: string;
}

/** A labeled row of members within a group, e.g. "Leadership" vs. "Members". */
export interface TeamTier {
  label: string;
  members: TeamMember[];
}

interface TeamGroupBase {
  eyebrow: string;
  title: string;
  description?: string;
}

/** A Team page section: either a single row of members, or several labeled tiers. */
export type TeamGroup = TeamGroupBase & ({ members: TeamMember[] } | { tiers: TeamTier[] });

/** Builds a member whose photo lives at /images/team/<slug>.jpg, plus any extra fields. */
function member(
  name: string,
  role: string,
  slug: string,
  extras: Partial<TeamMember> = {}
): TeamMember {
  return {
    name,
    role,
    imageSrc: `/images/team/${slug}.jpg`,
    imageAlt: `Portrait of ${name}`,
    ...extras,
  };
}

export const advisors: TeamMember[] = [
  {
    name: "Peter Singer",
    role: "Advisor",
    imageSrc: "/images/advisors/peter-singer.jpg",
    imageAlt: "Portrait of Peter Singer",
    facultyPageUrl: "https://uchv.princeton.edu/people/peter-singer",
  },
  {
    name: "Gideon A. Rosen",
    role: "Advisor",
    imageSrc: "/images/advisors/gideon-rosen.jpg",
    imageAlt: "Portrait of Gideon A. Rosen",
    facultyPageUrl: "https://grosen.scholar.princeton.edu/",
  },
  {
    name: "Lara Buchak",
    role: "Advisor",
    imageSrc: "/images/advisors/lara-buchak.jpg",
    imageAlt: "Portrait of Lara Buchak",
    facultyPageUrl: "https://philosophy.princeton.edu/people/lara-buchak",
  },
  {
    name: "Sarah McGrath",
    role: "Advisor",
    imageSrc: "/images/advisors/sarah-mcgrath.jpg",
    imageAlt: "Portrait of Sarah McGrath",
    facultyPageUrl: "https://philosophy.princeton.edu/people/sarah-mcgrath",
  },
];

export const teamGroups: TeamGroup[] = [
  {
    eyebrow: "Leadership",
    title: "Executive board",
    members: [
      member("Joel Ibabao", "President", "joel-ibabao", {
        linkedinUrl: "https://www.linkedin.com/in/joel-ibabao",
      }),
      {
        name: "Maribel Crespo",
        role: "Technology Director",
        linkedinUrl: "https://www.linkedin.com/in/maribel-crespo-134a33284/",
        imageSrc: "/images/team/maribel-crespo.png",
        imageAlt: "Portrait of Maribel Crespo",
      },
    ],
  },
  {
    eyebrow: "Competition",
    title: "Ethics Bowl",
    tiers: [
      {
        label: "Leadership",
        members: [
          member("Navneeth Gurachar", "Coach", "navneeth-gurachar", {
            linkedinUrl: "https://www.linkedin.com/in/navneeth-gurachar-6ba777189/",
          }),
          member("Tenzin Namgyal", "Consultant", "tenzin-namgyal", {
            linkedinUrl: "https://www.linkedin.com/in/tenzin-namgyal",
          }),
        ],
      },
      {
        label: "Members",
        // Alphabetical by last name.
        members: [
          member("Naia Albert", "Member", "naia-albert", {
            linkedinUrl: "https://www.linkedin.com/in/naia-albert/",
          }),
          member("Annika Bartucz", "Member", "annika-bartucz", {
            linkedinUrl: "https://www.linkedin.com/in/annika-bartucz/",
          }),
          member("Alexandra DaSilva", "Member", "alexandra-dasilva"),
          member("Jae-hyeok Moon", "Member", "jae-hyeok-moon"),
          member("Charlotte Ozecki", "Member", "charlotte-ozecki", {
            linkedinUrl: "https://www.linkedin.com/in/charlotte-ozeki-285a53383/",
          }),
          member("Jack Thompson", "Member", "jack-thompson", {
            linkedinUrl: "https://www.linkedin.com/in/jacktlab/",
          }),
        ],
      },
    ],
  },
  {
    eyebrow: "Competition",
    title: "Ethics Olympiad",
    members: [
      member("Tenzin Namgyal", "Coach", "tenzin-namgyal", {
        linkedinUrl: "https://www.linkedin.com/in/tenzin-namgyal",
      }),
      member("Alexandra Oprea", "Consultant", "alexandra-oprea", {
        facultyPageUrl:
          "https://www.buffalo.edu/cas/philosophy/faculty/faculty_directory/oprea.html",
      }),
    ],
  },
  {
    eyebrow: "Publication",
    title: "Telos Magazine",
    members: [
      {
        name: "Doris Lee",
        role: "Creative Director",
        linkedinUrl: "https://www.linkedin.com/in/doris-lee",
      },
      member("Sabrina Wang", "Print Manager", "sabrina-wang", {
        linkedinUrl: "https://www.linkedin.com/in/sabrina-wang",
      }),
    ],
  },
];
