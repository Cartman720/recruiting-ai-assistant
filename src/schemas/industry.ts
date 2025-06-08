import { z } from "zod";

export const IndustrySchema = z.object({
  name: z.string().describe("The name of the industry"),
  slug: z.string().describe("The URL-friendly slug for the industry"),
  description: z.string().describe("The description of the industry"),
  parentId: z
    .string()
    .optional()
    .nullable()
    .describe("The ID of the parent industry, if this is a sub-industry"),
});
