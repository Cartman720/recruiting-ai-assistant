import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAgent } from "@/lib/agents";
import { prisma } from "@/lib/prisma";
import { generateThreadDetailsTool } from "@/lib/agents/tools/generate-thread-details";

interface ChatRequest {
  id: string;
  message: string;
  threadState?: any;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const body: ChatRequest = await req.json();

  if (!data?.session?.user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  // Find the thread by id and user id
  let thread = body.id
    ? await prisma.thread.findUnique({
        where: {
          id: body.id,
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

  const response = await agent.invoke(
    {
      messages: [
        {
          type: "user",
          content: body.message,
        },
      ],
      ...(thread.state ? (thread.state as any) : {}),
    },
    {
      configurable: {
        thread_id: thread.id,
      },
    }
  );

  const { messages, ...threadState } = response;

  // Generate thread details
  const { title, summary } = await generateThreadDetailsTool.invoke({
    content: messages.map((msg) => JSON.stringify(msg.toJSON())).join("\n"),
  });

  // Update the thread with the generated details
  await prisma.thread.update({
    where: { id: thread.id },
    data: {
      title,
      summary,
    },
  });

  return NextResponse.json({
    threadId: thread.id,
    messages: messages.map((msg) => msg.toDict()),
    threadState,
  });
}
