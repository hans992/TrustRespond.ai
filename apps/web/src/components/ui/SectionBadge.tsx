import type { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type SectionBadgeColor = "blue" | "emerald" | "neutral";

type SectionBadgeProps = {
  children: ReactNode;
  color?: SectionBadgeColor;
};

function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

const badgeColorClasses: Record<SectionBadgeColor, string> = {
  blue: "bg-accent/10 text-accent-light border border-accent/20",
  emerald: "bg-emerald/10 text-emerald-light border border-emerald/20",
  neutral: "bg-white/5 text-neutral-400 border border-white/10",
};

const dotColorClasses: Record<SectionBadgeColor, string> = {
  blue: "bg-accent-light",
  emerald: "bg-emerald-light",
  neutral: "bg-neutral-400",
};

export function SectionBadge({ children, color = "blue" }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
        badgeColorClasses[color],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", dotColorClasses[color])} />
      {children}
    </span>
  );
}
