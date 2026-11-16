export interface PodcastEpisode {
  /** URL slug: the episode lives at /initiatives/interview-series/<id>. */
  id: string;
  /** Who the conversation is with; the episode's heading. */
  guest: string;
  /** Optional line under the name, e.g. "Philosopher of technology, The New School". */
  affiliation?: string;
  date?: string;
  /** Running time, e.g. "1 hr 42 min". */
  duration?: string;
  /** Optional summary of what the conversation covers. */
  description?: string;
  /** MP4 URL. Episodes without one are listed as "Coming soon" and don't link anywhere. */
  videoSrc?: string;
}

/**
 * One entry per episode, oldest first (episodes are numbered in this order).
 * Videos are too large for the repo, so videoSrc points at the file in Vercel Blob
 * (upload with `vercel blob put <file> --access public --pathname interviews/<id>.mp4`).
 */
export const episodes: PodcastEpisode[] = [
  {
    id: "matthew-adelstein",
    guest: "Matthew Adelstein",
    duration: "1 hr 42 min",
    videoSrc:
      "https://wmglpeo1wu4tgxlq.public.blob.vercel-storage.com/interviews/matthew-adelstein.mp4",
  },
  {
    id: "peter-asaro",
    guest: "Peter Asaro",
  },
];

/** Two-digit episode number from its position in the list, e.g. "01". */
export function episodeNumber(episode: PodcastEpisode): string {
  return String(episodes.indexOf(episode) + 1).padStart(2, "0");
}
