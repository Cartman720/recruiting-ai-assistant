import { readDataset } from "../lib/data";
import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { IndustrySchema } from "../schemas/industry";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { z } from "zod";

type Industry = z.infer<typeof IndustrySchema>;

async function main() {
  // Read the dataset
  const dataset = await readDataset("resume_dataset.csv");

  // Extract unique industries
  const uniqueIndustries: string[] = Array.from(
    new Set(dataset.map((row: any) => row.category))
  );

  // Initialize OpenAI
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
  });

  // Create prompt template for industry description
  const promptTemplate = new PromptTemplate({
    template:
      "Write a concise description (2-3 sentences) for the {industry} industry. Focus on the main activities, technologies, and business aspects.",
    inputVariables: ["industry"],
  });

  // Process each industry
  const industries = await Promise.all(
    uniqueIndustries.map(async (industry: string) => {
      // Generate slug
      const slug = slugify(industry, {
        lower: true,
        strict: true,
        trim: true,
      });

      // Generate description using LangChain
      const prompt = await promptTemplate.format({ industry });
      const description = await model.invoke(prompt);

      // Create industry record
      return {
        slug,
        name: industry,
        description: description.content,
      };
    })
  );

  // Validate and log results
  const validatedIndustries: Industry[] = industries
    .map((industry) => {
      const result = IndustrySchema.safeParse(industry);
      if (!result.success) {
        console.error(`Invalid industry data:`, result.error);
        return null;
      }
      return result.data;
    })
    .filter((industry): industry is Industry => industry !== null);

  console.log(`Generated ${validatedIndustries.length} industries:`);

  // Insert industries into database
  for (const industry of validatedIndustries) {
    try {
      await prisma.industry.upsert({
        where: { slug: industry.slug },
        update: industry,
        create: industry,
      });
      console.log(`Successfully upserted industry: ${industry.name}`);
    } catch (error) {
      console.error(`Failed to upsert industry ${industry.name}:`, error);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
