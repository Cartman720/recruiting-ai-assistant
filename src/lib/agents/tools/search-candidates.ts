import { z } from "zod";
import { tool } from "@langchain/core/tools";
import {
  educationLevelSchema,
  expertiseLevelSchema,
} from "@/schemas/candidate";
import { createVectorStore } from "@/lib/vector-store";
import { Command, END } from "@langchain/langgraph";
import { ToolMessage } from "@langchain/core/messages";

const searchSchema = z.object({
  query: z
    .string()
    .describe("The query to use for semantic search for a candidate."),
  yearsOfExperience: z
    .number()
    .nullable()
    .describe("The years of experience for the candidate."),
  skills: z
    .array(z.string())
    .nullable()
    .describe("The skills for the candidate mentioned in the query."),
  willingToRelocate: z
    .boolean()
    .nullable()
    .describe("Whether the candidate is willing to relocate."),
  hasRemoteExperience: z
    .boolean()
    .nullable()
    .describe("Whether the candidate has remote experience."),
  educationLevel: educationLevelSchema
    .nullable()
    .describe("The education level for the candidate."),
  expertiseLevel: expertiseLevelSchema
    .nullable()
    .describe("The expertise level for the candidate."),
  languages: z.array(z.string()).describe("The languages for the candidate."),
  country: z.string().nullable().describe("The country for the candidate."),
  city: z
    .string()
    .nullable()
    .describe(
      "The city for the candidate. For example, SF Bay Area is San Francisco"
    ),
  state: z
    .string()
    .nullable()
    .describe(
      "The state for the candidate, it shold be the state abbreviation. For example, CF is California, NY is New York"
    ),
});

type SearchInput = z.infer<typeof searchSchema>;

const createFilters = (input: Omit<SearchInput, "query">) => {
  const {
    yearsOfExperience,
    willingToRelocate,
    hasRemoteExperience,
    educationLevel,
    expertiseLevel,
    languages,
    country,
    state,
  } = input;

  const filters: any = {};

  if (yearsOfExperience !== null) {
    filters.yearsOfExperience = { $gte: yearsOfExperience };
  }

  if (willingToRelocate !== null) {
    filters.willingToRelocate = willingToRelocate;
  }

  if (hasRemoteExperience !== null) {
    filters.hasRemoteExperience = hasRemoteExperience;
  }

  if (educationLevel !== null) {
    filters.educationLevel = educationLevel;
  }

  if (expertiseLevel !== null) {
    filters.expertiseLevel = expertiseLevel;
  }

  if (languages && languages.length > 0) {
    filters.languages = { $in: languages };
  }

  if (country) {
    filters.country = country;
  }

  if (state) {
    filters.state = state;
  }

  return filters;
};

async function searchCandidates(input: SearchInput, config: any) {
  const vectorStore = await createVectorStore({
    namespace: "candidates",
  });

  const { query, ...filters } = input;

  const metadataFilters = createFilters(filters);

  const results = await vectorStore.similaritySearchWithScore(
    query,
    5,
    metadataFilters
  );

  const candidates = results.map((c) => {
    const [candidate, score] = c;

    return {
      ...candidate.metadata,
      score,
    };
  });

  return new Command({
    update: {
      candidates,
      messages: [
        new ToolMessage({
          name: "candidateSearch",
          content: "Here are the candidates that match your search.",
          tool_call_id: config.toolCall.id,
          artifact: {
            type: "candidates_search_results",
            data: candidates,
          },
        }),
      ],
    },
    goto: END,
  });
}

export const searchCandidatesTool = tool(searchCandidates, {
  name: "candidateSearch",
  description: "Use this tool when user searches for a candidate.",
  schema: searchSchema,
  returnDirect: true,
});
