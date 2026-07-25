import { useCallback, useEffect, useState } from "react";
import { introPhotos } from "@/content/intro";
import { cn } from "@/lib/utils";

/**
 * Timeline (ms from mount), modeled on investments.yale.edu/prospect:
 * the logo appears on a solid orange field and splits in two, revealing a
 * frame of photos that pan through. The last photo holds, the field
 * crossfades to the hero's dark gradient, and the overlay lifts while the
 * hero title animates in underneath — so the intro ends inside the hero.
 */
const SPLIT_AT = 900;
const PHOTO_START = 1500;
const PHOTO_INTERVAL = 850;
const LAST_PHOTO_HOLD = 1100;
const DARK_AT = PHOTO_START + (introPhotos.length - 1) * PHOTO_INTERVAL + LAST_PHOTO_HOLD;
const EXIT_AT = DARK_AT + 850;
const EXIT_DURATION = 900;

const stages = ["logo", "split", "dark", "exit"] as const;
type Stage = (typeof stages)[number];

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
      {/* Blue and brown accent glows on the orange field */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-slate-blue blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-brown blur-3xl" />
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
            "absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-[1200ms] ease-out",
            reached("split") && "-translate-x-[34vw] translate-y-[16vh]",
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
            "absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-all duration-[1200ms] ease-out",
            reached("split") && "-translate-y-[16vh] translate-x-[34vw]",
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
