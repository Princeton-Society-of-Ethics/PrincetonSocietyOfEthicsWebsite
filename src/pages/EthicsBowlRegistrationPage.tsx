import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import PageHero, { Accent } from "@/components/sections/PageHero";
import EventMeta from "@/components/sections/registration/EventMeta";
import SchoolPicker from "@/components/sections/registration/SchoolPicker";
import {
  CheckOption,
  ConfirmationCheck,
  EmailSuggestion,
  FormBackdrop,
  FormField,
  FormStep,
  PreviewBanner,
  ReviewSummary,
  StepProgress,
  fieldGlow,
  type FormStepInfo,
} from "@/components/sections/registration/StepForm";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import {
  ethicsBowlRegistration,
  isRegistrationOpen,
  registrationDeadlineLabel,
} from "@/content/ethicsBowlRegistration";
import { isVolunteerFormOpen } from "@/content/ethicsBowlVolunteer";
import { submitTeamRegistration } from "@/lib/api/ethicsBowl";
import { isPreviewMode } from "@/lib/preview";
import { cn } from "@/lib/utils";
import { emailError, formatPhone, phoneError } from "@/lib/validation";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | {
      kind: "submitted";
      schoolName: string;
      /** False when the coach typed in a school that isn't in the directory. */
      schoolVerified: boolean;
      registrationId: string | null;
    }
  | { kind: "error"; message: string };

const { season, eventName, event, contactEmail, roster, unlistedSchoolEmail } =
  ethicsBowlRegistration;

const STEPS: FormStepInfo[] = [
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
  /** Local-only walkthrough with no validation and no submission (see isPreviewMode). */
  const preview = isPreviewMode();
  /** The step currently shown. */
  const [step, setStep] = useState(0);
  /** False while the welcome screen is showing, before the first step. */
  const [started, setStarted] = useState(false);
  /** The furthest step reached; steps beyond it can't be opened yet. */
  const [unlocked, setUnlocked] = useState(preview ? LAST_STEP : 0);
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
    const invalid = preview ? undefined : firstInvalidField(index);
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

    // Preview: jump straight to the confirmation screen; nothing is sent. Uses
    // whatever school was entered, so the "not listed" version can be previewed.
    if (preview) {
      const data = new FormData(event.currentTarget);
      setStatus({
        kind: "submitted",
        schoolName: String(data.get("schoolName") ?? "").trim() || "Preview High School",
        schoolVerified: data.get("schoolVerified") !== "No",
        registrationId: "NJHSEB-27-0000",
      });
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        schoolVerified: field("schoolVerified") === "Yes",
        registrationId: result.registrationId,
      });
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      setStatus({ kind: "error", message: result.reason });
    }
  }

  const stepProps = (index: number) => ({
    steps: STEPS,
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
      {started && status.kind !== "submitted" && <FormBackdrop id="registration-grid" />}
      <div className="container relative max-w-2xl">
        {status.kind === "submitted" ? (
          <Confirmation
            schoolName={status.schoolName}
            schoolVerified={status.schoolVerified}
            registrationId={status.registrationId}
          />
        ) : (
          <>
            {!started && <Intro onStart={start} />}

            {/* Hidden rather than unmounted on the intro, so typed answers are kept */}
            <div className={started ? undefined : "hidden"}>
              {preview && <PreviewBanner />}
              <StepProgress
                steps={STEPS}
                step={step}
                unlocked={unlocked}
                onSelect={goTo}
                label="Registration progress"
              />

              <form ref={formRef} noValidate onSubmit={handleSubmit} onChange={handleFormChange}>
                <FormStep {...stepProps(0)}>
                  <SchoolPicker onChange={handleFormChange} inputClassName={fieldGlow} />
                  <FormField
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
                  </FormField>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <FormField
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
                    </FormField>
                    <FormField id="coachEmail" label="Coach's email" error={fieldErrors.coachEmail}>
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
                    </FormField>
                  </div>
                </FormStep>

                <FormStep {...stepProps(1)}>
                  <FormField
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
                  </FormField>
                  <FormField
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
                  </FormField>
                  <FormField
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
                  </FormField>
                </FormStep>

                <FormStep {...stepProps(2)}>
                  <FormField
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
                  </FormField>
                </FormStep>

                <FormStep {...stepProps(3)}>
                  <Review values={values} onEdit={goTo} />

                  <CheckOption id="confirmed" name="confirmed" required>
                    I confirm that my team will participate in the {season} {eventName}.
                  </CheckOption>

                  <Signature
                    name={values.confirmed === "on" ? (values.coachName ?? "").trim() : ""}
                  />

                  {status.kind === "error" && (
                    <p className="text-sm text-red-700" role="alert">
                      {status.message}
                    </p>
                  )}
                </FormStep>

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

      <EventMeta className="mt-8" />

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

      {isVolunteerFormOpen() && (
        <p className="mt-10 text-sm text-muted-foreground">
          Not a coach?{" "}
          <Link to="/volunteer" className="font-medium text-primary hover:underline">
            Volunteer as a judge, moderator, or assistant
          </Link>
          .
        </p>
      )}
    </div>
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

  return <ReviewSummary steps={STEPS} groups={groups} onEdit={onEdit} />;
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
  schoolVerified,
  registrationId,
}: {
  schoolName: string;
  schoolVerified: boolean;
  registrationId: string | null;
}) {
  return (
    <div className="py-8 text-center animate-fade-in-up">
      <ConfirmationCheck />
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
      {!schoolVerified && (
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Since your school isn't in our New Jersey school list, please also email{" "}
          <a
            href={`mailto:${unlistedSchoolEmail}?subject=${encodeURIComponent("Ethics Bowl registration: school not listed")}`}
            className="font-medium text-primary hover:underline"
          >
            {unlistedSchoolEmail}
          </a>{" "}
          so the organizers can confirm it, if you haven't already.
        </p>
      )}
      {registrationId && (
        <p className="mt-6 text-sm text-muted-foreground">
          Your registration number is{" "}
          <span className="font-semibold tracking-wide tabular-nums text-foreground">
            {registrationId}
          </span>
          . Keep it for your records.
        </p>
      )}
      <Link to="/initiatives" className="mt-10 inline-block">
        <Button size="lg" className="group px-10">
          Explore Our Initiatives
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </Button>
      </Link>
    </div>
  );
}
