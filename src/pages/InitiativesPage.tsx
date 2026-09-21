import { ArrowRight } from "lucide-react";
import CtaBanner from "@/components/sections/CtaBanner";
import PageHero, { Accent } from "@/components/sections/PageHero";
import CtaLink from "@/components/ui/CtaLink";
import { initiatives } from "@/content/initiatives";
import { cn } from "@/lib/utils";

export default function InitiativesPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Our <Accent>Initiatives</Accent>
          </>
        }
        subtitle="We engage the campus community through diverse programs and projects that advance ethical inquiry and moral leadership."
      />

      <section className="bg-background py-32 animate-fade-in-up">
        <div className="container space-y-16">
          {initiatives.map((initiative, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={initiative.title}
                className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 stagger-${index + 1}`}
              >
                <div className={cn("space-y-6", !isEven && "lg:order-2")}>
                  <div>
                    <h3 className="mb-3 font-serif text-3xl font-bold text-foreground">
                      {initiative.title === "Telos" ? (
                        <>
                          <Accent>Telos</Accent> Magazine
                        </>
                      ) : (
                        initiative.title
                      )}
                    </h3>
                    <p className="text-lg font-medium text-muted-foreground">
                      {initiative.summary}
                    </p>
                  </div>

                  <p className="text-base leading-relaxed text-muted-foreground">
                    {initiative.details}
                  </p>

                  <CtaLink
                    href={initiative.cta.href}
                    external={initiative.cta.external}
                    className="group inline-flex items-center gap-2 font-serif text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
                  >
                    {initiative.cta.label}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </CtaLink>
                </div>

                {/* Photo panel opposite the text */}
                <div className={cn(!isEven && "lg:order-1")}>
                  <div className="h-80 overflow-hidden rounded-lg border border-primary/20 shadow-md">
                    <img
                      src={initiative.image.src}
                      alt={initiative.image.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBanner
        title="Ready to Explore Ethical Questions?"
        description="Whether you're a philosophy major or a computer scientist, an experienced ethicist or someone just beginning to explore these questions, there's a place for you in our community."
        actions={[{ label: "Join Our Community", href: "/join" }]}
      />
    </>
  );
}
