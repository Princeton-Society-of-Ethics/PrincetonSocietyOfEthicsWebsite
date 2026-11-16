import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

interface ClosedNoticeProps {
  title: string;
  /** Explanation shown under the title, e.g. when the form reopens and who to contact. */
  children: ReactNode;
}

/** Shown in place of an Ethics Bowl form while it is closed. */
export default function ClosedNotice({ title, children }: ClosedNoticeProps) {
  return (
    <section className="border-t border-border bg-background py-24 animate-fade-in-up">
      <div className="container max-w-2xl text-center">
        <span className="mb-4 block font-serif text-sm italic text-primary">
          Thank you for your interest
        </span>
        <h2 className="mb-6 font-serif text-4xl font-bold text-foreground md:text-5xl">{title}</h2>
        <p className="mb-10 leading-relaxed text-muted-foreground">{children}</p>
        <Link to="/initiatives">
          <Button size="lg">Explore Our Initiatives</Button>
        </Link>
      </div>
    </section>
  );
}
