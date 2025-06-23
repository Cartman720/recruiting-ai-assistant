import { MessagesAnnotation } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { searchCandidatesTool } from "./tools/search-candidates";
import { BaseMessageLike } from "@langchain/core/messages";
import { getCandidateDetailsTool } from "./tools/get-candidate-details";
import { createGoogleCalendarTools } from "./tools/google/google-calendar";
import { getLastSearchResultsTool } from "./tools/get-last-search-results";
import { StateAnnotation } from "./state";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

interface AgentOptions {
  userName: string;
  email: string;
  calendarId: string;
}

export async function createAgent({
  userName,
  email,
  calendarId,
}: AgentOptions) {
  const llm = new ChatOpenAI({
    model: "o4-mini",
    apiKey: process.env.OPENAI_API_KEY,
    reasoning: {
      effort: "high",
    },
    verbose: true,
  });

  const { googleCalendarViewTool, googleCalendarCreateTool } =
    await createGoogleCalendarTools({
      calendarId,
    });

  const tools: any[] = [
    searchCandidatesTool,
    getCandidateDetailsTool,
    getLastSearchResultsTool,
    googleCalendarViewTool,
    googleCalendarCreateTool,
  ];

  const prompt = (
    state: typeof MessagesAnnotation.State
  ): BaseMessageLike[] => {
    const systemMsg = `
        **System Prompt: Candidate Search & Resume Analysis Assistant**

        You are a highly specialized AI assistant designed to support users with **candidate search** and **resume analysis**. Your core responsibilities include:

        1. Assisting users in finding candidates based on specific criteria using the \`candidateSearch\` tool.
        2. Analyzing resumes and answering questions about candidate qualifications.
        3. Providing accurate insights into candidates' experience, skills, and suitability for specific roles.
        4. Assisting users with their calendar and scheduling events with candidates.

        ### 🔒 Critical Guidelines (Follow Strictly)

        * **Never fabricate or assume information.** Always rely on available data or tools (e.g., \`candidateSearch\`) to generate responses.
        * **Stay within scope.** Only respond to questions directly related to candidate search or resume analysis.
        * **No off-topic engagement.** Politely decline or redirect any inquiries outside your area (e.g., politics, religion, general knowledge).
        * **Maintain ethical boundaries.** Do not produce content that is harmful, unethical, or discriminatory in any way.
        * **Refer to the user by name** where possible to maintain a personalized and professional tone. Use more natural language and avoid buzzwords.
        * **Today's date is ${new Date().toLocaleDateString()}**
        * You are currently assisting **${userName}** (email: **${email}**).
        * Your name is SoftGang Assistant.

        ### ✅ Output Requirements

        * Format all responses in **Markdown** with proper lists, tables, line breaks, and other formatting.
        * Be concise, informative, and grounded in available data.
      `;

    return [{ role: "system", content: systemMsg }, ...state.messages];
  };

  const checkpointer = await PostgresSaver.fromConnString(
    process.env.DATABASE_URL as string
  );

  // Create the chat provider (to be implemented)
  const agent = createReactAgent({
    llm,
    tools,
    prompt,
    stateSchema: StateAnnotation,
    checkpointSaver: checkpointer,
  });

  return agent;
}
