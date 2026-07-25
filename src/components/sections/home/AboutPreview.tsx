import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

/** Dark "About Us" band on the home page with a photo and mission summary. */
export default function AboutPreview() {
  return (
    <section className="border-t-4 border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
      <div className="container grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <figure className="relative aspect-[4/5] overflow-hidden rounded-sm border-l-4 border-white/30 bg-muted shadow-lg">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
              alt="Students discussing in a library"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <figcaption className="absolute bottom-8 left-8 right-8 z-20 text-white">
              <p className="font-serif text-xl italic">
                "The aim of the Society is to promote the discussion of ethical issues in a spirit
                of open inquiry."
              </p>
            </figcaption>
          </figure>
        </div>

        <div className="order-1 space-y-8 lg:order-2">
          <div>
            <span className="mb-2 block font-serif text-sm italic text-primary">About Us</span>
            <h2 className="font-serif text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Cultivating <span className="text-primary">Moral Leadership</span>
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-white/80">
            <p>
              Founded in 2023 by Joel Ibabao, the Princeton Undergraduate Society of Ethics serves
              as the university's premier forum for ethical discourse. We believe that the most
              pressing issues of our time are not merely technical or empirical, but fundamental
              questions of value. How should self-driving cars make decisions when harm is
              unavoidable? Should prisons prioritize in-person visitation over phone or video
              calls, even when doing so is more costly or difficult to administer? Do animals
              deserve the same moral consideration as humans when their suffering is at stake?
            </p>
            <p>
              By equipping students with the tools of moral philosophy, we prepare students to
              think, act, and lead with integrity in an increasingly complex and noisy world.
            </p>
            <p>
              Our work draws on the talents of students from diverse majors, including Physics,
              Computer Science, Public Policy, and Molecular Biology. Each member brings not only a
              distinct set of skills, but also experiences that enrich our conversations in
              substantive ways. We strive to forge a community that explores the many frontiers of
              ethics, where every voice has value.
            </p>
          </div>

          <Link to="/about" className="inline-block pt-4">
            <Button className="font-sans">READ OUR FULL HISTORY</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
