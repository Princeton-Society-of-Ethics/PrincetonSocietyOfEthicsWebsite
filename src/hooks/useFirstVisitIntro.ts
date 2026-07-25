import { useCallback, useState } from "react";

const STORAGE_KEY = "pse:intro-played";

/**
 * Intro lifecycle:
 * - "playing"  — overlay is running its sequence on top of the page
 * - "leaving"  — overlay is fading out; the hero starts its title reveal now
 * - "done"     — overlay unmounted (also the initial state on repeat visits)
 */
export type IntroPhase = "playing" | "leaving" | "done";

/**
 * Whether the intro should play: once per browser tab (sessionStorage),
 * and never for users who prefer reduced motion.
 */
function shouldPlayIntro(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === null;
  } catch {
    // sessionStorage can throw in private browsing modes; play the intro anyway.
    return true;
  }
}

/** Controls the one-time home page intro animation. */
export function useFirstVisitIntro() {
  const [phase, setPhase] = useState<IntroPhase>(() => (shouldPlayIntro() ? "playing" : "done"));

  const beginExit = useCallback(() => setPhase("leaving"), []);

  const finish = useCallback(() => {
    setPhase("done");
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore: worst case the intro plays again next visit.
    }
  }, []);

  return { phase, beginExit, finish };
}
