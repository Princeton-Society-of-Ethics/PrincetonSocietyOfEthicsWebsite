import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small italic serif line above the title, e.g. "What We Do". */
  eyebrow?: string;
  /** Heading; wrap highlighted words in <Accent> from PageHero. */
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Consistent eyebrow + title + description block that opens most sections. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-16", align === "center" && "mx-auto max-w-3xl text-center", className)}
    >
      {eyebrow && <span className="mb-2 block font-serif text-sm italic text-primary">{eyebrow}</span>}
      <h2 className="font-serif text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
