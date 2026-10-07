import CtaBanner from "@/components/sections/CtaBanner";
import PageHero, { Accent } from "@/components/sections/PageHero";
import TeamMemberCard from "@/components/sections/TeamMemberCard";
import TeamMemberGrid from "@/components/sections/TeamMemberGrid";
import TeamSection from "@/components/sections/TeamSection";
import { advisors, teamGroups, type TeamGroup, type TeamMember } from "@/content/team";

function renderMembers(members: TeamMember[]) {
  return members.map((member) => (
    <TeamMemberCard key={`${member.name}-${member.role}`} member={member} />
  ));
}

function TeamGroupMembers({ group }: { group: TeamGroup }) {
  if ("tiers" in group) {
    return group.tiers.map((tier) => (
      <TeamMemberGrid key={tier.label} label={tier.label}>
        {renderMembers(tier.members)}
      </TeamMemberGrid>
    ));
  }
  return <TeamMemberGrid>{renderMembers(group.members)}</TeamMemberGrid>;
}

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
        <TeamMemberGrid>
          {advisors.map((member) => (
            <TeamMemberCard key={member.name} member={member} size="large" />
          ))}
        </TeamMemberGrid>
      </TeamSection>

      {teamGroups.map((group, index) => (
        <TeamSection
          key={group.title}
          eyebrow={group.eyebrow}
          title={group.title}
          description={group.description}
          tinted={index % 2 === 0}
        >
          <TeamGroupMembers group={group} />
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
