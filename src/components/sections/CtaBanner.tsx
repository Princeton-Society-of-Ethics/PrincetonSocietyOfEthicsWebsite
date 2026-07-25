import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";

interface CtaAction {
  label: string;
  href: string;
}

interface CtaBannerProps {
  title: string;
  description?: string;
  actions: CtaAction[];
  /** Extra content rendered below the actions. */
  children?: ReactNode;
}

/** Full-width orange call-to-action band used at the bottom of most pages. */
export default function CtaBanner({ title, description, actions, children }: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden border-t-4 border-primary bg-primary py-24 text-primary-foreground animate-fade-in-up">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -left-[10%] -top-[50%] h-[200%] w-[50%] origin-center rotate-12 bg-white" />
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-serif text-4xl font-bold md:text-5xl stagger-1">{title}</h2>
          {description && (
            <p className="mb-8 text-lg leading-relaxed text-primary-foreground/90 stagger-2">
              {description}
            </p>
          )}
          <div className="flex flex-col justify-center gap-4 sm:flex-row stagger-3">
            {actions.map((action) => (
              <Link key={action.href + action.label} to={action.href}>
                <Button variant="inverted" size="lg">
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
