import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TeamSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Warm orange wash behind the section. */
  tinted?: boolean;
  children: ReactNode;
}

/** Centered section wrapper used to group team members on the Team page. */
export default function TeamSection({
  eyebrow,
  title,
  description,
  tinted = false,
  children,
}: TeamSectionProps) {
  return (
    <section
      className={cn("border-b border-primary/10 py-20 last:border-b-0", tinted && "bg-primary/[0.045]")}
    >
      <div className="container max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          {eyebrow && (
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h2>
          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-primary/80" aria-hidden />
          {description && (
            <p className="mt-5 text-base font-light leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-14 sm:gap-x-14">{children}</div>
      </div>
    </section>
  );
}
