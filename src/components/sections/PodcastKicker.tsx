import type { ReactNode } from "react";
import { Mic } from "lucide-react";

/** Mic + uppercase label above the Interview Series and episode page titles. */
export default function PodcastKicker({ children = "Podcast" }: { children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-primary">
      <Mic className="h-10 w-10 shrink-0" aria-hidden />
      <span className="font-serif text-sm font-semibold uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );
}
