import { Award, BookOpen, GraduationCap, Mic, type LucideIcon } from "lucide-react";

export interface GalleryImage {
  src: string;
  alt: string;
  /** Tailwind grid classes controlling this tile's span in the gallery layout. */
  span?: string;
}

export interface Initiative {
  title: string;
  /** Short blurb for cards on the home page. */
  summary: string;
  /** Longer paragraph for the initiatives page. */
  details: string;
  icon: LucideIcon;
  /** Photo shown in the decorative panel on the initiatives page. */
  image: GalleryImage;
  cta: { label: string; href: string; external?: boolean };
}

export const initiatives: Initiative[] = [
  {
    title: "The Intercollegiate Ethics Bowl",
    summary:
      "A national ethics competition where undergraduates discuss real-world moral issues and defend their team's positions through clear reasoning and thoughtful, respectful dialogue.",
    details:
      "The Intercollegiate Ethics Bowl is a national ethics competition where undergraduates discuss real-world moral issues and defend their team's positions. Judges look for clear reasoning, an understanding of different perspectives, and thoughtful, respectful dialogue rather than quick point-scoring.",
    icon: Award,
    image: {
      src: "/images/initiatives/ethics-bowl.jpg",
      alt: "Students debating during an Ethics Bowl round",
    },
    cta: { label: "View moments & gallery", href: "/initiatives/moments" },
  },
  {
    title: "Telos",
    summary:
      "An ethics magazine that enriches, expands, and sustains the conversation about values. We publish essays by undergraduates who engage critically and creatively with questions of ethics and morality.",
    details:
      "Telos is an ethics magazine that enriches, expands, and sustains the conversation about values—the most important conversation any culture and society can have. We publish essays by undergraduate students who engage critically and creatively with questions of ethics and morality.",
    icon: BookOpen,
    image: {
      src: "/images/initiatives/telos.jpg",
      alt: "Close-up of handwritten notes and analysis",
    },
    // Linking straight to the PDF of our one published issue until there are
    // enough issues to justify sending readers to the in-app magazine
    // (MagazinePage, still routed at /journal and /magazine) instead.
    cta: { label: "Explore Telos", href: "/documents/telos-issue-1.pdf", external: true },
  },
  {
    title: "NJ Regional High School Ethics Bowl",
    summary:
      "We organized the 3rd Annual NJ Regional High School Ethics Bowl at Princeton, with over 100 participants and 16 competing teams analyzing and discussing complex moral questions.",
    details:
      "The National High School Ethics Bowl (NHSEB) is a team-based academic competition where students analyze and discuss complex moral questions about real-world issues. We organized the 3rd Annual NJ Regional High School Ethics Bowl at Princeton University, held on January 31, 2026, at the Friend Center, with over 100 participants and 16 competing teams.",
    icon: GraduationCap,
    image: {
      src: "/images/initiatives/njhseb.jpg",
      alt: "Team at the table during the NJ Regional High School Ethics Bowl",
    },
    cta: { label: "Get involved", href: "/join" },
  },
  {
    title: "Interview Series",
    summary:
      "An interview series with leading philosophers and ethicists, exploring the ideas that define who we are and what we owe each other.",
    details:
      "An interview series with leading philosophers and ethicists, exploring the ideas that define who we are and what we owe each other.",
    icon: Mic,
    image: {
      src: "/images/initiatives/interview-series.jpg",
      alt: "Speaker presenting at a podium",
    },
    cta: { label: "Listen to episodes", href: "/initiatives/interview-series" },
  },
];

export const ethicsBowlGallery: GalleryImage[] = [
  {
    src: "/images/ethics-bowl-5.png",
    alt: "3rd Annual NJ High School Ethics Bowl",
    span: "md:col-span-2",
  },
  { src: "/images/ethics-bowl-2.png", alt: "Ethics Bowl presentation" },
  { src: "/images/ethics-bowl-4.png", alt: "Team strategy session" },
  { src: "/images/ethics-bowl-3.png", alt: "Team discussion" },
  {
    src: "/images/ethics-bowl-1.png",
    alt: "Team collaboration at Ethics Bowl",
    span: "lg:col-span-2 lg:row-span-2",
  },
  { src: "/images/ethics-bowl-6.png", alt: "Students in discussion" },
  { src: "/images/ethics-bowl-7.png", alt: "Team at work with supervisor" },
  {
    src: "/images/ethics-bowl-8.png",
    alt: "Community gathering at Ethics Bowl",
    span: "md:col-span-2",
  },
];
