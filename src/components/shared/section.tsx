import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/src/lib/utils";

const SECTION_PADDING = {
  default: "py-12 sm:py-16 lg:py-24",
  compact: "py-10 sm:py-14 lg:py-20",
  none: "",
} as const;

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /**
   * Vertical spacing preset. `cn` does not merge conflicting Tailwind
   * classes, so pick a preset (or "none" + own py-*) instead of overriding.
   */
  padding?: keyof typeof SECTION_PADDING;
};

export function Section({
  className,
  padding = "default",
  ...props
}: SectionProps) {
  return <section className={cn(SECTION_PADDING[padding], className)} {...props} />;
}
