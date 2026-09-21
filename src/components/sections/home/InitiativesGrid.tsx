import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/sections/SectionHeading";
import { Accent } from "@/components/sections/PageHero";
import CtaLink from "@/components/ui/CtaLink";
import { initiatives } from "@/content/initiatives";

/** Four-card overview of the society's initiatives, shown on the home page. */
export default function InitiativesGrid() {
  return (
    <section className="border-t-4 border-primary bg-background py-24">
      <div className="container">
        <SectionHeading
          eyebrow="What We Do"
          title={
            <>
              Our <Accent>Initiatives</Accent>
            </>
          }
          description="We translate ethical theory into practice through four core pillars of engagement, fostering a community of rigorous debate and intellectual friendship."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {initiatives.map((initiative, index) => {
            const Icon = initiative.icon;
            return (
              <article
                key={initiative.title}
                className={`group flex flex-col rounded-sm border-l-4 border-primary bg-card p-6 shadow-md transition-all duration-300 hover:bg-primary/5 hover:shadow-xl stagger-${index + 4}`}
              >
                <div className="mb-4 w-fit rounded-sm bg-primary/20 p-3 transition-colors group-hover:bg-primary/30">
                  <Icon className="h-10 w-10 text-primary" aria-hidden />
                </div>
                <h3 className="mb-4 font-serif text-2xl text-foreground">{initiative.title}</h3>
                <p className="flex-grow text-base leading-relaxed text-muted-foreground">
                  {initiative.summary}
                </p>
                <CtaLink
                  href={initiative.cta.href}
                  external={initiative.cta.external}
                  className="mt-6 inline-flex items-center font-medium text-primary transition-all hover:text-primary/80 group-hover:translate-x-1"
                >
                  LEARN MORE <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </CtaLink>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
