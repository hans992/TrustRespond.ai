import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return <div style={{ minHeight: "100vh", background: "#f8fafc" }}>{children}</div>;
}

export function ConfidenceBadge({ level }: { level: "high" | "medium" | "low" }) {
  const color = level === "high" ? "#10b981" : level === "medium" ? "#f59e0b" : "#ef4444";
  return (
    <span style={{ padding: "2px 8px", borderRadius: 6, border: `1px solid ${color}`, color }}>
      {level.toUpperCase()}
    </span>
  );
}
