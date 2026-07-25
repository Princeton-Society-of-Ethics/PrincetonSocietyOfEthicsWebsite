import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeroProps {
  /** Heading; wrap the highlighted words in <Accent>. */
  title: ReactNode;
  subtitle?: string;
  /** Optional back link rendered above the title. */
  backLink?: { label: string; href: string };
  /** Optional content rendered above the title (e.g. an icon + kicker). */
  kicker?: ReactNode;
}

/** Orange-highlighted span for use inside PageHero titles. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}

/** Dark gradient hero banner used at the top of every interior page. */
export default function PageHero({ title, subtitle, backLink, kicker }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-24 pt-40 animate-fade-in">
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div className="container relative">
        {backLink && (
          <Link
            to={backLink.href}
            className="mb-8 inline-flex items-center gap-2 text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {backLink.label}
          </Link>
        )}
        {kicker && <div className="mb-6 stagger-1">{kicker}</div>}
        <h1 className="mb-3 font-serif text-5xl font-bold text-white md:text-6xl lg:text-7xl stagger-1">
          {title}
        </h1>
        <div className="mb-6 h-1 w-20 rounded-full bg-primary stagger-2" aria-hidden />
        {subtitle && (
          <p className="max-w-2xl text-xl font-light text-white/80 stagger-2">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
