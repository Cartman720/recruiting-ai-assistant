import slugify from "slugify";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { readDataset } from "@/lib/data";
import { EducationSchema, ExpreienceSchema } from "@/schemas/candidate";
import { prisma } from "@/lib/prisma";
import { randUser } from "@ngneat/falso";
import { parseDate } from "@/lib/utils";
import { chunk } from "lodash";

/**
 * Create a candidate from a resume
 * @param resume - The resume of the candidate
 * @param industrySlug - The slug of the industry of the candidate
 */
async function createCandidate(resume: string, industrySlug: string) {
  const industry = await prisma.industry.findUnique({
    where: { slug: industrySlug },
  });

  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
  });

  const ResponseFormatter = z.object({
    skills: z
      .array(z.string())
      .describe(
        "The skills of the candidate, i.e. 'Python', 'SQL', 'AWS', etc."
      ),
    summary: z
      .string()
      .describe(
        "The summary of the candidate, highlighting key skills, experiences and strengths."
      ),
    experiences: z
      .array(ExpreienceSchema)
      .describe("The experiences of the candidate"),
    education: z
      .array(EducationSchema)
      .describe("The education of the candidate"),
  });

  const modelWithStructure = model.withStructuredOutput(ResponseFormatter);

  const structuredOutput = await modelWithStructure
    .invoke(resume)
    .catch((error) => {
      console.error(error);
      return null;
    });

  const user = randUser();

  const candidate = {
    name: user.firstName + " " + user.lastName,
    email: user.email,
    skills: structuredOutput?.skills,
    summary: structuredOutput?.summary,
    experiences: structuredOutput?.experiences.map((experience) => ({
      ...experience,
      startDate: parseDate(experience.startDate),
      endDate: parseDate(experience.endDate),
    })),
    education: structuredOutput?.education.map((education) => ({
      ...education,
      startDate: parseDate(education.startDate),
      endDate: parseDate(education.endDate),
    })),
  };

  const result = await prisma.candidate.create({
    data: {
      name: candidate.name,
      email: candidate.email,
      summary: candidate.summary ?? "",
      skills: candidate.skills,
      rawResume: resume,
      industries: {
        connect: {
          id: industry?.id,
        },
      },
      experiences: {
        create: candidate.experiences,
      },
      education: {
        create: candidate.education,
      },
    },
  });

  return result;
}

/**
 * Main function to create candidates from the resumes
 */
async function main() {
  const dataset = await readDataset("resume_dataset.csv");
  const CHUNK_SIZE = 5; // Process 5 candidates at a time
  const chunks = chunk(dataset, CHUNK_SIZE);

  for (const chunk of chunks) {
    const promises = chunk.map(async (row: any) => {
      const industrySlug = slugify(row.category, {
        lower: true,
        strict: true,
        trim: true,
      });

      try {
        const candidate = await createCandidate(row.resume, industrySlug);
        console.log(
          `Created candidate: ${candidate.name} for industry: ${industrySlug}`
        );
        return candidate;
      } catch (error) {
        console.error(
          `Error creating candidate for industry ${industrySlug}:`,
          error
        );
        return null;
      }
    });

    await Promise.all(promises);

    console.log(`Completed processing chunk of ${chunk.length} candidates`);
  }
}

main();
