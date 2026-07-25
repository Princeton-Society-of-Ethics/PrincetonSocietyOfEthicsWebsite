export interface PodcastEpisode {
  id: string;
  title: string;
  /** Optional guest or speaker line. */
  guest?: string;
  date?: string;
  description: string;
  /** Path under site root, e.g. /audio/interviews/episode-01.mp3 (file in public/audio/interviews/). */
  audioSrc?: string;
}

/** Add an entry per episode after uploading MP3/M4A files to public/audio/interviews/. */
export const episodes: PodcastEpisode[] = [
  // {
  //   id: "1",
  //   title: "Episode title",
  //   guest: "Dr. Name",
  //   date: "April 2026",
  //   description: "What this conversation covers.",
  //   audioSrc: "/audio/interviews/episode-01.mp3",
  // },
];
