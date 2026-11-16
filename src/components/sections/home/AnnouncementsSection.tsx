import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { announcements } from "@/content/announcements";

/** Orange news band under the home hero, styled after CtaBanner. Data: content/announcements.ts. */
export default function AnnouncementsSection() {
  if (announcements.length === 0) return null;

  return (
    <section
      aria-label="Announcements"
      className="relative overflow-hidden bg-primary py-12 text-primary-foreground"
    >
      {/* Same faint diagonal streak as CtaBanner */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -left-[10%] -top-[50%] h-[200%] w-[50%] rotate-12 bg-white" />
      </div>
      {/* Periodic light sweep to draw the eye to good news */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent motion-safe:animate-shine"
      />

      <div className="container relative z-10 divide-y divide-primary-foreground/20">
        {announcements.map(({ icon: Icon, ...announcement }) => (
          <article
            key={announcement.title}
            className="relative grid grid-cols-1 gap-4 py-8 first:pt-0 last:pb-0 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-16"
          >
            {Icon && (
              /* Celebratory mark in its own space at the right edge */
              <div
                aria-hidden
                className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block"
              >
                <Icon className="h-36 w-36 rotate-12 opacity-25 motion-safe:animate-float" />
                <Sparkles className="absolute -left-6 -top-2 h-7 w-7 opacity-70 motion-safe:animate-pulse" />
                <Sparkles
                  className="absolute -bottom-1 -right-3 h-5 w-5 opacity-60 motion-safe:animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </div>
            )}
            <div>
              <p className="mb-2 font-serif text-sm italic text-primary-foreground/80">
                Announcement · {announcement.date}
              </p>
              <h2 className="font-serif text-3xl font-bold leading-tight md:text-4xl">
                {announcement.title}
              </h2>
              {announcement.cta && (
                <Link
                  to={announcement.cta.href}
                  className="group mt-4 inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
                >
                  {announcement.cta.label}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              )}
            </div>
            <div className="space-y-3 lg:pr-52">
              {announcement.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-primary-foreground/90">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
