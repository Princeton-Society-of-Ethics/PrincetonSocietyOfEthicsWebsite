import { CalendarDays, Clock, MapPin, type LucideIcon } from "lucide-react";
import { ethicsBowlRegistration } from "@/content/ethicsBowlRegistration";
import { cn } from "@/lib/utils";

const { event } = ethicsBowlRegistration;

interface EventMetaProps {
  /** Include the start and end time. */
  showTime?: boolean;
  className?: string;
}

/**
 * The Ethics Bowl's date, time, and place as one quiet line of text, with thin
 * dividers between items (stacked on phones).
 */
export default function EventMeta({ showTime = false, className }: EventMetaProps) {
  const items: { icon: LucideIcon; label: string; text: string; note?: string }[] = [
    {
      icon: CalendarDays,
      label: "Date",
      text: event.date,
      note: event.dateIsTentative ? "tentative" : undefined,
    },
    ...(showTime ? [{ icon: Clock, label: "Time", text: event.time.replace(" to ", " – ") }] : []),
    { icon: MapPin, label: "Location", text: `${event.venue}, ${event.place}` },
  ];

  // Every item gets a left divider; the list is shifted left by one divider's
  // width inside a clipping wrapper, so the divider at the start of each row is
  // hidden and dividers only ever appear between items, however they wrap.
  return (
    <div className={cn("overflow-hidden", className)}>
      <dl className="flex flex-col gap-3 text-foreground sm:-ml-[21px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-0 sm:gap-y-2">
        {items.map(({ icon: Icon, label, text, note }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 sm:border-l sm:border-border sm:px-5"
          >
            <dt className="sr-only">{label}</dt>
            <Icon className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
            <dd>
              {text}
              {note && (
                <span className="ml-1.5 text-sm italic text-muted-foreground">({note})</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
