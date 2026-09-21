import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { introPhotos } from "@/content/intro";
import { cn } from "@/lib/utils";

/**
 * Timeline (ms from mount), modeled on investments.yale.edu/prospect:
 * the logo appears on a solid orange field and splits in two, revealing a
 * frame of photos that pan through. The last photo holds, the field
 * crossfades to the hero's dark gradient, and the overlay lifts while the
 * hero title animates in underneath — so the intro ends inside the hero.
 */
const SPLIT_AT = 700;
const PHOTO_START = 1300;
const PHOTO_INTERVAL = 850;
const LAST_PHOTO_HOLD = 1100;
const DARK_AT = PHOTO_START + (introPhotos.length - 1) * PHOTO_INTERVAL + LAST_PHOTO_HOLD;
const EXIT_AT = DARK_AT + 850;
const EXIT_DURATION = 900;

const stages = ["logo", "split", "dark", "exit"] as const;
type Stage = (typeof stages)[number];

interface ShimmerCell {
  /** Position as a percentage, so cells stay spread out on any screen size. */
  top: string;
  left: string;
  delay: string;
  duration: string;
  /** Peak opacity reached mid-pulse — the shimmer's "strength". */
  peak: number;
}

/** Scattered grid cells that pulse at their own timing and brightness. */
const shimmerCells: ShimmerCell[] = [
  { top: "12%", left: "10%", delay: "1.4s", duration: "2.6s", peak: 0.22 },
  { top: "22%", left: "72%", delay: "2.3s", duration: "3.4s", peak: 0.3 },
  { top: "48%", left: "25%", delay: "3.1s", duration: "2.3s", peak: 0.32 },
  { top: "58%", left: "85%", delay: "1.8s", duration: "3s", peak: 0.25 },
  { top: "15%", left: "45%", delay: "3.6s", duration: "2.8s", peak: 0.26 },
  { top: "70%", left: "55%", delay: "2.6s", duration: "3.6s", peak: 0.3 },
  { top: "38%", left: "6%", delay: "3.3s", duration: "2.5s", peak: 0.22 },
  { top: "82%", left: "20%", delay: "2s", duration: "3.2s", peak: 0.26 },
];

interface IntroOverlayProps {
  /** Called when the overlay starts fading; begin the hero reveal now. */
  onBeginExit: () => void;
  /** Called when the fade completes; unmount the overlay then. */
  onFinish: () => void;
}

/** Full-screen opening animation shown on the first visit to the home page. */
export default function IntroOverlay({ onBeginExit, onFinish }: IntroOverlayProps) {
  const [stage, setStage] = useState<Stage>("logo");
  const reached = (s: Stage) => stages.indexOf(stage) >= stages.indexOf(s);

  const advance = useCallback((next: Stage) => {
    setStage((current) => (current === "exit" ? current : next));
  }, []);

  const skip = useCallback(() => setStage("exit"), []);

  useEffect(() => {
    const timers = [
      setTimeout(() => advance("split"), SPLIT_AT),
      setTimeout(() => advance("dark"), DARK_AT),
      setTimeout(() => advance("exit"), EXIT_AT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [advance]);

  // The exit handoff runs exactly once, whether reached by timer or skip.
  useEffect(() => {
    if (stage !== "exit") return;
    onBeginExit();
    const timer = setTimeout(onFinish, EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [stage, onBeginExit, onFinish]);

  // Lock scrolling and allow skipping with the Escape key while the intro plays.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [skip]);

  return (
    <div
      role="presentation"
      onClick={skip}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-primary transition-opacity",
        stage === "exit" && "pointer-events-none opacity-0"
      )}
      style={{ transitionDuration: `${EXIT_DURATION}ms` }}
    >
      {/* Faint grid backdrop, matching HomeHero's pattern for visual continuity
          into the page it hands off to. Own id (not "grid") since HomeHero
          is mounted alongside this overlay during the exit fade. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-background opacity-[0.14]"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="intro-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#intro-grid)" />
        </svg>
      </div>

      {/* Individual grid cells shimmering at their own timing and strength */}
      {shimmerCells.map((cell, index) => (
        <div
          key={index}
          aria-hidden
          className="intro-grid-shimmer pointer-events-none absolute h-10 w-10 bg-background blur-[3px]"
          style={
            {
              top: cell.top,
              left: cell.left,
              animationDelay: cell.delay,
              animationDuration: cell.duration,
              "--shimmer-peak": cell.peak,
            } as CSSProperties
          }
        />
      ))}

      {/* Warm drifting glow so the orange field reads as alive, not flat */}
      <div
        aria-hidden
        className="intro-bg-drift pointer-events-none absolute -inset-1/4 rounded-full opacity-25 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-background) 0%, transparent 65%)",
        }}
      />

      {/* Blue and brown accent glows on the orange field; flare up as the logo splits */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-700",
          reached("split") ? "opacity-35" : "opacity-20"
        )}
      >
        <div className="intro-blob-float absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-slate-blue blur-3xl" />
        <div
          className="intro-blob-float absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-brown blur-3xl"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      {/* Photo frame revealed behind the splitting logo */}
      <div
        aria-hidden
        className={cn(
          "absolute z-10 h-56 w-[85vw] max-w-md overflow-hidden rounded-sm border-2 border-slate-blue/40 shadow-2xl transition-all delay-150 duration-1000 sm:h-72 md:h-96 md:max-w-2xl",
          reached("split") ? "scale-100 opacity-100" : "scale-90 opacity-0",
          reached("dark") && "opacity-0"
        )}
      >
        {introPhotos.map((photo, index) => (
          <img
            key={photo.src}
            src={photo.src}
            alt=""
            className="intro-photo absolute inset-0 h-full w-full object-cover"
            style={{
              animationDelay: `${PHOTO_START + index * PHOTO_INTERVAL}ms`,
              zIndex: index,
            }}
          />
        ))}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brown/30 to-transparent" />
      </div>

      {/* Logo, rendered as two halves so it can split apart */}
      <div aria-hidden className="intro-logo-in relative z-20 h-32 w-32 md:h-44 md:w-44">
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            reached("split") && "-translate-x-[34vw] translate-y-[16vh] -rotate-6",
            reached("dark") && "opacity-0"
          )}
        >
          <img
            src="/images/logo.png"
            alt=""
            className="h-full w-[200%] max-w-none object-contain"
          />
        </div>
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
            reached("split") && "-translate-y-[16vh] translate-x-[34vw] rotate-6",
            reached("dark") && "opacity-0"
          )}
        >
          <img
            src="/images/logo.png"
            alt=""
            className="h-full w-[200%] max-w-none -translate-x-1/2 object-contain"
          />
        </div>
      </div>

      {/* Crossfade into the hero's exact background for a seamless handoff */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-30 bg-gradient-to-br from-foreground via-foreground to-foreground/95 transition-opacity duration-[800ms]",
          reached("dark") ? "opacity-100" : "opacity-0"
        )}
      />

      <button
        type="button"
        onClick={skip}
        className="absolute bottom-8 right-8 z-40 cursor-pointer text-sm text-white/70 transition-colors hover:text-white"
      >
        Skip intro →
      </button>
    </div>
  );
}
