import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { getCurrentTaskInput } from "@langchain/langgraph";

async function compareCandidates(_: any, config: any) {
  const state = getCurrentTaskInput() as any;

  return JSON.stringify(state.candidates);
}

export const compareCandidatesTool = tool(compareCandidates, {
  name: "compareCandidates",
  description:
    "Use this tool when you need to get candidates information from the search results.",
  responseFormat: "content",
});
