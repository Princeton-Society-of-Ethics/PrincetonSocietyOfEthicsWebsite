import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}
