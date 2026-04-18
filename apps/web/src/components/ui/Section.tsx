import type { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Marketing / layout wrapper: consistent max-width, horizontal padding, vertical rhythm.
 */
export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={twMerge(clsx("mx-auto max-w-6xl px-6 py-28 md:py-32", className))}>
      {children}
    </section>
  );
}
