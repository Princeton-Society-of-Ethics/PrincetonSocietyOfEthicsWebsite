import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

const quotes = [
  { text: "The unexamined life is not worth living.", attribution: "Socrates" },
  {
    text: "Ethics is knowing the difference between what you have a right to do and what is right to do.",
    attribution: "Potter Stewart",
  },
];

/** Full-screen dark landing hero with the Socrates artwork and floating quotes. */
export default function HomeHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-foreground via-foreground to-foreground/95 pb-24 pt-32 text-background">
      {/* Soft orange glows */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="absolute left-10 top-20 h-72 w-72 animate-pulse rounded-full bg-primary mix-blend-multiply blur-3xl" />
        <div
          className="absolute -bottom-8 right-10 h-72 w-72 animate-pulse rounded-full bg-primary mix-blend-multiply blur-3xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Faint grid backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8 pt-20 animate-fade-in-up">
          <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight md:text-7xl stagger-1">
            What do we owe <br />
            <span className="italic text-primary">to each other?</span>
          </h1>

          <p className="max-w-xl text-lg font-light leading-relaxed text-background/80 md:text-xl stagger-2">
            The Princeton Undergraduate Society for Ethics promotes ethical reflection on today's
            most pressing issues through initiatives that engage Princeton's undergraduate and
            graduate students and faculty.
          </p>

          <div className="flex flex-wrap gap-4 pt-4 stagger-3">
            <Link to="/initiatives">
              <Button size="lg">Explore Initiatives</Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-background/30 text-background hover:bg-background/10"
              >
                Our Mission
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative hidden h-[600px] w-full pt-20 lg:block animate-slide-in-right">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent shadow-2xl stagger-4">
            <img
              src="/images/socrates-hero.jpg"
              alt="Socrates, ancient Greek philosopher"
              className="h-[60%] w-[60%] object-contain opacity-80 drop-shadow-lg"
            />
          </div>

          {quotes.map((quote, index) => (
            <blockquote
              key={quote.attribution}
              className={
                index === 0
                  ? "absolute right-8 top-24 z-20 max-w-xs rounded-sm border-l-4 border-primary bg-background p-4 text-foreground shadow-lg stagger-5"
                  : "absolute bottom-24 left-8 z-20 max-w-xs rounded-sm border-l-4 border-primary bg-background p-4 text-foreground shadow-lg stagger-6"
              }
            >
              <p className="mb-2 font-serif text-sm italic">"{quote.text}"</p>
              <footer className="text-xs font-medium text-muted-foreground">
                — {quote.attribution}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
