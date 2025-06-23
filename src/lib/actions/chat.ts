"use server";

import { createAgent } from "@/lib/agents";
import { prisma } from "@/lib/prisma";
import { generateThreadDetailsTool } from "@/lib/agents/tools/generate-thread-details";
import { createStreamableValue } from "ai/rsc";
import { createClient } from "../supabase/server";

export async function getChatThreads(userId: string) {
  const threads = await prisma.thread.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return threads;
}

export async function getChatState(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user || !id) {
    return undefined;
  }

  const thread = await prisma.thread.findUnique({
    where: {
      id,
      userId: data.user.id,
    },
  });

  if (!thread) {
    return undefined;
  }

  const agent = await createAgent({
    userName: data.user.user_metadata.full_name,
    email: data.user.user_metadata.email,
    calendarId: data.user.user_metadata.email,
  });

  // 5. Walk the full history
  const state = await agent.getState({
    configurable: { thread_id: thread.id },
  });

  const { messages, ...threadState } = state.values;

  return {
    threadId: thread.id,
    messages: messages.map((msg: any) => msg.toDict()),
    threadState,
  };
}

export async function generateThreadDetails(threadId: string) {
  const state = await getChatState(threadId);

  const messages = state?.messages || [];

  const { title, summary } = await generateThreadDetailsTool.invoke({
    content: messages
      .map((msg: any) => JSON.stringify(msg.data.content))
      .join("\n"),
  });

  await prisma.thread.update({
    where: { id: threadId },
    data: {
      title,
      summary,
    },
  });
}
