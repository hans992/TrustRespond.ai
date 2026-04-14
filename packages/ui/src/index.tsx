import type { ReactNode } from "react";

/** Pass-through wrapper; workspace chrome lives in apps/web `WorkspaceShell`. */
export function AppShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const styles =
    level === "high"
      ? "border-emerald/35 bg-emerald/10 text-emerald-light shadow-[0_0_20px_rgba(48,209,88,0.12)]"
      : level === "medium"
        ? "border-amber-500/35 bg-amber-500/10 text-amber-200"
        : "border-red-400/35 bg-red-500/10 text-red-200";

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${styles}`}
    >
      {level.toUpperCase()}
    </span>
  );
}
