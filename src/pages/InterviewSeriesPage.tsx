import PageHero, { Accent } from "@/components/sections/PageHero";
import EpisodeRow from "@/components/sections/EpisodeRow";
import PodcastKicker from "@/components/sections/PodcastKicker";
import { episodes } from "@/content/episodes";

export default function InterviewSeriesPage() {
  return (
    <>
      <PageHero
        backLink={{ label: "Back to initiatives", href: "/initiatives" }}
        kicker={<PodcastKicker />}
        title={
          <>
            Interview <Accent>Series</Accent>
          </>
        }
        subtitle="Conversations with leading philosophers and ethicists—the ideas that define who we are and what we owe each other."
      />

      <section className="py-20 animate-fade-in-up">
        <div className="container">
          {episodes.length === 0 ? (
            <p className="text-center text-muted-foreground">
              New conversations are being recorded now. Check back soon.
            </p>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {episodes.map((episode) => (
                <li key={episode.id}>
                  <EpisodeRow episode={episode} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
