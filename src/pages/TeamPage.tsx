import CtaBanner from "@/components/sections/CtaBanner";
import PageHero, { Accent } from "@/components/sections/PageHero";
import TeamMemberCard from "@/components/sections/TeamMemberCard";
import TeamSection from "@/components/sections/TeamSection";
import { advisors, teamGroups } from "@/content/team";

export default function TeamPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Our <Accent>Team</Accent>
          </>
        }
        subtitle="Meet the dedicated students and faculty who make the Princeton Undergraduate Society of Ethics possible."
      />

      <TeamSection
        eyebrow="Faculty"
        title="Advisors"
        description="Our work is guided by distinguished scholars in ethics and philosophy."
      >
        {advisors.map((member) => (
          <TeamMemberCard key={member.name} member={member} size="large" />
        ))}
      </TeamSection>

      {teamGroups.map((group, index) => (
        <TeamSection
          key={group.title}
          eyebrow={group.eyebrow}
          title={group.title}
          description={group.description}
          tinted={index % 2 === 0}
        >
          {group.members.map((member) => (
            <TeamMemberCard key={`${member.name}-${member.role}`} member={member} />
          ))}
        </TeamSection>
      ))}

      <CtaBanner
        title="Interested in Leadership?"
        description="Leadership applications open twice a year—in the fall and spring. Whether you care about events, publications, outreach, or operations, there's a place to lead in our community."
        actions={[{ label: "Learn More About Joining", href: "/join" }]}
      />
    </>
  );
}
