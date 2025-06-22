import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  StoredMessage,
  mapStoredMessageToChatMessage,
} from "@langchain/core/messages";
import { createAgent } from "@/lib/agents";

interface ChatRequest {
  id: string;
  messages: StoredMessage[];
  threadState?: any;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const body: ChatRequest = await req.json();

  if (!data?.user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  const agent = await createAgent({
    userName: data.user.user_metadata.full_name,
    email: data.user.user_metadata.email,
  });

  const incomingMessages = body.messages.map(mapStoredMessageToChatMessage);

  const response = await agent.invoke(
    {
      messages: incomingMessages,
      ...(body.threadState ? body.threadState : {}),
    },
    {
      debug: true,
    }
  );

  const { messages, ...threadState } = response;

  return NextResponse.json({
    messages: messages.map((msg) => msg.toDict()),
    threadState,
  });
}
