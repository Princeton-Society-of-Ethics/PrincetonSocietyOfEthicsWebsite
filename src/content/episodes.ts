export interface PodcastEpisode {
  id: string;
  title: string;
  /** Optional guest or speaker line. */
  guest?: string;
  date?: string;
  description: string;
  /** Path under site root, e.g. /audio/interviews/episode-01.mp3 (file in public/audio/interviews/). */
  audioSrc?: string;
  /** Link to a recording hosted elsewhere (Google Drive, Zoom); used when there is no audioSrc. */
  recordingUrl?: string;
}

/** Add an entry per episode: upload audio to public/audio/interviews/ or link a hosted recording. */
export const episodes: PodcastEpisode[] = [
  {
    id: "matthew-adelstein",
    title: "In Conversation with Matthew Adelstein",
    guest: "Matthew Adelstein",
    description: "A conversation with Matthew Adelstein.",
    recordingUrl: "https://drive.google.com/file/d/19jQu01-ALd55_zfjDvWAMUcWH2vS8xLe/view",
  },
  {
    id: "peter-asaro",
    title: "In Conversation with Peter Asaro",
    guest: "Peter Asaro",
    description: "A conversation with Peter Asaro.",
    recordingUrl:
      "https://princeton.zoom.us/rec/share/rrZPExaJlVHxmRuyEHlXSmeI3yZjKpvyY8FuCGuf1G2mS75Qmjqkrj7eTZbBXm0E.fncPfkeHwK8qZQNu",
  },
];
