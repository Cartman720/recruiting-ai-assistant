import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return <>{children}</>;
}
