import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EpisodeRow from "@/components/sections/EpisodeRow";
import PageHero, { Accent } from "@/components/sections/PageHero";
import PodcastKicker from "@/components/sections/PodcastKicker";
import SectionHeading from "@/components/sections/SectionHeading";
import { episodeNumber, episodes } from "@/content/episodes";
import NotFoundPage from "@/pages/NotFoundPage";

const SERIES_PATH = "/initiatives/interview-series";

/** Single interview: the video with its details alongside, then the rest of the series. */
export default function InterviewEpisodePage() {
  const { episodeId } = useParams();
  const episode = episodes.find((e) => e.id === episodeId);
  if (!episode?.videoSrc) return <NotFoundPage />;

  const number = episodeNumber(episode);
  const otherEpisodes = episodes.filter((e) => e.id !== episode.id);
  const details = [
    { label: "Episode", value: number },
    { label: "Recorded", value: episode.date },
    { label: "Running time", value: episode.duration },
  ].filter((detail) => detail.value);

  return (
    <>
      <PageHero
        backLink={{ label: "All interviews", href: SERIES_PATH }}
        kicker={<PodcastKicker>Episode {number} · In conversation with</PodcastKicker>}
        title={episode.guest}
        subtitle={episode.affiliation}
      />

      {/* Video on the left, lined up with the title; details beside it */}
      <section className="py-16 md:py-20">
        <div className="container grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <video
            controls
            playsInline
            preload="metadata"
            src={episode.videoSrc}
            className="aspect-video w-full rounded-sm bg-black shadow-xl animate-fade-in-up"
          >
            Your browser does not support embedded video.
          </video>

          <div className="animate-fade-in-up">
            <p className="font-serif text-sm italic text-primary">About the conversation</p>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              {episode.description ??
                `Episode ${number} of the Interview Series, our conversations with leading philosophers and ethicists.`}
            </p>

            <dl className="mt-8 divide-y divide-border border-y border-border">
              {details.map((detail) => (
                <div key={detail.label} className="flex items-baseline justify-between gap-4 py-4">
                  <dt className="font-serif text-sm italic text-muted-foreground">
                    {detail.label}
                  </dt>
                  <dd className="font-serif text-lg text-foreground">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {otherEpisodes.length > 0 && (
        <section className="border-t-4 border-primary/20 bg-secondary/20 py-20">
          <div className="container">
            <SectionHeading
              eyebrow="Keep watching"
              title={
                <>
                  More <Accent>interviews</Accent>
                </>
              }
              className="mb-10"
            />
            <ul className="divide-y divide-border border-y border-border">
              {otherEpisodes.map((other) => (
                <li key={other.id}>
                  <EpisodeRow episode={other} />
                </li>
              ))}
            </ul>
            <Link
              to={SERIES_PATH}
              className="group mt-8 inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80"
            >
              See the full series
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
