import CtaBanner from "@/components/sections/CtaBanner";
import PageHero, { Accent } from "@/components/sections/PageHero";
import SectionHeading from "@/components/sections/SectionHeading";
import { ethicsBowlGallery } from "@/content/initiatives";
import { cn } from "@/lib/utils";

export default function MomentsPage() {
  return (
    <>
      <PageHero
        backLink={{ label: "Back to initiatives", href: "/initiatives" }}
        title={
          <>
            Moments from <Accent>our initiatives</Accent>
          </>
        }
        subtitle="Highlights from the 3rd Annual NJ Regional High School Ethics Bowl at Princeton and our broader ethics programming."
      />

      <section className="border-b border-border py-32 animate-fade-in-up">
        <div className="container">
          <SectionHeading
            eyebrow="3rd Annual NJ Regional High School Ethics Bowl"
            title="Photo gallery"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:auto-rows-[16rem]">
            {ethicsBowlGallery.map((image, index) => (
              <div
                key={image.src}
                className={cn(
                  "group relative min-h-64 overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl lg:min-h-0",
                  image.span,
                  `stagger-${Math.min(index + 3, 8)}`
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Want to be part of the next one?"
        actions={[{ label: "Return to all initiatives", href: "/initiatives" }]}
      />
    </>
  );
}
