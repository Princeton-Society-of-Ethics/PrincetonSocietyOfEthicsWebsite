import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Accent } from "@/components/sections/PageHero";
import { siteConfig, sponsors } from "@/content/site";

/** Sponsors and partners as a quiet typographic list, with an email link to get in touch. */
export default function SponsorsSection() {
  return (
    <section className="border-t-4 border-primary/20 bg-background py-24">
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <div>
          <span className="mb-2 block font-serif text-sm italic text-primary">
            Supporting our mission
          </span>
          <h2 className="font-serif text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            Our <Accent>sponsors</Accent> &amp; partners
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            We are grateful to the organizations that make our work possible.
          </p>
          <p className="mt-8 text-muted-foreground">
            Interested in partnering with us? {/* Opens a new email in the visitor's mail app */}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="group inline-flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80"
            >
              Get in touch
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </a>
          </p>
        </div>

        <ul className="divide-y divide-border border-y border-border lg:self-center">
          {sponsors.map((sponsor) => (
            <li key={sponsor.name}>
              <a
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-6 py-8"
              >
                <span>
                  <span className="block font-serif text-2xl text-foreground transition-colors group-hover:text-primary md:text-3xl">
                    {sponsor.name}
                  </span>
                  <span className="mt-1 block text-muted-foreground">{sponsor.description}</span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
