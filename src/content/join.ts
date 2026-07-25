export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Do I need to be a philosophy major to join?",
    answer:
      "Absolutely not! We welcome students from all majors and backgrounds. Our members include philosophy majors, computer scientists, engineers, public policy students, and many others. What matters is your interest in ethical inquiry.",
  },
  {
    question: "What is the time commitment?",
    answer:
      "Membership is flexible. You can attend as many or as few events as you'd like. Leadership positions require more commitment, typically 5-10 hours per week, but general membership has no minimum requirements.",
  },
  {
    question: "How do I get involved with Telos magazine?",
    answer:
      "You can submit articles, serve on our editorial board, or help with design and layout. All levels of writing experience are welcome. We also accept creative writing, visual essays, and other experimental forms.",
  },
  {
    question: "Are there any membership fees?",
    answer:
      "No, membership is completely free. We're funded through Princeton's student activities budget and occasional grants.",
  },
  {
    question: "When and where do you meet?",
    answer:
      "We hold weekly discussion seminars on Thursday evenings and monthly speaker events. Meeting locations vary, but are always on campus. Check our calendar for specific times and locations.",
  },
  {
    question: "How can I get leadership experience?",
    answer:
      "We have several leadership positions available, including committee chairs for events, publications, outreach, and more. These roles are filled through an application process each spring and fall.",
  },
];

export interface JoinStep {
  title: string;
  description: string;
}

export const joinSteps: JoinStep[] = [
  {
    title: "Attend an Event",
    description:
      "Come to one of our weekly discussion seminars or monthly speaker events. No registration required—just show up! Check our calendar for upcoming events.",
  },
  {
    title: "Join Our Mailing List",
    description:
      "Sign up for our newsletter to receive updates about events, article submissions, and opportunities. We send out one email per week with upcoming activities.",
  },
  {
    title: "Get Involved",
    description:
      "Contribute to discussions, submit articles to Telos, volunteer for events, or apply for a leadership position. There are many ways to participate at whatever level works for you.",
  },
];
