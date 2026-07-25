import { Mic } from "lucide-react";
import PageHero, { Accent } from "@/components/sections/PageHero";
import { episodes } from "@/content/episodes";

export default function InterviewSeriesPage() {
  return (
    <>
      <PageHero
        backLink={{ label: "Back to initiatives", href: "/initiatives" }}
        kicker={
          <div className="flex items-center gap-3 text-primary">
            <Mic className="h-10 w-10 shrink-0" aria-hidden />
            <span className="font-serif text-sm font-semibold uppercase tracking-[0.2em]">
              Podcast
            </span>
          </div>
        }
        title={
          <>
            Interview <Accent>Series</Accent>
          </>
        }
        subtitle="Conversations with leading philosophers and ethicists—the ideas that define who we are and what we owe each other."
      />

      <section className="border-b border-border py-20 animate-fade-in-up">
        <div className="container max-w-3xl">
          {episodes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/[0.03] px-8 py-14 text-center">
              <Mic className="mx-auto mb-4 h-12 w-12 text-primary/60" aria-hidden />
              <p className="font-serif text-xl font-semibold text-foreground">
                Episodes on the way
              </p>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                New conversations are being recorded now. Check back soon, or follow us on
                Instagram for release announcements.
              </p>
            </div>
          ) : (
            <ul className="space-y-12">
              {episodes.map((episode) => (
                <li
                  key={episode.id}
                  className="border-l-4 border-primary bg-card/50 py-8 pl-8 pr-6 animate-fade-in-up"
                >
                  <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                    {episode.title}
                  </h2>
                  {episode.guest && (
                    <p className="mt-2 text-sm font-medium text-primary">{episode.guest}</p>
                  )}
                  {episode.date && (
                    <p className="mt-1 text-sm text-muted-foreground">{episode.date}</p>
                  )}
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {episode.description}
                  </p>
                  {episode.audioSrc ? (
                    <audio
                      controls
                      preload="metadata"
                      className="mt-6 h-12 w-full max-w-xl rounded-sm"
                      src={episode.audioSrc}
                    >
                      Your browser does not support embedded audio.
                    </audio>
                  ) : (
                    <p className="mt-6 text-sm italic text-muted-foreground">Audio coming soon.</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
