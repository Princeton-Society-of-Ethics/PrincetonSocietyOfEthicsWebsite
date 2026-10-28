import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-sm border border-border bg-card px-3 py-2.5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export default Textarea;
