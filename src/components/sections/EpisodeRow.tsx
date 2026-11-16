import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { episodeNumber, type PodcastEpisode } from "@/content/episodes";

/** One line of the episode index; links to the episode page once its video is up. */
export default function EpisodeRow({ episode }: { episode: PodcastEpisode }) {
  const available = Boolean(episode.videoSrc);

  const content = (
    <>
      <span className="font-serif text-lg italic text-primary">{episodeNumber(episode)}</span>
      <span className="min-w-0">
        <span
          className={
            available
              ? "block font-serif text-2xl text-foreground transition-colors group-hover:text-primary md:text-3xl"
              : "block font-serif text-2xl text-foreground/50 md:text-3xl"
          }
        >
          {episode.guest}
        </span>
        {episode.affiliation && (
          <span className="mt-1 block text-muted-foreground">{episode.affiliation}</span>
        )}
      </span>
      <span className="flex items-center gap-4 text-sm text-muted-foreground">
        {available ? (
          <>
            {episode.duration && <span className="hidden sm:inline">{episode.duration}</span>}
            <ArrowRight
              className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </>
        ) : (
          <span className="italic">Coming soon</span>
        )}
      </span>
    </>
  );

  const rowClass = "grid grid-cols-[3rem_1fr_auto] items-center gap-4 py-8 md:gap-8";

  return available ? (
    <Link
      to={`/initiatives/interview-series/${episode.id}`}
      className={`group ${rowClass}`}
      aria-label={`Watch the interview with ${episode.guest}`}
    >
      {content}
    </Link>
  ) : (
    <div className={rowClass}>{content}</div>
  );
}
