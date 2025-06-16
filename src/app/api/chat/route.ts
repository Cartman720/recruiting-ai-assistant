import { NextRequest, NextResponse } from "next/server";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { prisma } from "@/lib/prisma";

const llm = new ChatOpenAI({
  model: "o4-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

// Placeholder for tools (to be implemented)
const tools: any[] = [];

// Create the chat provider (to be implemented)
const chatProvider = createReactAgent({
  llm,
  tools,
});

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get("sessionId")?.value;

  console.log(sessionId);

  const user = await prisma.user.upsert({
    where: {
      sessionId: sessionId,
    },
    create: {
      sessionId: sessionId ?? "",
    },
    update: {
      sessionId: sessionId ?? "",
    },
  });

  if (!user) {
    return NextResponse.json({ error: "No user found" }, { status: 401 });
  }

  const body = await req.json();

  const thread = await prisma.thread.upsert({
    where: {
      id: body.id,
    },
    create: {
      id: body.id,
      userId: user?.id,
    },
    update: {
      id: body.id,
      userId: user?.id,
    },
    include: {
      messages: true,
    },
  });

  console.log(body, thread);

  return NextResponse.json({ message: "Not implemented yet" });
}
