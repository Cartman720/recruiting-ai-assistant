import { tool } from "@langchain/core/tools";
import { getCurrentTaskInput } from "@langchain/langgraph";

async function getLastSearchResults(_: any) {
  const state = getCurrentTaskInput() as any;

  return JSON.stringify(state.candidates);
}

export const getLastSearchResultsTool = tool(getLastSearchResults, {
  name: "getLastSearchResults",
  description:
    "Use this tool when you need to get the last search results to answer user question, compare and perform other operations when asked about candidates.",
  responseFormat: "content",
});
