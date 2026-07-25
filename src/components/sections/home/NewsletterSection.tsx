import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { subscribeToNewsletter } from "@/lib/api/membership";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "done"; message: string };

/** Newsletter signup card on the orange band at the bottom of the home page. */
export default function NewsletterSection() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus({ kind: "submitting" });
    const result = await subscribeToNewsletter({
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      email: String(data.get("email") ?? ""),
    });

    if (result.ok) form.reset();
    setStatus({
      kind: "done",
      message: result.ok ? "Thanks for subscribing — see you in your inbox!" : result.reason,
    });
  }

  return (
    <section className="relative overflow-hidden border-t-4 border-primary bg-primary py-24 text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -left-[10%] -top-[50%] h-[200%] w-[50%] origin-center rotate-12 bg-white" />
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl rounded-sm border-l-4 border-primary bg-background p-8 text-foreground shadow-2xl md:p-12">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 font-serif text-3xl font-bold">
                Join the <span className="text-primary">Conversation</span>
              </h2>
              <p className="mb-6 text-muted-foreground">
                Subscribe to our newsletter to receive updates on upcoming events, recent Telos
                publications, and opportunities for fellowship.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Weekly updates during term time</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    First Name
                  </Label>
                  <Input id="firstName" name="firstName" placeholder="Immanuel" />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Last Name
                  </Label>
                  <Input id="lastName" name="lastName" placeholder="Kant" />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="ikant@princeton.edu"
                />
              </div>

              <Button
                type="submit"
                disabled={status.kind === "submitting"}
                className="mt-2 w-full font-sans"
              >
                {status.kind === "submitting" ? "SUBSCRIBING..." : "SUBSCRIBE"}
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground" role="status">
                {status.kind === "done"
                  ? status.message
                  : "We respect your privacy. Unsubscribe at any time."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
