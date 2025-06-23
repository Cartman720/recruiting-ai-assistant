import { Suspense } from "react";
import ChatClientPage from "./page.client";
import { getChatState } from "../actions";

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatClientPage initialState={state} />
    </Suspense>
  );
}
