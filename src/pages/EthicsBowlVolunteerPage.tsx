import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, ExternalLink } from "lucide-react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import PageHero, { Accent } from "@/components/sections/PageHero";
import EventMeta from "@/components/sections/registration/EventMeta";
import {
  EmailSuggestion,
  CheckOption,
  ConfirmationCheck,
  FormBackdrop,
  FormField,
  FormStep,
  PreviewBanner,
  RadioGroup,
  ReviewSummary,
  StepProgress,
  fieldGlow,
  type FormStepInfo,
} from "@/components/sections/registration/StepForm";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { ethicsBowlRegistration, isRegistrationOpen } from "@/content/ethicsBowlRegistration";
import {
  ethicsBowlVolunteer,
  eventYear,
  heardFromOptions,
  isVolunteerFormOpen,
  volunteerRoles,
} from "@/content/ethicsBowlVolunteer";
import { submitVolunteerRegistration } from "@/lib/api/ethicsBowl";
import { isPreviewMode } from "@/lib/preview";
import { cn } from "@/lib/utils";
import { emailError, formatPhone, phoneError } from "@/lib/validation";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "submitted" }
  | { kind: "error"; message: string };

const { eventName, event } = ethicsBowlRegistration;
const { contactEmail, rulesUrl } = ethicsBowlVolunteer;
const fullEventName = `${eventYear} ${eventName}`;
const ROLES_MESSAGE = "Select at least one role.";

const STEPS: FormStepInfo[] = [
  {
    label: "Roles",
    title: "Volunteer role selection",
    description: "Choose how you'd like to help on the day. Select all that apply.",
  },
  {
    label: "Contact",
    title: "Personal information",
    description: "How our organizing team can reach you before the event.",
  },
  {
    label: "Availability",
    title: "Availability",
    description: `The event runs ${event.time} on ${event.date}. Flexible scheduling is available.`,
  },
  {
    label: "Experience",
    title: "Experience and preferences",
    description: "No prior experience is required. Training will be provided for all roles.",
  },
  {
    label: "Details",
    title: "Additional information",
    description: "Just a couple more questions.",
  },
  {
    label: "Review",
    title: "Review and submit",
    description: "Check your answers, then submit your volunteer registration.",
  },
];
const LAST_STEP = STEPS.length - 1;

export default function EthicsBowlVolunteerPage() {
  const isOpen = isVolunteerFormOpen();
  return (
    <>
      <PageHero
        title={
          <>
            Volunteer <Accent>Registration</Accent>
          </>
        }
        subtitle={
          isOpen
            ? `Serve as a judge, moderator, or assistant at the ${fullEventName}.`
            : `Volunteer sign-up for the ${fullEventName} is closed.`
        }
      />
      {isOpen ? <VolunteerForm /> : <ClosedNotice />}
    </>
  );
}

function ContactLink() {
  return (
    <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
      {contactEmail}
    </a>
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
          Volunteer Sign-up Is Closed
        </h2>
        <p className="mb-10 leading-relaxed text-muted-foreground">
          Questions? Email us at <ContactLink />.
        </p>
        <Link to="/initiatives">
          <Button size="lg">Explore Our Initiatives</Button>
        </Link>
      </div>
    </section>
  );
}

function VolunteerForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  /** Local-only walkthrough with no validation and no submission (see isPreviewMode). */
  const preview = isPreviewMode();
  /** The step currently shown. */
  const [step, setStep] = useState(0);
  /** False while the welcome screen is showing, before the first step. */
  const [started, setStarted] = useState(false);
  /** The furthest step reached; steps beyond it can't be opened yet. */
  const [unlocked, setUnlocked] = useState(preview ? LAST_STEP : 0);
  /** Snapshot of every answer, for the conditional questions and the review step. */
  const [values, setValues] = useState<Record<string, string>>({});
  /** Inline messages under phone and email, shown once a field has been left or checked. */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  /** When "Start" was first clicked; sent with the submission. */
  const startedAtRef = useRef<Date | null>(null);

  function handleFormChange() {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const snapshot = Object.fromEntries(Array.from(data, ([key, value]) => [key, String(value)]));
    // Several roles can be checked; keep all of them, not just the last.
    snapshot.roles = data.getAll("roles").map(String).join(", ");
    setValues(snapshot);
  }

  /** At least one role checkbox must be ticked; the message sits on the first one. */
  function updateRolesValidity() {
    const boxes = formRef.current?.querySelectorAll<HTMLInputElement>("input[name=roles]");
    if (!boxes?.length) return;
    const anyChecked = Array.from(boxes).some((box) => box.checked);
    boxes[0].setCustomValidity(anyChecked ? "" : ROLES_MESSAGE);
  }

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

  /** The first field in a step that isn't filled in correctly, if any. */
  function firstInvalidField(index: number): HTMLInputElement | undefined {
    if (index === 0) updateRolesValidity();
    const fieldset = stepRefs.current[index];
    if (!fieldset) return undefined;
    return Array.from(fieldset.elements).find(
      (el): el is HTMLInputElement => "validity" in el && !(el as HTMLInputElement).validity.valid
    );
  }

  /** Show a step, scroll back to the top of the form, and focus its first text field. */
  function goTo(index: number) {
    flushSync(() => setStep(index));
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    stepRefs.current[index]
      ?.querySelector<HTMLElement>("input:not([type=checkbox]):not([type=radio]), textarea")
      ?.focus({ preventScroll: true });
  }

  function start() {
    startedAtRef.current ??= new Date();
    flushSync(() => setStarted(true));
    goTo(0);
  }

  function backToIntro() {
    setStarted(false);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function continueFrom(index: number) {
    const invalid = preview ? undefined : firstInvalidField(index);
    if (invalid) {
      // Surface inline messages for every bad contact field in this step, then point at the first.
      stepRefs.current[index]
        ?.querySelectorAll<HTMLInputElement>("input[name=phone], input[name=email]")
        .forEach((el) => !el.validity.valid && showFieldError(el));
      invalid.reportValidity();
      return;
    }
    setUnlocked((furthest) => Math.max(furthest, index + 1));
    goTo(index + 1);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Pressing Enter on an earlier step means "Continue", not "Submit".
    if (step < LAST_STEP) {
      continueFrom(step);
      return;
    }

    // Preview: jump straight to the confirmation screen; nothing is sent.
    if (preview) {
      setStatus({ kind: "submitted" });
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

    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const heard = field("heardFrom");

    setStatus({ kind: "submitting" });
    const result = await submitVolunteerRegistration({
      roles: data.getAll("roles").map(String).join(", "),
      multipleRoles: field("multipleRoles"),
      fullName: field("fullName"),
      email: field("email"),
      phone: field("phone"),
      fullDay: field("fullDay"),
      availableHours: field("fullDay") === "No" ? field("availableHours") : "",
      priorExperience: field("priorExperience"),
      experienceDetails: field("priorExperience") === "Yes" ? field("experienceDetails") : "",
      needs: field("needs"),
      heardFrom: heard === "Other" ? `Other: ${field("heardFromOther")}` : heard,
      comments: field("comments"),
      website: field("website"),
      startedAt: startedAtRef.current,
    });

    if (result.ok) {
      setStatus({ kind: "submitted" });
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

  return (
    <section
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-background py-20 animate-fade-in-up md:py-24"
    >
      {started && status.kind !== "submitted" && <FormBackdrop id="volunteer-grid" />}
      <div className="container relative max-w-2xl">
        {status.kind === "submitted" ? (
          <Confirmation />
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
                label="Volunteer registration progress"
              />

              <form ref={formRef} noValidate onSubmit={handleSubmit} onChange={handleFormChange}>
                <FormStep {...stepProps(0)}>
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium text-foreground">
                      Which role(s) are you interested in volunteering for?
                    </legend>
                    <div className="divide-y divide-border border-y border-border">
                      {volunteerRoles.map((role) => (
                        <div key={role.name} className="py-6">
                          <CheckOption
                            name="roles"
                            value={role.name}
                            onChange={updateRolesValidity}
                            title={role.name}
                            note={role.preferred}
                          >
                            {role.description}
                          </CheckOption>
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  <RadioGroup
                    name="multipleRoles"
                    legend="Would you be willing to serve in more than one role if needed?"
                    options={["Yes", "No"]}
                  />
                </FormStep>

                <FormStep {...stepProps(1)}>
                  <FormField id="fullName" label="Full name">
                    <Input
                      id="fullName"
                      name="fullName"
                      autoComplete="name"
                      placeholder="Full name"
                      className={cn("h-12", fieldGlow)}
                      required
                    />
                  </FormField>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <FormField id="email" label="Email address" error={fieldErrors.email}>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        onInput={(e) => handleFormatInput(e.currentTarget, emailError)}
                        onBlur={(e) => {
                          const el = e.currentTarget;
                          el.value = el.value.trim();
                          if (el.value) showFieldError(el);
                        }}
                        aria-invalid={fieldErrors.email ? true : undefined}
                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                        className={cn("h-12", fieldGlow)}
                        required
                      />
                      <EmailSuggestion
                        value={values.email ?? ""}
                        onAccept={(suggestion) => {
                          const el = formRef.current?.elements.namedItem("email");
                          if (!(el instanceof HTMLInputElement)) return;
                          el.value = suggestion;
                          el.setCustomValidity(emailError(suggestion));
                          showFieldError(el);
                          handleFormChange();
                        }}
                      />
                    </FormField>
                    <FormField id="phone" label="Cell phone number" error={fieldErrors.phone}>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(609) 555-0123"
                        onInput={(e) => handleFormatInput(e.currentTarget, phoneError)}
                        onBlur={(e) => {
                          const el = e.currentTarget;
                          el.value = formatPhone(el.value);
                          handleFormChange();
                          if (el.value) showFieldError(el);
                        }}
                        aria-invalid={fieldErrors.phone ? true : undefined}
                        aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                        className={cn("h-12", fieldGlow)}
                        required
                      />
                    </FormField>
                  </div>
                </FormStep>

                <FormStep {...stepProps(2)}>
                  <RadioGroup
                    name="fullDay"
                    legend={`Are you available for the entire event on ${event.date}, from ${event.time}?`}
                    options={["Yes", "No"]}
                  />
                  {values.fullDay === "No" && (
                    <FormField id="availableHours" label="Please specify your available hours">
                      <Input
                        id="availableHours"
                        name="availableHours"
                        placeholder="9:00 AM to 1:00 PM"
                        className={cn("h-12 animate-fade-in", fieldGlow)}
                        required
                      />
                    </FormField>
                  )}
                </FormStep>

                <FormStep {...stepProps(3)}>
                  <RadioGroup
                    name="priorExperience"
                    legend="Do you have previous experience serving as a judge, moderator, or volunteer at an Ethics Bowl or similar event?"
                    options={["Yes", "No"]}
                  />
                  {values.priorExperience === "Yes" && (
                    <FormField
                      id="experienceDetails"
                      label="Please briefly describe your experience"
                      optional
                    >
                      <Textarea
                        id="experienceDetails"
                        name="experienceDetails"
                        rows={3}
                        className={cn("animate-fade-in", fieldGlow)}
                      />
                    </FormField>
                  )}
                  <FormField
                    id="needs"
                    label="Do you have any role preferences, accessibility accommodations, or other needs we should be aware of?"
                    optional
                  >
                    <Textarea id="needs" name="needs" rows={3} className={fieldGlow} />
                  </FormField>
                </FormStep>

                <FormStep {...stepProps(4)}>
                  <RadioGroup
                    name="heardFrom"
                    legend="How did you hear about this volunteer opportunity?"
                    options={heardFromOptions}
                    labelFor={(option) => (option === "Other" ? "Other (please specify)" : option)}
                  />
                  {values.heardFrom === "Other" && (
                    <FormField id="heardFromOther" label="Please specify">
                      <Input
                        id="heardFromOther"
                        name="heardFromOther"
                        className={cn("h-12 animate-fade-in", fieldGlow)}
                        required
                      />
                    </FormField>
                  )}
                  <FormField
                    id="comments"
                    label="Do you have any additional comments or questions?"
                    optional
                  >
                    <Textarea id="comments" name="comments" rows={3} className={fieldGlow} />
                  </FormField>
                </FormStep>

                <FormStep {...stepProps(5)}>
                  <Review values={values} onEdit={goTo} />

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
                  <button
                    type="button"
                    onClick={() => (step > 0 ? goTo(step - 1) : backToIntro())}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back
                  </button>
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

            <p className="mt-12 text-center text-sm text-muted-foreground">
              Questions? <ContactLink />
            </p>
          </>
        )}
      </div>
    </section>
  );
}

/** Welcome screen: the event, who can volunteer, and what to have ready before starting. */
function Intro({ onStart }: { onStart: () => void }) {
  const facts = [
    { value: String(volunteerRoles.length), label: "Volunteer roles" },
    { value: event.time.replace(/:00| AM| PM/g, "").replace(" to ", "–"), label: "Event hours" },
    { value: "None", label: "Experience needed" },
  ];
  const checklist = [
    "Your full name, email address, and cell phone number",
    "Which roles you'd like to serve in: judge, moderator, or assistant",
    `Your availability on ${event.date}`,
    "Any previous Ethics Bowl or similar experience (optional)",
  ];

  return (
    <div className="animate-fade-in-up">
      <span className="mb-3 block font-serif text-sm italic text-primary">Before you begin</span>
      <h2 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
        Volunteer at the Ethics Bowl
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Thank you for your interest in volunteering for the {fullEventName}! We welcome faculty,
        graduate students, undergraduate students, staff, and community members to serve as judges,
        moderators, or assistants. Volunteers are encouraged to stay for the entire event, but
        flexible scheduling is available.
      </p>

      <EventMeta showTime className="mt-8" />

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

      <h3 className="mt-12 font-serif text-2xl font-bold text-foreground">Role preferences</h3>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        We prefer faculty and graduate students as judges, and undergraduate students, staff, and
        community members as moderators or assistants. Undergraduate students may also serve as
        judges if needed.{" "}
        <strong className="font-semibold text-foreground">Moderators are especially needed.</strong>
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        No prior experience is required. Training will be provided for all roles. For more
        information, please consult the{" "}
        <a
          href={rulesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          National High School Ethics Bowl Rules and Documents
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
        .
      </p>

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
          Takes about 3 minutes
        </p>
        <Button size="lg" onClick={onStart} className="group w-full px-10 sm:w-auto">
          Start Volunteer Registration
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </Button>
      </div>

      {isRegistrationOpen() && (
        <p className="mt-10 text-sm text-muted-foreground">
          Coaching a team?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Register your school's team
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
  const heard = get("heardFrom") === "Other" ? `Other: ${get("heardFromOther")}` : get("heardFrom");
  const groups: { step: number; rows: [string, ReactNode][] }[] = [
    {
      step: 0,
      rows: [
        ["Roles", get("roles")],
        ["More than one role", get("multipleRoles")],
      ],
    },
    { step: 1, rows: [["Contact", [get("fullName"), get("email"), get("phone")].join("\n")]] },
    {
      step: 2,
      rows: [
        [
          "Available",
          get("fullDay") === "No"
            ? `Part of the day: ${get("availableHours")}`
            : get("fullDay") && "The entire event",
        ],
      ],
    },
    {
      step: 3,
      rows: [
        [
          "Prior experience",
          [get("priorExperience"), get("priorExperience") === "Yes" && get("experienceDetails")]
            .filter(Boolean)
            .join("\n"),
        ],
        ["Preferences / needs", get("needs") || "None"],
      ],
    },
    {
      step: 4,
      rows: [
        ["Heard about it from", heard],
        ["Comments", get("comments") || "None"],
      ],
    },
  ];

  return <ReviewSummary steps={STEPS} groups={groups} onEdit={onEdit} />;
}

function Confirmation() {
  return (
    <div className="py-8 text-center animate-fade-in-up">
      <ConfirmationCheck />
      <span className="mb-3 block font-serif text-sm italic text-primary">You're signed up</span>
      <h2 className="mb-6 font-serif text-4xl font-bold text-foreground md:text-5xl">
        Thank you for registering to volunteer!
      </h2>
      <p className="mx-auto max-w-md leading-relaxed text-muted-foreground">
        You're signed up to volunteer at the {fullEventName}. We appreciate your willingness to
        support ethical discussion and education among New Jersey high school students. Our
        organizing team will contact you with your role assignment, scheduling information, and
        training materials before the event. For questions, please contact <ContactLink />.
      </p>
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
