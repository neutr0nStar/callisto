import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "secondary" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        variant === "default" && "border-transparent bg-primary/10 text-primary",
        variant === "secondary" && "border-transparent bg-muted text-foreground",
        variant === "outline" && "border-border text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

