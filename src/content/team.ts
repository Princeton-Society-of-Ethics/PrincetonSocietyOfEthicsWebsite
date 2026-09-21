export interface TeamMember {
  name: string;
  role: string;
  /** Public LinkedIn profile URL. Omit or set null when unknown. */
  linkedinUrl?: string | null;
  /** Path under /public, e.g. /images/team/jane-doe.png. Falls back to initials. */
  imageSrc?: string;
  imageAlt?: string;
}

export interface TeamGroup {
  eyebrow: string;
  title: string;
  description?: string;
  members: TeamMember[];
}

export const advisors: TeamMember[] = [
  {
    name: "Professor Peter Singer",
    role: "Advisor",
    imageSrc: "/images/advisors/peter-singer.jpg",
    imageAlt: "Portrait of Professor Peter Singer",
  },
  {
    name: "Professor Gideon A. Rosen",
    role: "Advisor",
    imageSrc: "/images/advisors/gideon-rosen.jpg",
    imageAlt: "Portrait of Professor Gideon A. Rosen",
  },
  {
    name: "Professor Lara Buchak",
    role: "Advisor",
    imageSrc: "/images/advisors/lara-buchak.jpg",
    imageAlt: "Portrait of Professor Lara Buchak",
  },
  {
    name: "Professor Sarah McGrath",
    role: "Advisor",
    imageSrc: "/images/advisors/sarah-mcgrath.jpg",
    imageAlt: "Portrait of Professor Sarah McGrath",
  },
];

export const teamGroups: TeamGroup[] = [
  {
    eyebrow: "Leadership",
    title: "Executive board",
    members: [
      {
        name: "Joel Ibabao",
        role: "President",
        linkedinUrl: "https://www.linkedin.com/in/joel-ibabao",
        imageSrc: "/images/team/joel-ibabao.png",
        imageAlt: "Portrait of Joel Ibabao",
      },
      {
        name: "Sabrina Wang",
        role: "Print Manager",
        linkedinUrl: "https://www.linkedin.com/in/sabrina-wang",
        imageSrc: "/images/team/sabrina-wang.png",
        imageAlt: "Portrait of Sabrina Wang",
      },
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
    members: [
      {
        name: "Navneeth Gurachar",
        role: "Captain of Team 1",
        linkedinUrl: "https://www.linkedin.com/in/navneeth-gurachar",
        imageSrc: "/images/team/navneeth-gurachar.png",
        imageAlt: "Portrait of Navneeth Gurachar",
      },
    ],
  },
  {
    eyebrow: "Competition",
    title: "Ethics Olympiad",
    members: [
      {
        name: "Tenzin Namgyal",
        role: "Coach",
        linkedinUrl: "https://www.linkedin.com/in/tenzin-namgyal",
      },
      { name: "Professor Alexandra Oprea", role: "Consultant", linkedinUrl: null },
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
    ],
  },
];
