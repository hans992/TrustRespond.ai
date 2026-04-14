import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { WorkspaceShell } from "@/components/app/WorkspaceShell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return <WorkspaceShell>{children}</WorkspaceShell>;
}
