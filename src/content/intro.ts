/**
 * Content for the opening intro animation on the home page.
 * Swap or reorder photos freely — 4 to 6 images look best.
 */

export interface IntroPhoto {
  src: string;
  alt: string;
}

/** Photos revealed between the split logo halves, in display order. */
export const introPhotos: IntroPhoto[] = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Moderator addressing two teams during an Ethics Bowl round",
  },
  { src: "/images/gallery-2.jpg", alt: "Student speaking at the Ethics Bowl podium" },
  { src: "/images/gallery-3.jpg", alt: "Students responding to a judge's question" },
  { src: "/images/gallery-4.jpg", alt: "Teammates strategizing between rounds" },
  { src: "/images/gallery-5.jpg", alt: "Judges scoring an Ethics Bowl round" },
  { src: "/images/gallery-6.jpg", alt: "Teammates smiling together at the Ethics Bowl" },
];
