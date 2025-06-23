import { Suspense } from "react";
import { notFound } from "next/navigation";
import ChatClientPage from "./page.client";
import { getChatState } from "@/lib/actions/chat";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: {
    slugs: string[];
  };
}) {
  const chatId = (await params).slugs?.[0];

  const state = chatId ? await getChatState(chatId) : undefined;

  if (chatId && !state) {
    return notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatClientPage initialState={state} />
    </Suspense>
  );
}
