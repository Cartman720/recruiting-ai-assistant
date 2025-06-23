import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";

const inputSchema = z.object({
  content: z.string(),
});

type Input = z.infer<typeof inputSchema>;

const outputSchema = z.object({
  title: z.string().max(25).describe("A short title for the thread."),
  summary: z.string().max(50).describe("A short summary of the thread."),
});

type Output = z.infer<typeof outputSchema>;

async function generateThreadDetails(input: Input): Promise<Output> {
  const { content } = input;

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
  });

  const modelWithSchema = model.withStructuredOutput(outputSchema);

  const result = await modelWithSchema.invoke(
    `
    You are a helpful assistant that generates details about a thread.

    Usually, threads are search queries that the user has made to find candidates or ask questions about candidates.

    The thread content is: ${content}
    `
  );

  return result;
}

export const generateThreadDetailsTool = tool(generateThreadDetails, {
  name: "generateThreadDetails",
  description:
    "Use this tool when you need to generate details about a thread, such as title, summary, etc.",
  schema: inputSchema,
});
