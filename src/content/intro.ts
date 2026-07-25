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
  { src: "/images/gallery-1.jpg", alt: "Society members in discussion" },
  { src: "/images/gallery-2.jpg", alt: "Ethics event at Princeton" },
  { src: "/images/gallery-3.jpg", alt: "Students debating a case" },
  { src: "/images/gallery-4.jpg", alt: "Speaker event" },
  { src: "/images/gallery-5.jpg", alt: "Society community gathering" },
];
