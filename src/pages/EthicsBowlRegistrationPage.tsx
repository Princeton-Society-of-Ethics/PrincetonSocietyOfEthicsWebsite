import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, MapPin } from "lucide-react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import PageHero, { Accent } from "@/components/sections/PageHero";
import SchoolPicker from "@/components/sections/registration/SchoolPicker";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import {
  ethicsBowlRegistration,
  isRegistrationOpen,
  registrationDeadlineLabel,
} from "@/content/ethicsBowlRegistration";
import { submitTeamRegistration } from "@/lib/api/ethicsBowl";
import { cn } from "@/lib/utils";
import { emailError, emailSuggestion, formatPhone, phoneError } from "@/lib/validation";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "submitted"; schoolName: string; registrationId: string | null }
  | { kind: "error"; message: string };

const { season, eventName, event, contactEmail, roster } = ethicsBowlRegistration;

const STEPS = [
  {
    label: "School & Coach",
    title: "School and coach",
    description: "Tell us about your school and the coach responsible for your team.",
  },
  {
    label: "Team",
    title: "Your team",
    description: "Who's competing, and who's coming along.",
  },
  {
    label: "Additional Teams",
    title: "Additional teams",
    description:
      "Additional teams may participate only if enough volunteers are available and the organizers approve them. Once the event begins, students may not switch between team rosters.",
  },
  {
    label: "Review",
    title: "Review and confirm",
    description: "Check your answers, then confirm your team's commitment to participate.",
  },
];
const LAST_STEP = STEPS.length - 1;

/** Soft orange halo on focus, added to every input and textarea. */
const fieldGlow = "transition-shadow focus:ring-4 focus:ring-primary/20";

/** Number of non-blank lines, i.e. students listed in the roster box. */
function countRosterLines(text: string): number {
  return text.split("\n").filter((line) => line.trim() !== "").length;
}

export default function EthicsBowlRegistrationPage() {
  const isOpen = isRegistrationOpen();
  const deadline = registrationDeadlineLabel();

  return (
    <>
      <PageHero
        title={
          <>
            Ethics Bowl <Accent>Registration</Accent>
          </>
        }
        subtitle={
          isOpen
            ? `Register your school's team for the ${season} ${eventName}, hosted by the Princeton Undergraduate Society of Ethics.${deadline ? ` Registration closes ${deadline}.` : ""}`
            : `Registration for the ${season} ${eventName} is closed.`
        }
      />

      {isOpen ? <RegistrationForm /> : <ClosedNotice />}
    </>
  );
}

function ClosedNotice() {
  return (
    <section className="border-t border-border bg-background py-24 animate-fade-in-up">
      <div className="container max-w-2xl text-center">
        <span className="mb-4 block font-serif text-sm italic text-primary">
          Thank you for your interest
        </span>
        <h2 className="mb-6 font-serif text-4xl font-bold text-foreground md:text-5xl">
          Registration Is Closed
        </h2>
        <p className="mb-10 leading-relaxed text-muted-foreground">
          Team registration for this season has ended. Registration for next year's {eventName} will
          open here in the fall.
          {contactEmail && (
            <>
              {" "}
              Questions? Email us at{" "}
              <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                {contactEmail}
              </a>
              .
            </>
          )}
        </p>
        <Link to="/initiatives">
          <Button size="lg">Explore Our Initiatives</Button>
        </Link>
      </div>
    </section>
  );
}

function RegistrationForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  /** The step currently shown. */
  const [step, setStep] = useState(0);
  /** False while the welcome screen is showing, before the first step. */
  const [started, setStarted] = useState(false);
  /** The furthest step reached; steps beyond it can't be opened yet. */
  const [unlocked, setUnlocked] = useState(0);
  /** Snapshot of every answer, for the roster count and the review step. */
  const [values, setValues] = useState<Record<string, string>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([]);

  function handleRosterChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const count = countRosterLines(event.target.value);
    event.target.setCustomValidity(
      count === 0 || (count >= roster.min && count <= roster.max)
        ? ""
        : `Teams must register ${roster.min} to ${roster.max} students, one per line. You've listed ${count}.`
    );
  }

  function handleFormChange() {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    setValues(Object.fromEntries(Array.from(data, ([key, value]) => [key, String(value)])));
  }

  /** The first field in a step that isn't filled in correctly, if any. */
  function firstInvalidField(index: number): HTMLInputElement | undefined {
    const fieldset = stepRefs.current[index];
    if (!fieldset) return undefined;
    return Array.from(fieldset.elements).find(
      (el): el is HTMLInputElement => "validity" in el && !(el as HTMLInputElement).validity.valid
    );
  }

  /** Show a step, scroll back to the top of the form, and focus its first field. */
  function goTo(index: number) {
    flushSync(() => setStep(index));
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    stepRefs.current[index]
      ?.querySelector<HTMLElement>("input:not([type=checkbox]), textarea")
      ?.focus({ preventScroll: true });
  }

  /** When "Start Registration" was first clicked; sent with the submission. */
  const startedAtRef = useRef<Date | null>(null);

  function start() {
    startedAtRef.current ??= new Date();
    flushSync(() => setStarted(true));
    goTo(0);
  }

  function backToIntro() {
    setStarted(false);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /** Inline messages under phone and email, shown once a field has been left or checked. */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function showFieldError(el: HTMLInputElement) {
    setFieldErrors((prev) => ({
      ...prev,
      [el.name]: el.validity.valid ? "" : el.validationMessage,
    }));
  }

  /** Apply a custom format check as the person types; refresh a visible message as they fix it. */
  function handleFormatInput(el: HTMLInputElement, check: (value: string) => string) {
    el.setCustomValidity(check(el.value));
    if (fieldErrors[el.name]) showFieldError(el);
  }

  function continueFrom(index: number) {
    const invalid = firstInvalidField(index);
    if (invalid) {
      // Surface inline messages for every bad contact field in this step, then point at the first.
      stepRefs.current[index]
        ?.querySelectorAll<HTMLInputElement>("input[name=coachPhone], input[name=coachEmail]")
        .forEach((el) => !el.validity.valid && showFieldError(el));
      invalid.reportValidity();
      return;
    }
    setUnlocked((furthest) => Math.max(furthest, index + 1));
    goTo(index + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Pressing Enter on an earlier step means "Continue", not "Submit".
    if (step < LAST_STEP) {
      continueFrom(step);
      return;
    }

    // An earlier step may have been edited since it was completed.
    const invalidStep = STEPS.findIndex((_, index) => firstInvalidField(index));
    if (invalidStep !== -1) {
      flushSync(() => setStep(invalidStep));
      firstInvalidField(invalidStep)?.reportValidity();
      return;
    }

    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();

    setStatus({ kind: "submitting" });
    const result = await submitTeamRegistration({
      schoolName: field("schoolName"),
      schoolCity: field("schoolCity"),
      schoolVerified: field("schoolVerified") === "Yes",
      coachName: field("coachName"),
      coachPhone: field("coachPhone"),
      coachEmail: field("coachEmail"),
      roster: field("roster"),
      dietaryRestrictions: field("dietaryRestrictions"),
      additionalGuests: field("additionalGuests"),
      additionalTeams: field("additionalTeams"),
      confirmed: data.get("confirmed") === "on",
      website: field("website"),
      startedAt: startedAtRef.current,
    });

    if (result.ok) {
      setStatus({
        kind: "submitted",
        schoolName: field("schoolName"),
        registrationId: result.registrationId,
      });
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setStatus({ kind: "error", message: result.reason });
    }
  }

  const stepProps = (index: number) => ({
    index,
    isActive: step === index,
    fieldsetRef: (el: HTMLFieldSetElement | null) => {
      stepRefs.current[index] = el;
    },
  });

  const rosterCount = countRosterLines(values.roster ?? "");
  const rosterIsValid = rosterCount >= roster.min && rosterCount <= roster.max;

  return (
    <section
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-background py-20 animate-fade-in-up md:py-24"
    >
      {started && status.kind !== "submitted" && <RegistrationBackdrop />}
      <div className="container relative max-w-2xl">
        {status.kind === "submitted" ? (
          <Confirmation schoolName={status.schoolName} registrationId={status.registrationId} />
        ) : (
          <>
            {!started && <Intro onStart={start} />}

            {/* Hidden rather than unmounted on the intro, so typed answers are kept */}
            <div className={started ? undefined : "hidden"}>
              <Progress step={step} unlocked={unlocked} onSelect={goTo} />

              <form ref={formRef} noValidate onSubmit={handleSubmit} onChange={handleFormChange}>
                <Step {...stepProps(0)}>
                  <SchoolPicker onChange={handleFormChange} inputClassName={fieldGlow} />
                  <Field
                    id="coachName"
                    label="Coach"
                    hint="The coach responsible for your team, who must be present throughout the event."
                  >
                    <Input
                      id="coachName"
                      name="coachName"
                      autoComplete="name"
                      placeholder="Full name"
                      aria-describedby="coachName-hint"
                      className={cn("h-12", fieldGlow)}
                      required
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <Field
                      id="coachPhone"
                      label="Coach's cell phone"
                      error={fieldErrors.coachPhone}
                    >
                      <Input
                        id="coachPhone"
                        name="coachPhone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(609) 555-0123"
                        onInput={(event) => handleFormatInput(event.currentTarget, phoneError)}
                        onBlur={(event) => {
                          const el = event.currentTarget;
                          el.value = formatPhone(el.value);
                          handleFormChange();
                          if (el.value) showFieldError(el);
                        }}
                        aria-invalid={fieldErrors.coachPhone ? true : undefined}
                        aria-describedby={fieldErrors.coachPhone ? "coachPhone-error" : undefined}
                        className={cn("h-12", fieldGlow)}
                        required
                      />
                    </Field>
                    <Field id="coachEmail" label="Coach's email" error={fieldErrors.coachEmail}>
                      <Input
                        id="coachEmail"
                        name="coachEmail"
                        type="email"
                        autoComplete="email"
                        placeholder="coach@school.org"
                        onInput={(event) => handleFormatInput(event.currentTarget, emailError)}
                        onBlur={(event) => {
                          const el = event.currentTarget;
                          el.value = el.value.trim();
                          if (el.value) showFieldError(el);
                        }}
                        aria-invalid={fieldErrors.coachEmail ? true : undefined}
                        aria-describedby={fieldErrors.coachEmail ? "coachEmail-error" : undefined}
                        className={cn("h-12", fieldGlow)}
                        required
                      />
                      <EmailSuggestion
                        value={values.coachEmail ?? ""}
                        onAccept={(suggestion) => {
                          const el = formRef.current?.elements.namedItem("coachEmail");
                          if (!(el instanceof HTMLInputElement)) return;
                          el.value = suggestion;
                          el.setCustomValidity(emailError(suggestion));
                          showFieldError(el);
                          handleFormChange();
                        }}
                      />
                    </Field>
                  </div>
                </Step>

                <Step {...stepProps(1)}>
                  <Field
                    id="roster"
                    label="Team roster"
                    hint={`One student per line, with name and grade level. Register ${roster.min} to ${roster.max} students; no more than ${roster.maxPerMatch} compete in a single match.`}
                  >
                    <Textarea
                      id="roster"
                      name="roster"
                      rows={6}
                      placeholder={"Jane Smith, senior\nJohn Doe, junior\nJim Doe, sophomore"}
                      onChange={handleRosterChange}
                      aria-describedby="roster-hint roster-count"
                      className={fieldGlow}
                      required
                    />
                    <p
                      id="roster-count"
                      aria-live="polite"
                      className={cn(
                        "text-right text-sm tabular-nums",
                        rosterCount > 0 && !rosterIsValid ? "text-red-700" : "text-muted-foreground"
                      )}
                    >
                      {rosterCount} of {roster.max} students
                      {rosterCount > 0 &&
                        rosterCount < roster.min &&
                        ` · at least ${roster.min} needed`}
                    </p>
                  </Field>
                  <Field
                    id="dietaryRestrictions"
                    label="Dietary restrictions or allergies"
                    hint={`For students, coaches, and guests: each person's name and restriction. If none, enter "None."`}
                  >
                    <Textarea
                      id="dietaryRestrictions"
                      name="dietaryRestrictions"
                      rows={3}
                      placeholder="Jane Smith, gluten allergy"
                      aria-describedby="dietaryRestrictions-hint"
                      className={fieldGlow}
                      required
                    />
                  </Field>
                  <Field
                    id="additionalGuests"
                    label="Accompanying guests"
                    hint={`Any additional students, staff, faculty, or other guests: each person's name and role. If none, enter "None."`}
                  >
                    <Textarea
                      id="additionalGuests"
                      name="additionalGuests"
                      rows={3}
                      placeholder="Alex Lee, parent chaperone"
                      aria-describedby="additionalGuests-hint"
                      className={fieldGlow}
                      required
                    />
                  </Field>
                </Step>

                <Step {...stepProps(2)}>
                  <Field
                    id="additionalTeams"
                    label="Additional team rosters"
                    hint={`Label each team and list each student's name and grade level. If none, enter "None."`}
                  >
                    <Textarea
                      id="additionalTeams"
                      name="additionalTeams"
                      rows={6}
                      placeholder={
                        "Team B\nAva Patel, junior\nSam Rivera, sophomore\nLeo Chen, freshman"
                      }
                      aria-describedby="additionalTeams-hint"
                      className={fieldGlow}
                      required
                    />
                  </Field>
                </Step>

                <Step {...stepProps(3)}>
                  <Review values={values} onEdit={goTo} />

                  <label
                    htmlFor="confirmed"
                    className="flex cursor-pointer items-start gap-4 rounded-sm border border-border bg-card p-5 transition-colors hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <input
                      id="confirmed"
                      name="confirmed"
                      type="checkbox"
                      required
                      className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer accent-primary"
                    />
                    <span className="leading-relaxed text-foreground">
                      I confirm that my team will participate in the {season} {eventName}.
                    </span>
                  </label>

                  <Signature
                    name={values.confirmed === "on" ? (values.coachName ?? "").trim() : ""}
                  />

                  {status.kind === "error" && (
                    <p className="text-sm text-red-700" role="alert">
                      {status.message}
                    </p>
                  )}
                </Step>

                {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
                <div className="absolute -left-[9999px]" aria-hidden>
                  <label htmlFor="website">Leave this field empty</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mt-12 flex items-center justify-between gap-4 border-t border-border pt-8">
                  {started ? (
                    <button
                      type="button"
                      onClick={() => (step > 0 ? goTo(step - 1) : backToIntro())}
                      className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                  {/* Distinct keys stop React reusing one <button> for both: a click on
                    Continue would otherwise finish as a click on Submit. */}
                  {step < LAST_STEP ? (
                    <Button
                      key="continue"
                      type="button"
                      onClick={() => continueFrom(step)}
                      className="group px-8"
                    >
                      Continue
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </Button>
                  ) : (
                    <Button
                      key="submit"
                      type="submit"
                      disabled={status.kind === "submitting"}
                      className="px-8"
                    >
                      {status.kind === "submitting" ? "Submitting..." : "Submit Registration"}
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {contactEmail && (
              <p className="mt-12 text-center text-sm text-muted-foreground">
                Questions?{" "}
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                  {contactEmail}
                </a>
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/** Welcome screen: what the event is and what to have ready before starting. */
function Intro({ onStart }: { onStart: () => void }) {
  // "Saturday, February 6, 2027" → "February 6, 2027" with "Saturday" underneath
  const [weekday, calendarDate] = event.date.includes(",")
    ? [
        event.date.slice(0, event.date.indexOf(",")),
        event.date.slice(event.date.indexOf(",") + 1).trim(),
      ]
    : ["", event.date];
  const facts = [
    { value: `${roster.min}–${roster.max}`, label: "Students per team" },
    { value: String(roster.maxPerMatch), label: "Compete per match" },
    { value: "1", label: "Coach on site" },
  ];
  const checklist = [
    "Your school's full name, plus the coach's name, cell phone, and email",
    "Your team roster, with each student's name and grade level",
    "Dietary restrictions or allergies for everyone attending",
    "Names and roles of any guests coming with your team",
    "Rosters for any additional teams, if you'd like to register more than one",
  ];

  return (
    <div className="animate-fade-in-up">
      <span className="mb-3 block font-serif text-sm italic text-primary">Before you begin</span>
      <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
        About the Ethics Bowl
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        The {eventName} is a team-based academic competition in which students analyze and discuss
        complex moral questions about real-world issues. Rather than debating to win points, teams
        are judged on careful reasoning, respect for other perspectives, and thoughtful dialogue.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <EventDetail icon={CalendarDays} primary={calendarDate}>
          {[weekday, event.dateIsTentative && "Tentative date"].filter(Boolean).join(" · ")}
        </EventDetail>
        <EventDetail icon={MapPin} primary={event.venue}>
          {event.place}
        </EventDetail>
      </div>

      <dl className="mt-12 grid grid-cols-3 divide-x divide-border border-y border-border">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col-reverse px-3 py-6 text-center sm:px-6">
            <dt className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {fact.label}
            </dt>
            <dd className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-12 font-serif text-2xl font-bold text-foreground">What you'll need</h3>
      <ul className="mt-6 space-y-4">
        {checklist.map((item) => (
          <li key={item} className="flex gap-4">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
            </span>
            <span className="leading-relaxed text-foreground">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col-reverse items-start gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" aria-hidden />
          Takes about 5 minutes
        </p>
        <Button size="lg" onClick={onStart} className="group w-full px-10 sm:w-auto">
          Start Registration
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </Button>
      </div>
    </div>
  );
}

function EventDetail({
  icon: Icon,
  primary,
  children,
}: {
  icon: typeof MapPin;
  primary: string;
  children: ReactNode;
}) {
  return (
    <p className="flex items-center gap-4 rounded-sm border border-border bg-card px-5 py-4">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" aria-hidden />
      </span>
      <span>
        <span className="block font-medium text-foreground">{primary}</span>
        <span className="block text-sm text-muted-foreground">{children}</span>
      </span>
    </p>
  );
}

/**
 * Decorative layer behind the form: the home hero's faint grid, fading out
 * down the page.
 */
function RegistrationBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg className="absolute inset-0 h-full w-full text-foreground/[0.09] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_0%,black_30%,transparent)]">
        <defs>
          <pattern id="registration-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#registration-grid)" />
      </svg>
    </div>
  );
}

interface ProgressProps {
  step: number;
  unlocked: number;
  onSelect: (index: number) => void;
}

/** Segmented progress bar; steps already reached can be revisited. */
function Progress({ step, unlocked, onSelect }: ProgressProps) {
  return (
    <nav aria-label="Registration progress" className="mb-16">
      <ol className="grid grid-cols-4 gap-2 sm:gap-3">
        {STEPS.map((item, index) => {
          const isCurrent = index === step;
          const isReached = index <= unlocked;
          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={!isReached || isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                className="group w-full text-left disabled:cursor-default enabled:cursor-pointer"
              >
                <span className="block h-1 overflow-hidden rounded-full bg-border">
                  <span
                    className={cn(
                      "block h-full rounded-full bg-primary transition-[width] duration-700 ease-out",
                      isReached ? "w-full" : "w-0"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "mt-3 hidden text-xs font-medium uppercase tracking-wider transition-colors sm:block",
                    isCurrent && "text-foreground",
                    !isCurrent && isReached && "text-muted-foreground group-hover:text-primary",
                    !isReached && "text-muted-foreground/50"
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface StepProps {
  index: number;
  isActive: boolean;
  fieldsetRef: (el: HTMLFieldSetElement | null) => void;
  children: ReactNode;
}

/** One step of the form. Inactive steps stay mounted (hidden) so answers are kept. */
function Step({ index, isActive, fieldsetRef, children }: StepProps) {
  const { title, description } = STEPS[index];
  return (
    <fieldset
      ref={fieldsetRef}
      aria-labelledby={`step-${index}-title`}
      className={isActive ? "animate-fade-in-up" : "hidden"}
    >
      <span className="mb-3 block font-serif text-sm italic text-primary">
        Step {index + 1} of {STEPS.length}
      </span>
      <h2
        id={`step-${index}-title`}
        className="font-serif text-4xl font-bold text-foreground md:text-5xl"
      >
        {title}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-12 space-y-8">{children}</div>
    </fieldset>
  );
}

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  /** Inline validation message shown under the field. */
  error?: string;
  children: ReactNode;
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** "Did you mean …?" for common email domain typos, e.g. gmial.com. */
function EmailSuggestion({
  value,
  onAccept,
}: {
  value: string;
  onAccept: (suggestion: string) => void;
}) {
  const suggestion = emailSuggestion(value);
  if (!suggestion) return null;
  return (
    <p className="text-sm text-muted-foreground">
      Did you mean{" "}
      <button
        type="button"
        onClick={() => onAccept(suggestion)}
        className="cursor-pointer font-medium text-primary hover:underline"
      >
        {suggestion}
      </button>
      ?
    </p>
  );
}

/** Read-only recap of every answer, grouped by step, each with an Edit link. */
function Review({
  values,
  onEdit,
}: {
  values: Record<string, string>;
  onEdit: (index: number) => void;
}) {
  const get = (name: string) => values[name]?.trim() ?? "";
  const groups: { step: number; rows: [string, ReactNode][] }[] = [
    {
      step: 0,
      rows: [
        [
          "School",
          [
            [get("schoolName"), get("schoolCity") && `${get("schoolCity")}, NJ`]
              .filter(Boolean)
              .join(" · "),
            get("schoolVerified") === "No" &&
              "Not in the state directory. The organizers will confirm it with you.",
          ]
            .filter(Boolean)
            .join("\n"),
        ],
        ["Coach", [get("coachName"), get("coachPhone"), get("coachEmail")].join("\n")],
      ],
    },
    {
      step: 1,
      rows: [
        [`Roster (${countRosterLines(get("roster"))})`, <RosterTags text={get("roster")} />],
        ["Dietary needs", get("dietaryRestrictions")],
        ["Guests", get("additionalGuests")],
      ],
    },
    { step: 2, rows: [["Additional teams", get("additionalTeams")]] },
  ];

  return (
    <div className="divide-y divide-border border-y border-border">
      {groups.map((group) => (
        <div key={group.step} className="py-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">
              {STEPS[group.step].label}
            </h3>
            <button
              type="button"
              onClick={() => onEdit(group.step)}
              className="cursor-pointer text-sm font-medium text-primary hover:underline"
            >
              Edit
            </button>
          </div>
          <dl className="space-y-3">
            {group.rows.map(([term, detail]) => (
              <div key={term} className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-sm text-muted-foreground">{term}</dt>
                <dd className="min-w-0 whitespace-pre-line break-words text-sm text-foreground">
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/** "Jane Smith, senior" lines rendered as small name tags with the grade beside each name. */
function RosterTags({ text }: { text: string }) {
  const students = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const comma = line.lastIndexOf(",");
      return comma === -1
        ? { name: line, grade: "" }
        : { name: line.slice(0, comma).trim(), grade: line.slice(comma + 1).trim() };
    });

  return (
    <ul className="flex flex-wrap gap-2 whitespace-normal">
      {students.map((student, index) => (
        <li
          key={index}
          className="inline-flex items-baseline gap-1.5 rounded-full border border-border bg-card px-3 py-1"
        >
          {student.name}
          {student.grade && <span className="text-xs text-muted-foreground">{student.grade}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Signature line that fills in with the coach's name once the box is checked. */
function Signature({ name }: { name: string }) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-8 pt-2" aria-hidden>
      <div>
        <p className="h-12 truncate border-b border-foreground/25 font-serif text-3xl italic leading-[3rem] text-foreground">
          {name && (
            <span key={name} className="inline-block animate-fade-in">
              {name}
            </span>
          )}
        </p>
        <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Coach</p>
      </div>
      <div>
        <p className="h-12 border-b border-foreground/25 text-sm leading-[3rem] text-foreground">
          {name && <span className="animate-fade-in">{today}</span>}
        </p>
        <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Date</p>
      </div>
    </div>
  );
}

function Confirmation({
  schoolName,
  registrationId,
}: {
  schoolName: string;
  registrationId: string | null;
}) {
  return (
    <div className="py-8 text-center animate-fade-in-up">
      <div className="intro-logo-in mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
        <svg viewBox="0 0 24 24" className="h-9 w-9 text-primary" aria-hidden>
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw"
          />
        </svg>
      </div>
      <span className="mb-3 block font-serif text-sm italic text-primary">You're registered</span>
      <h2 className="mb-6 font-serif text-4xl font-bold text-foreground md:text-5xl">
        Thank you{schoolName && `, ${schoolName}`}
      </h2>
      <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
        Your team is registered for the {season} {eventName},{" "}
        {event.dateIsTentative && "tentatively "}
        on {event.date} at {event.venue}, {event.place}. The organizers will follow up with your
        coach by email with event details.
      </p>
      {registrationId && (
        <p className="mx-auto mt-8 inline-flex flex-col items-center rounded-sm border border-border bg-card px-6 py-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Registration number
          </span>
          <span className="mt-1 text-xl font-semibold tracking-wide tabular-nums text-foreground">
            {registrationId}
          </span>
        </p>
      )}
      <div className="mt-10" />
      <Link to="/initiatives">
        <Button variant="outline" className="text-foreground">
          Explore Our Initiatives
        </Button>
      </Link>
    </div>
  );
}
