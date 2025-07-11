import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./components/sidebar";
import { getChatThreads } from "@/lib/actions/chat";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const threads = await getChatThreads(data.user.id);

  return (
    <div className="flex h-screen w-full">
      <Sidebar threads={threads} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
