import { useState, type FormEvent } from "react";
import CtaBanner from "@/components/sections/CtaBanner";
import PageHero, { Accent } from "@/components/sections/PageHero";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { faqs, joinSteps } from "@/content/join";
import { submitJoinInquiry } from "@/lib/api/membership";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "submitted" }
  | { kind: "error"; message: string };

export default function JoinPage() {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setStatus({ kind: "submitting" });
    const result = await submitJoinInquiry({
      email: String(data.get("email") ?? ""),
    });

    setStatus(result.ok ? { kind: "submitted" } : { kind: "error", message: result.reason });
  }

  return (
    <>
      <PageHero
        title={
          <>
            Join <Accent>Us</Accent>
          </>
        }
        subtitle="Become part of a community dedicated to ethical inquiry, moral leadership, and meaningful dialogue."
      />

      {/* How to join */}
      <section className="border-t border-border bg-gradient-to-b from-secondary/20 to-background py-24 animate-fade-in-up">
        <div className="container max-w-3xl">
          <div className="mb-16 text-center stagger-1">
            <span className="mb-4 block font-serif text-sm italic text-primary">
              Getting Started
            </span>
            <h2 className="font-serif text-5xl font-bold text-foreground">How to Join</h2>
          </div>

          <ol className="space-y-8">
            {joinSteps.map((step, index) => {
              const isLast = index === joinSteps.length - 1;
              return (
                <li key={step.title} className={`relative flex gap-6 stagger-${index + 2}`}>
                  {!isLast && (
                    <div className="absolute bottom-0 left-6 top-12 w-1 bg-gradient-to-b from-primary to-primary/30" />
                  )}
                  <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-serif text-lg font-bold text-primary-foreground shadow-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="mb-2 font-serif text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Inquiry form */}
      <section className="border-t border-border bg-background py-24 animate-fade-in-up">
        <div className="container max-w-2xl">
          <div className="mb-12 text-center">
            <span className="mb-4 block font-serif text-sm italic text-primary">Get in Touch</span>
            <h2 className="font-serif text-5xl font-bold text-foreground">Join Inquiry Form</h2>
            <p className="mt-4 text-muted-foreground">
              Leave your email and we'll get back to you shortly.
            </p>
          </div>

          {status.kind === "submitted" ? (
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 px-6 py-16 text-center">
              <p className="mb-2 font-serif text-xl font-bold text-foreground">
                Thank you for your interest!
              </p>
              <p className="text-muted-foreground">
                We've received your inquiry and will be in touch soon. In the meantime, feel free to
                attend one of our upcoming events.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required />
              </div>

              {status.kind === "error" && (
                <p className="text-sm text-primary" role="alert">
                  {status.message}
                </p>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={status.kind === "submitting"}
                  className="w-full px-12 sm:w-auto"
                >
                  {status.kind === "submitting" ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-24 animate-fade-in-up">
        <div className="container max-w-3xl">
          <h2 className="mb-12 font-serif text-4xl font-bold text-foreground stagger-1">
            Frequently Asked Questions
          </h2>

          <dl className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className={`border-b border-border pb-8 last:border-b-0 stagger-${Math.min(index + 2, 8)}`}
              >
                <dt className="mb-3 font-serif text-lg font-bold text-foreground">
                  {faq.question}
                </dt>
                <dd className="leading-relaxed text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBanner
        title="Ready to Join?"
        description="Reach out to us with any questions or to learn more about membership. We're always excited to welcome new members to our community."
        actions={[{ label: "View Initiatives", href: "/initiatives" }]}
      />
    </>
  );
}
