import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { prisma } from "@/lib/prisma";

const detailsSchema = z.object({
  candidateId: z.string(),
});

type DetailsInput = z.infer<typeof detailsSchema>;

async function getCandidateDetails(question: DetailsInput) {
  const { candidateId } = question;

  const candidate = await prisma.candidate.findUnique({
    where: {
      id: candidateId,
    },
    include: {
      experiences: true,
      education: true,
    },
  });

  return candidate;
}

export const getCandidateDetailsTool = tool(getCandidateDetails, {
  name: "getCandidateDetails",
  description:
    "Use this tool when you need to get details about specific candidate, such as experience, skills, education, etc.",
  schema: detailsSchema,
});
