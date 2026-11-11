/**
 * Shared building blocks for the step-by-step Ethics Bowl forms (team
 * registration and volunteer sign-up), so both look and behave the same.
 */

import type { ReactNode } from "react";
import Label from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { emailSuggestion } from "@/lib/validation";

export interface FormStepInfo {
  /** Short name under the progress bar, e.g. "Contact". */
  label: string;
  title: string;
  description: string;
}

/** Notice shown above a form in preview mode. */
export function PreviewBanner() {
  return (
    <p className="mb-10 rounded-sm border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
      <strong className="font-semibold">Preview mode.</strong> Every step is unlocked, nothing is
      required, and submitting sends nothing to the Google Sheet.
    </p>
  );
}

/** Soft orange halo on focus, added to every input and textarea. */
export const fieldGlow = "transition-shadow focus:ring-4 focus:ring-primary/20";

/** Decorative layer behind the form: the home hero's faint grid, fading out down the page. */
export function FormBackdrop({ id }: { id: string }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg className="absolute inset-0 h-full w-full text-foreground/[0.09] [mask-image:radial-gradient(ellipse_90%_70%_at_50%_0%,black_30%,transparent)]">
        <defs>
          <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

interface StepProgressProps {
  steps: FormStepInfo[];
  step: number;
  unlocked: number;
  onSelect: (index: number) => void;
  /** Accessible name for the progress nav. */
  label: string;
}

/** Segmented progress bar; steps already reached can be revisited. */
export function StepProgress({ steps, step, unlocked, onSelect, label }: StepProgressProps) {
  return (
    <nav aria-label={label} className="mb-16">
      <ol
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((item, index) => {
          const isCurrent = index === step;
          const isReached = index <= unlocked;
          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={!isReached || isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={item.label}
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

interface FormStepProps {
  steps: FormStepInfo[];
  index: number;
  isActive: boolean;
  fieldsetRef: (el: HTMLFieldSetElement | null) => void;
  children: ReactNode;
}

/** One step of the form. Inactive steps stay mounted (hidden) so answers are kept. */
export function FormStep({ steps, index, isActive, fieldsetRef, children }: FormStepProps) {
  const { title, description } = steps[index];
  return (
    <fieldset
      ref={fieldsetRef}
      aria-labelledby={`step-${index}-title`}
      className={isActive ? "animate-fade-in-up" : "hidden"}
    >
      <span className="mb-3 block font-serif text-sm italic text-primary">
        Step {index + 1} of {steps.length}
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

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  /** Inline validation message shown under the field. */
  error?: string;
  /** Adds a muted "(optional)" after the label. */
  optional?: boolean;
  children: ReactNode;
}

export function FormField({ id, label, hint, error, optional, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>}
      </Label>
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

/** Native checkbox/radio in the brand color, sized to sit on a line of text. */
const choiceInput = "flex-shrink-0 cursor-pointer accent-primary";

interface CheckOptionProps {
  name: string;
  value?: string;
  id?: string;
  required?: boolean;
  onChange?: () => void;
  /** Bold serif line next to the box; omit for a plain sentence option. */
  title?: string;
  /** Quiet italic line under the title. */
  note?: string;
  children: ReactNode;
}

/**
 * A checkbox with its text beside it, no box around it. With a `title`, it
 * reads as a list item (name, note, description); the name turns orange when
 * checked. Put several inside a `divide-y` list for thin rules between them.
 */
export function CheckOption({
  name,
  value,
  id,
  required,
  onChange,
  title,
  note,
  children,
}: CheckOptionProps) {
  return (
    <label htmlFor={id} className="group flex cursor-pointer items-start gap-4">
      <input
        id={id}
        name={name}
        value={value}
        type="checkbox"
        required={required}
        onChange={onChange}
        className={cn(choiceInput, "h-5 w-5", title ? "mt-1" : "mt-0.5")}
      />
      {title ? (
        <span>
          <span className="block font-serif text-lg font-bold text-foreground transition-colors group-hover:text-primary group-has-[:checked]:text-primary">
            {title}
          </span>
          {note && <span className="block text-sm italic text-muted-foreground">{note}</span>}
          <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
            {children}
          </span>
        </span>
      ) : (
        <span className="leading-relaxed text-foreground">{children}</span>
      )}
    </label>
  );
}

/** A multiple-choice question as a row (or two columns) of plain radio buttons. */
export function RadioGroup({
  name,
  legend,
  options,
  labelFor = (option) => option,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  /** Display text for an option, when it differs from the submitted value. */
  labelFor?: (option: string) => string;
}) {
  const wide = options.length > 2;
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-foreground">{legend}</legend>
      <div
        className={cn(
          wide ? "grid gap-x-8 gap-y-3 sm:grid-cols-2" : "flex flex-wrap gap-x-10 gap-y-3"
        )}
      >
        {options.map((option) => (
          <label
            key={option}
            className="inline-flex cursor-pointer items-center gap-2.5 text-foreground transition-colors hover:text-primary has-[:checked]:text-primary"
          >
            <input
              type="radio"
              name={name}
              value={option}
              required
              className={cn(choiceInput, "h-4 w-4")}
            />
            {labelFor(option)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** "Did you mean …?" for common email domain typos, e.g. gmial.com. */
export function EmailSuggestion({
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

/** Self-drawing check mark at the top of a form's confirmation screen. */
export function ConfirmationCheck() {
  return (
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
  );
}

/** Read-only recap of answers, grouped by step, each group with an Edit link. */
export function ReviewSummary({
  steps,
  groups,
  onEdit,
}: {
  steps: FormStepInfo[];
  groups: { step: number; rows: [string, ReactNode][] }[];
  onEdit: (index: number) => void;
}) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {groups.map((group) => (
        <div key={group.step} className="py-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="font-serif text-lg font-bold text-foreground">
              {steps[group.step].label}
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
