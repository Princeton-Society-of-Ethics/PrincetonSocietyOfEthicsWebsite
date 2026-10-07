import type { ReactNode } from "react";

interface TeamMemberGridProps {
  /** Optional tier label (e.g. "Leadership", "Members") shown between rules above the row. */
  label?: string;
  children: ReactNode;
}

/** Centered, wrapping row of TeamMemberCards, optionally introduced by a tier label. */
export default function TeamMemberGrid({ label, children }: TeamMemberGridProps) {
  return (
    <div>
      {label && (
        <div className="mb-10 flex items-center gap-5">
          <span className="h-px flex-1 bg-primary/15" aria-hidden />
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </h3>
          <span className="h-px flex-1 bg-primary/15" aria-hidden />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-x-10 gap-y-14 sm:gap-x-14">{children}</div>
    </div>
  );
}
