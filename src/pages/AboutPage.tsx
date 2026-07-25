import CtaBanner from "@/components/sections/CtaBanner";
import PageHero, { Accent } from "@/components/sections/PageHero";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Our <Accent>Story</Accent>
          </>
        }
        subtitle="Founded in 2023 by Joel Ibabao, the Princeton Undergraduate Society of Ethics serves as the university's premier forum for ethical discourse and rigorous moral inquiry on campus."
      />

      <section className="bg-background py-24 animate-fade-in-up">
        <div className="container max-w-4xl">
          <div className="mb-12">
            <span className="mb-4 block font-serif text-sm italic text-primary stagger-1">
              Our Mission
            </span>
            <h2 className="font-serif text-5xl font-bold text-foreground stagger-2">
              Fostering Ethical Leadership
            </h2>
          </div>

          <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
            <p className="stagger-3">
              We believe that the most pressing issues of our time are not merely technical or
              empirical, but fundamental questions of value. How should self-driving cars make
              decisions when harm is unavoidable? Should prisons prioritize in-person visitation
              over phone or video calls, even when doing so is more costly or difficult to
              administer? Do animals deserve the same moral consideration as humans when their
              suffering is at stake?
            </p>
            <p className="stagger-4">
              By equipping students with the tools of moral philosophy, we prepare students to
              think, act, and lead with integrity in an increasingly complex and noisy world. Our
              work draws on the talents of students from diverse majors, including Physics,
              Computer Science, Public Policy, and Molecular Biology.
            </p>
            <p className="stagger-5">
              Each member brings not only a distinct set of skills, but also experiences that
              enrich our conversations in substantive ways. We strive to forge a community that
              explores the many frontiers of ethics, where every voice has value.
            </p>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Join the Conversation?"
        description="Whether you're a philosophy major or simply curious about ethics, there's a place for you in our community. Join us as we explore the questions that matter most."
        actions={[{ label: "Learn More About Joining", href: "/join" }]}
      />
    </>
  );
}
