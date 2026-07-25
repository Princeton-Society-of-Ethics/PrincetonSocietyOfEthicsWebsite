import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/sections/SectionHeading";
import { Accent } from "@/components/sections/PageHero";

/** Placeholder sponsors/partners band inviting collaboration inquiries. */
export default function SponsorsSection() {
  return (
    <section className="border-t-4 border-primary/20 bg-background py-24">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Supporting our mission"
          title={
            <>
              Our <Accent>sponsors</Accent> &amp; partners
            </>
          }
          description="We are grateful to the organizations that help us host discussions, publish student work, and grow our community. Details about our current supporters will appear here soon."
          className="mb-12"
        />

        <div className="mx-auto max-w-2xl rounded-sm border border-primary/20 bg-primary/5 p-10 text-center md:p-12">
          <p className="mb-8 font-light leading-relaxed text-foreground/80">
            Interested in partnering with the Princeton Undergraduate Society of Ethics? We would
            love to hear from you about collaborations, sponsorship, and shared programming.
          </p>
          <Link to="/join">
            <Button variant="outline" className="text-foreground">
              Get in touch
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
