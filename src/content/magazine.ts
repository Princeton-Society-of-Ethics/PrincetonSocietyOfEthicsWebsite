export interface MagazineIssue {
  volume: string;
  issue: string;
  title: string;
  date: string;
  description: string;
  articles: string[];
}

export interface Article {
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
}

/**
 * Placeholder editorial content carried over from the original site.
 * Replace with real Telos issues and articles as they are published.
 */
export const issues: MagazineIssue[] = [
  {
    volume: "Volume 14",
    issue: "Issue 2",
    title: "The Ethics of Artificial Intelligence",
    date: "Fall 2024",
    description: "Exploring the moral implications of AI development, deployment, and governance.",
    articles: [
      "AI Governance: Who Decides?",
      "Algorithmic Bias and Justice",
      "The Future of Human-AI Collaboration",
    ],
  },
  {
    volume: "Volume 14",
    issue: "Issue 1",
    title: "Climate Justice and Intergenerational Ethics",
    date: "Spring 2024",
    description:
      "Examining our moral obligations to future generations and the ethics of environmental action.",
    articles: [
      "Climate Change as an Ethical Crisis",
      "Indigenous Knowledge and Environmental Ethics",
      "Individual Action vs. Systemic Change",
    ],
  },
  {
    volume: "Volume 13",
    issue: "Issue 2",
    title: "Bioethics in the Modern Age",
    date: "Fall 2023",
    description: "Investigating ethical questions in medicine, genetics, and biotechnology.",
    articles: [
      "CRISPR and the Ethics of Gene Editing",
      "Healthcare Access as a Moral Right",
      "Pandemic Ethics: Lessons Learned",
    ],
  },
];

export const featuredArticles: Article[] = [
  {
    title: "The Trolley Problem in Autonomous Vehicles",
    author: "Jessica Martinez",
    date: "December 2024",
    category: "Applied Ethics",
    excerpt:
      "When self-driving cars must make split-second decisions, how should we program their moral choices? This article explores the philosophical implications of algorithmic ethics.",
  },
  {
    title: "Reparations and Restorative Justice",
    author: "James Chen",
    date: "November 2024",
    category: "Social Justice",
    excerpt:
      "An examination of how restorative justice frameworks can address historical wrongs and build more equitable communities.",
  },
  {
    title: "The Ethics of Artificial Beauty",
    author: "Sofia Patel",
    date: "October 2024",
    category: "Aesthetics",
    excerpt:
      "Exploring what we value in beauty, authenticity, and the role of technology in shaping our aesthetic standards.",
  },
];

export const recentArticles: Article[] = [
  {
    title: "The Moral Status of Sentient AI",
    author: "Marcus Johnson",
    date: "January 2025",
    category: "Philosophy",
    excerpt:
      "As AI systems become more sophisticated, we must ask: do they deserve moral consideration?",
  },
  {
    title: "Environmental Justice and Indigenous Rights",
    author: "Aisha Okonkwo",
    date: "December 2024",
    category: "Social Ethics",
    excerpt:
      "How can we balance environmental protection with the rights of indigenous communities?",
  },
  {
    title: "The Ethics of Wealth Inequality",
    author: "David Lee",
    date: "November 2024",
    category: "Political Ethics",
    excerpt: "Examining philosophical frameworks for addressing global economic disparities.",
  },
];

export const categories = [
  "Applied Ethics",
  "Social Justice",
  "Philosophy",
  "Political Ethics",
  "Aesthetics",
];
