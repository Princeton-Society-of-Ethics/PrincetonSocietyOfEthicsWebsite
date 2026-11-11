import { Fragment, useCallback, useEffect, useState, type CSSProperties } from "react";
import { introPhotos } from "@/content/intro";
import { cn } from "@/lib/utils";

/**
 * Timeline (ms from mount): the logo snaps in on a solid orange field, a
 * blade of light slashes through it on a diagonal, and the two halves shear
 * apart along the cut, revealing a frame of photos that slice in one after
 * another. The hero's dark gradient then wipes across on the same diagonal
 * and the overlay lifts while the hero title animates in underneath, so the
 * intro ends inside the hero. Roughly 4 seconds end to end.
 */
const SLASH_AT = 380;
const SPLIT_AT = SLASH_AT + 170;
const PHOTO_START = SPLIT_AT + 220;
const PHOTO_INTERVAL = 420;
const LAST_PHOTO_HOLD = 520;
const DARK_AT = PHOTO_START + (introPhotos.length - 1) * PHOTO_INTERVAL + LAST_PHOTO_HOLD;
const EXIT_AT = DARK_AT + 420;
const EXIT_DURATION = 450;

/**
 * The cut through the logo runs from 60% across the top edge to 40% across
 * the bottom; each half is a full copy of the logo clipped to its side.
 */
const CUT_TOP = 60;
const CUT_BOTTOM = 40;
const LEFT_PIECE = `polygon(0 0, ${CUT_TOP}% 0, ${CUT_BOTTOM}% 100%, 0 100%)`;
const RIGHT_PIECE = `polygon(${CUT_TOP}% 0, 100% 0, 100% 100%, ${CUT_BOTTOM}% 100%)`;
/** Angle of that cut from vertical, so the slash lines up with it exactly. */
const CUT_ANGLE = (Math.atan((CUT_TOP - CUT_BOTTOM) / 100) * 180) / Math.PI;

/** Same-shaped polygons (so they animate) for a left-to-right diagonal wipe. */
const WIPE_HIDDEN = "polygon(0% 0%, 0% 0%, -25% 100%, -25% 100%)";
const WIPE_SHOWN = "polygon(0% 0%, 125% 0%, 100% 100%, -25% 100%)";

/** Crisp in-out curve: quick through the middle, with a softened start and stop. */
const SLICE_EASE = "cubic-bezier(0.7, 0, 0.25, 1)";

const stages = ["logo", "slash", "split", "dark", "exit"] as const;
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
  { top: "12%", left: "10%", delay: "0.5s", duration: "1.4s", peak: 0.22 },
  { top: "22%", left: "72%", delay: "1.1s", duration: "3.4s", peak: 0.3 },
  { top: "48%", left: "25%", delay: "1.7s", duration: "2.3s", peak: 0.32 },
  { top: "58%", left: "85%", delay: "0.8s", duration: "3s", peak: 0.25 },
  { top: "15%", left: "45%", delay: "2.1s", duration: "2.8s", peak: 0.26 },
  { top: "70%", left: "55%", delay: "2.6s", duration: "3.6s", peak: 0.3 },
  { top: "38%", left: "6%", delay: "1.9s", duration: "2.5s", peak: 0.22 },
  { top: "82%", left: "20%", delay: "0.9s", duration: "3.2s", peak: 0.26 },
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
      setTimeout(() => advance("slash"), SLASH_AT),
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

      {/* Photo frame, sliced open from the center as the logo splits */}
      <div
        aria-hidden
        className="absolute z-10 h-56 w-[85vw] max-w-md overflow-hidden rounded-sm border-2 border-slate-blue/40 shadow-2xl sm:h-72 md:h-96 md:max-w-2xl"
        style={{
          clipPath: reached("split") ? "inset(0% 0% 0% 0%)" : "inset(50% 0% 50% 0%)",
          transition: `clip-path 440ms ${SLICE_EASE} 60ms`,
        }}
      >
        {introPhotos.map((photo, index) => {
          const delay = `${PHOTO_START + index * PHOTO_INTERVAL}ms`;
          return (
            <Fragment key={photo.src}>
              <div
                className="intro-photo-slice absolute inset-0"
                style={
                  {
                    animationDelay: delay,
                    zIndex: index * 2,
                    "--wipe-hidden": WIPE_HIDDEN,
                    "--wipe-shown": WIPE_SHOWN,
                  } as CSSProperties
                }
              >
                <img
                  src={photo.src}
                  alt=""
                  className="intro-photo h-full w-full object-cover"
                  style={{ animationDelay: delay }}
                />
              </div>
              {/* Bright edge riding the cut; outside the clipped layer so its glow shows */}
              <span
                className="intro-cut-glint absolute inset-y-[-20%] w-[3px] bg-white/80 shadow-[0_0_22px_6px_rgba(255,255,255,0.45)]"
                style={{ animationDelay: delay, zIndex: index * 2 + 1, rotate: "11deg" }}
              />
            </Fragment>
          );
        })}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown/30 to-transparent"
          style={{ zIndex: introPhotos.length * 2 }}
        />
      </div>

      {/* Logo, rendered as two clipped halves so it can be sliced apart */}
      <div aria-hidden className="intro-logo-in relative z-20 h-32 w-32 md:h-44 md:w-44">
        {(
          [
            [LEFT_PIECE, "-translate-x-[34vw] translate-y-[22vh] -rotate-[8deg]"],
            [RIGHT_PIECE, "translate-x-[34vw] -translate-y-[22vh] rotate-[8deg]"],
          ] as const
        ).map(([clipPath, splitClasses]) => (
          <div
            key={clipPath}
            className={cn(
              "absolute inset-0",
              reached("split") && splitClasses,
              reached("dark") && "opacity-0"
            )}
            style={{
              clipPath,
              transition: `translate 640ms ${SLICE_EASE}, rotate 640ms ${SLICE_EASE}, opacity 200ms ease-out`,
            }}
          >
            <img src="/images/logo.png" alt="" className="h-full w-full object-contain" />
          </div>
        ))}

        {/* The blade: a streak of light drawn through the logo along the cut */}
        {/* Outer span tilts to the cut around its center; inner span draws top to bottom */}
        {reached("slash") && (
          <span
            className="pointer-events-none absolute left-1/2 top-[-35%] h-[170%] w-[3px] -translate-x-1/2"
            style={{ rotate: `${CUT_ANGLE}deg` }}
          >
            <span className="intro-slash block h-full w-full bg-white shadow-[0_0_28px_8px_rgba(255,255,255,0.55)]" />
          </span>
        )}
      </div>

      {/* Quick flash of light the instant the blade connects */}
      {reached("slash") && (
        <div className="intro-flash pointer-events-none absolute inset-0 z-[25] bg-white" />
      )}

      {/* The hero's exact background wipes across on the same diagonal for a seamless handoff */}
      <div
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-br from-foreground via-foreground to-foreground/95"
        style={{
          clipPath: reached("dark") ? WIPE_SHOWN : WIPE_HIDDEN,
          transition: `clip-path 480ms ${SLICE_EASE}`,
        }}
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
