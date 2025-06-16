import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/");
  }

  return <>{children}</>;
}
