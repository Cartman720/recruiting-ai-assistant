import slugify from "slugify";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { readDataset } from "@/lib/data";
import { EducationSchema, ExpreienceSchema } from "@/schemas/candidate";
import { prisma } from "@/lib/prisma";
import { parseDate } from "@/lib/utils";
import { chunk, shuffle } from "lodash";
import { randUser } from "@ngneat/falso";

/**
 * The response formatter for the candidate creation
 */
const ResponseFormatter = z.object({
  name: z.string().describe("The name of the candidate"),
  email: z
    .string()
    .describe(
      "The email of the candidate, generate if not provided, use the name to generate a valid email"
    ),
  title: z.string().describe("The specialization and title of the candidate"),
  yearsOfExperience: z.number(),
  educationLevel: z.enum(["high_school", "bachelors", "masters", "phd"]),
  expertiseLevel: z.enum([
    "intern",
    "junior",
    "mid",
    "senior",
    "lead",
    "principal",
  ]),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
  willingToRelocate: z.boolean(),
  hasRemoteExperience: z.boolean(),
  skills: z
    .array(z.string())
    .describe("The skills of the candidate, i.e. 'Python', 'SQL', 'AWS', etc."),
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

/**
 * Parse a resume and return a candidate
 * @param resume - The resume of the candidate
 */
async function parseResume(resume: string) {
  const model = new ChatOpenAI({
    modelName: "o4-mini",
    reasoning: {
      effort: "medium",
    },
  });

  const modelWithStructure = model.withStructuredOutput(ResponseFormatter);

  const structuredOutput = await modelWithStructure
    .invoke(
      `
      You are a helpful assistant that should extract the following data from the resume:

      Instructions:
      - Name should be the full name of the candidate (Generate if not provided).
      - Email should be the email of the candidate,if the candidate has a company email, use that as the email, otherwise generate by the name.
      - Experience should be the total number of years of experience the candidate has.
      - Expertise level should be the highest expertise level the candidate has.
      - If candidate has an experience start date then assume that today is ${new Date().getFullYear()}, so calcualate based on this.
      - Education level should be the highest education level the candidate has.
      - Extract a list of certifications (certificates, licenses, etc) the candidate has.
      - Extract a list of languages the candidate speaks (as strings).
      - Determine if the candidate is willing to relocate (true/false).
      - Determine language of the candidate (if not provided, use English).
      - Determine if the candidate has remote work experience (true/false).
      - Extract a list of skills the candidate has.
      - Extract a list of experiences the candidate has with specific details.
      - Extract a list of education the candidate has with specific details.
      - Extract a summary of the candidate, highlighting key skills, experiences and strengths.

      Here is the resume:
      ${resume}

      Here is the industry:
      `
    )
    .catch((error) => {
      console.error(error);
      return null;
    });

  const user = randUser();

  const candidate = {
    ...structuredOutput,
    name: structuredOutput?.name ?? user.firstName + " " + user.lastName,
    email: structuredOutput?.email ?? user.email,
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

  return candidate;
}

/**
 * Main function to create candidates from the resumes
 */
async function main() {
  const dataset = await readDataset("resume_dataset.csv");
  const CHUNK_SIZE = 20; // Process 5 candidates at a time
  const MAX_CANDIDATES = 500;
  const shuffledDataset = shuffle(dataset);
  const chunks = chunk(shuffledDataset.slice(0, MAX_CANDIDATES), CHUNK_SIZE);

  console.log("\n📊 Dataset Statistics:");
  console.log(` • Total candidates found: ${dataset.length}`);
  console.log(` • Processing limit: ${MAX_CANDIDATES} candidates`);
  console.log(` • Chunk size: ${CHUNK_SIZE} candidates per batch`);
  console.log(` • Total batches: ${chunks.length}\n`);

  let processed = 0;

  for (const chunk of chunks) {
    const promises = chunk.map(async (row: any) => {
      const industrySlug = slugify(row.category, {
        lower: true,
        strict: true,
        trim: true,
      });

      processed++;

      const industry = await prisma.industry.findUnique({
        where: { slug: industrySlug },
      });

      const candidate = await parseResume(row.resume).catch((error) => {
        return null;
      });

      if (!candidate) {
        return null;
      }

      try {
        const result = await prisma.candidate.create({
          data: {
            ...(candidate as any),
            rawResume: row.resume,
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

        console.log(
          `Created candidate: ${result.name} for industry: ${industrySlug}`
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

    await Promise.allSettled(promises);

    console.log(`Processed ${processed}/${MAX_CANDIDATES} chunks`);
  }
}

main();
