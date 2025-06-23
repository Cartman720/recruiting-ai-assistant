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

export async function streamAgent(
  message: string,
  stream: any,
  id?: string | null
) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (!data?.session?.user) {
    return {
      error: "No user found",
    };
  }

  // Find the thread by id and user id
  let thread = id
    ? await prisma.thread.findUnique({
        where: {
          id,
          userId: data.session.user.id,
        },
      })
    : null;

  // Create a new thread if it doesn't exist
  if (!thread) {
    thread = await prisma.thread.create({
      data: {
        userId: data.session.user.id,
        state: {},
      },
    });
  }

  const agent = await createAgent({
    userName: data.session.user.user_metadata.full_name,
    email: data.session.user.user_metadata.email,
    calendarId: data.session.user.user_metadata.email,
    googleAccessToken: data.session.provider_token,
  });

  const agentStream = await agent.stream(
    {
      messages: [
        {
          type: "user",
          content: message,
        },
      ],
    },
    {
      configurable: {
        thread_id: thread.id,
      },
      streamMode: ["messages"],
    }
  );

  for await (const item of agentStream) {
    console.log(item);
    stream.update(JSON.parse(JSON.stringify(item, null, 2)));
  }

  stream.done();
}

export async function runAgent(message: string, threadId?: string | null) {
  const stream = createStreamableValue();

  await streamAgent(message, stream, threadId);

  return { streamData: stream.value };
}

export async function generateThreadDetails(threadId: string) {
  const state = await getChatState(threadId);

  const messages = state?.messages || [];

  const { title, summary } = await generateThreadDetailsTool.invoke({
    content: messages
      .map((msg: any) => JSON.stringify(msg.toJSON()))
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
