import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, Search } from "lucide-react";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { loadSchools, searchSchools, type School } from "@/lib/schools";
import { cn } from "@/lib/utils";

type IndexedSchools = Awaited<ReturnType<typeof loadSchools>>;

interface SchoolPickerProps {
  /** Called after the submitted school fields change, so the form can re-read them. */
  onChange: () => void;
  /** Extra classes for the text inputs (e.g. the focus halo). */
  inputClassName?: string;
}

const NOT_SELECTED_MESSAGE =
  "Choose your school from the list, or select “My school isn't listed.”";

/**
 * Search-as-you-type picker over the New Jersey high school directory.
 *
 * Submits three fields: schoolName, schoolCity, and schoolVerified ("Yes" when
 * picked from the directory). Coaches whose school is missing can switch to
 * typing it in; those registrations are sent with schoolVerified "No" so the
 * organizers can check them. If the directory fails to load, the picker falls
 * back to manual entry rather than blocking registration.
 */
export default function SchoolPicker({ onChange, inputClassName }: SchoolPickerProps) {
  const [schools, setSchools] = useState<IndexedSchools | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<School | null>(null);
  const [isListOpen, setIsListOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [isManual, setIsManual] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  useEffect(() => {
    loadSchools()
      .then(setSchools)
      .catch(() => setLoadFailed(true));
  }, []);

  const manual = isManual || loadFailed;
  const results = useMemo(
    () => (schools && !selected && !manual ? searchSchools(schools, query) : []),
    [schools, selected, manual, query]
  );

  // Typed text only counts once it's a school picked from the list (or manual mode is on).
  useEffect(() => {
    inputRef.current?.setCustomValidity(
      manual || selected || !query.trim() ? "" : NOT_SELECTED_MESSAGE
    );
    if (error) setError(inputRef.current?.validity.valid ? "" : NOT_SELECTED_MESSAGE);
    // Hidden inputs don't fire change events, so tell the form after each render.
    onChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manual, selected, query]);

  function choose(school: School) {
    setSelected(school);
    setQuery(school.name);
    setIsListOpen(false);
    setError("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isListOpen || results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[highlight]);
    } else if (event.key === "Escape") {
      setIsListOpen(false);
    }
  }

  function switchToManual() {
    setIsManual(true);
    setSelected(null);
    setIsListOpen(false);
    setError("");
    inputRef.current?.focus();
  }

  const showList = isListOpen && !manual && !selected && query.trim() !== "" && schools !== null;
  const activeId = showList && results[highlight] ? `${listId}-${highlight}` : undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor="schoolName">High school</Label>
      <p id="schoolName-hint" className="text-sm leading-relaxed text-muted-foreground">
        {manual
          ? "Enter your school's full name and town. The organizers will confirm it with you."
          : "Start typing your school's name or town, then choose it from the list."}
      </p>

      <div className="relative">
        {!manual && (
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
        )}
        <Input
          ref={inputRef}
          id="schoolName"
          // In directory mode the hidden input below carries the value instead.
          name={manual ? "schoolName" : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(null);
            setHighlight(0);
            setIsListOpen(true);
          }}
          onFocus={() => setIsListOpen(true)}
          onBlur={() => {
            setIsListOpen(false);
            const input = inputRef.current;
            if (input && !input.validity.valid) setError(input.validationMessage);
          }}
          onKeyDown={handleKeyDown}
          placeholder={manual ? "Full name of your high school" : "e.g. Princeton High School"}
          autoComplete="off"
          role={manual ? undefined : "combobox"}
          aria-expanded={manual ? undefined : showList}
          aria-controls={manual ? undefined : listId}
          aria-autocomplete={manual ? undefined : "list"}
          aria-activedescendant={activeId}
          aria-describedby={cn("schoolName-hint", error && "schoolName-error")}
          aria-invalid={error ? true : undefined}
          className={cn("h-12", !manual && "pl-10", inputClassName)}
          required
        />

        {showList && (
          <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-sm border border-border bg-card shadow-lg">
            {results.length > 0 ? (
              <ul
                id={listId}
                role="listbox"
                aria-label="Matching schools"
                className="max-h-80 overflow-y-auto py-1"
              >
                {results.map((school, index) => (
                  <li
                    key={`${school.name}|${school.city}`}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={index === highlight}
                    // mousedown, not click: it fires before the input's blur closes the list
                    onMouseDown={(event) => {
                      event.preventDefault();
                      choose(school);
                    }}
                    onMouseEnter={() => setHighlight(index)}
                    className={cn(
                      "flex cursor-pointer items-baseline justify-between gap-4 px-4 py-2.5",
                      index === highlight && "bg-primary/10"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-foreground">{school.name}</span>
                      <span className="block text-xs text-muted-foreground">{school.city}, NJ</span>
                    </span>
                    <span className="flex-shrink-0 text-xs text-muted-foreground">
                      {school.type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p id={listId} className="px-4 py-3 text-sm text-muted-foreground">
                No New Jersey high schools match “{query.trim()}”.
              </p>
            )}
            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                switchToManual();
              }}
              className="block w-full cursor-pointer border-t border-border px-4 py-2.5 text-left text-sm text-primary hover:bg-primary/5"
            >
              My school isn't listed
            </button>
          </div>
        )}
      </div>

      {error && (
        <p id="schoolName-error" className="text-sm text-red-700">
          {error}
        </p>
      )}

      {selected && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" aria-hidden />
          {selected.city}, NJ · {selected.type}
        </p>
      )}

      {manual ? (
        <>
          <div className="pt-4">
            <Label htmlFor="schoolCity">Town</Label>
          </div>
          <Input
            id="schoolCity"
            name="schoolCity"
            autoComplete="address-level2"
            placeholder="e.g. Princeton"
            className={cn("h-12", inputClassName)}
            onChange={onChange}
            required
          />
          <input type="hidden" name="schoolVerified" value="No" />
          {!loadFailed && (
            <button
              type="button"
              onClick={() => {
                setIsManual(false);
                setQuery("");
              }}
              className="cursor-pointer text-sm text-primary hover:underline"
            >
              Search the school list instead
            </button>
          )}
        </>
      ) : (
        <>
          <input type="hidden" name="schoolName" value={selected?.name ?? ""} />
          <input type="hidden" name="schoolCity" value={selected?.city ?? ""} />
          <input type="hidden" name="schoolVerified" value={selected ? "Yes" : ""} />
        </>
      )}
    </div>
  );
}
