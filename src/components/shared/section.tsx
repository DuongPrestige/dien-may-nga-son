import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/src/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section">;

export function Section({ className, ...props }: SectionProps) {
  return (
    <section
      className={cn("py-12 sm:py-16 lg:py-24", className)}
      {...props}
    />
  );
}

