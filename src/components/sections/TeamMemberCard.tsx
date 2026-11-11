import { ArrowRight, GraduationCap, Linkedin, type LucideIcon } from "lucide-react";
import type { TeamMember } from "@/content/team";
import { cn } from "@/lib/utils";

interface ProfileLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Subtle external link under a member's role (LinkedIn, faculty page). */
function ProfileLink({ href, label, icon: Icon }: ProfileLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-50 transition-opacity hover:opacity-100 group-hover:opacity-80"
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <span>{label}</span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </a>
  );
}

/** Stand-in portrait for members without a photo: the club logo on a soft orange wash. */
function LogoPlaceholder() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/[0.06] to-background"
    >
      <img
        src="/images/logo.png"
        alt=""
        className="h-[62%] w-[62%] object-contain opacity-80 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
      />
    </span>
  );
}

interface TeamMemberCardProps {
  member: TeamMember;
  /** Larger portrait styling for faculty advisors. */
  size?: "default" | "large";
}

/** Circular portrait (or club logo placeholder), name, role, and optional profile links. */
export default function TeamMemberCard({ member, size = "default" }: TeamMemberCardProps) {
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
          <LogoPlaceholder />
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
      {member.affiliation && (
        <p className="mt-1 text-xs leading-snug text-muted-foreground/80">{member.affiliation}</p>
      )}

      {member.facultyPageUrl && (
        <ProfileLink href={member.facultyPageUrl} label="Faculty Page" icon={GraduationCap} />
      )}
      {member.linkedinUrl && (
        <ProfileLink href={member.linkedinUrl} label="LinkedIn" icon={Linkedin} />
      )}
    </div>
  );
}
