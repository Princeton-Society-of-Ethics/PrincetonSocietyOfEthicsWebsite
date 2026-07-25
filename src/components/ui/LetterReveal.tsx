import { Fragment } from "react";

interface LetterRevealProps {
  text: string;
  /** Delay before the first letter, in ms. */
  baseDelayMs?: number;
  /** Gap between consecutive letters, in ms. */
  stepMs?: number;
  className?: string;
}

/**
 * Fades text in letter by letter on mount, wrapping only at word boundaries.
 * Purely visual: it is hidden from screen readers, so give the surrounding
 * heading an aria-label with the full text.
 */
export default function LetterReveal({
  text,
  baseDelayMs = 0,
  stepMs = 45,
  className,
}: LetterRevealProps) {
  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <span aria-hidden className={className}>
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {/* The space must sit OUTSIDE the word span: browsers strip
              trailing whitespace inside inline-block elements. */}
          {wordIndex > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, charIndex) => (
              <span
                key={charIndex}
                className="inline-block animate-letter-in"
                style={{ animationDelay: `${baseDelayMs + letterIndex++ * stepMs}ms` }}
              >
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
