import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Render in white for use over dark backgrounds. */
  onDark?: boolean;
  className?: string;
}

/** Society logo mark plus the two-line wordmark, linking home. */
export default function Logo({ onDark = false, className }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-3 transition-opacity hover:opacity-80", className)}
    >
      <img
        src="/images/logo.png"
        alt="Princeton Society of Ethics logo"
        className={cn("h-14 w-14 object-contain", onDark && "brightness-0 invert drop-shadow-lg")}
      />
      <span className="hidden flex-col sm:flex">
        <span
          className={cn(
            "font-serif text-sm font-semibold leading-none tracking-tight",
            onDark ? "text-white drop-shadow-lg" : "text-foreground"
          )}
        >
          Princeton Undergraduate
        </span>
        <span
          className={cn(
            "mt-1 font-serif text-xs font-light leading-none tracking-wide",
            onDark ? "text-white/80 drop-shadow-lg" : "text-foreground/60"
          )}
        >
          Society of Ethics
        </span>
      </span>
    </Link>
  );
}
