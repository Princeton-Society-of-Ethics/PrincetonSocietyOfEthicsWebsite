import { ArrowRight, Linkedin } from "lucide-react";
import type { TeamMember } from "@/content/team";
import { cn } from "@/lib/utils";

function memberInitial(name: string) {
  return name.replace(/^Professor\s+/i, "").charAt(0);
}

interface TeamMemberCardProps {
  member: TeamMember;
  /** Larger portrait styling for faculty advisors. */
  size?: "default" | "large";
}

/** Circular portrait (or initial placeholder), name, role, and optional LinkedIn link. */
export default function TeamMemberCard({ member, size = "default" }: TeamMemberCardProps) {
  const showLinkedIn = Boolean(member.linkedinUrl) && !/^professor\s+/i.test(member.name);
  const large = size === "large";

  return (
    <div
      className={cn(
        "group flex flex-col items-center text-center",
        large ? "max-w-[260px]" : "w-[168px] sm:w-[188px]"
      )}
    >
      <div
        className={cn(
          "relative mb-5 flex items-center justify-center overflow-hidden rounded-full border-2 border-primary/25 bg-muted transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_24px_-4px] group-hover:shadow-primary/35",
          large ? "h-44 w-44" : "h-32 w-32 sm:h-36 sm:w-36"
        )}
      >
        {member.imageSrc ? (
          <img
            src={member.imageSrc}
            alt={member.imageAlt ?? `Photo of ${member.name}`}
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="text-4xl font-semibold text-muted-foreground/85 transition-colors duration-300 group-hover:text-primary sm:text-5xl">
            {memberInitial(member.name)}
          </span>
        )}
      </div>

      <h3
        className={cn(
          "font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary",
          large ? "text-lg" : "text-base"
        )}
      >
        {member.name}
      </h3>
      <p className="mt-1.5 text-sm leading-snug text-muted-foreground transition-colors duration-300 group-hover:text-primary/75">
        {member.role}
      </p>

      {showLinkedIn && (
        <a
          href={member.linkedinUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-50 transition-opacity hover:opacity-100 group-hover:opacity-80"
        >
          <Linkedin className="h-4 w-4 shrink-0" aria-hidden />
          <span>LinkedIn</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </a>
      )}
    </div>
  );
}
