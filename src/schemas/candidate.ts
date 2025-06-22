import { z } from "zod";
import { IndustrySchema } from "./industry";

const DATE_DESCRIPTION_TEMPLATE = (
  type: string,
  isEndDate: boolean = false
) => `
  The ${isEndDate ? "end" : "start"} date of the ${type}.
  Format: dd/MM/yyyy
  Rules:
  - Always use dd/MM/yyyy format
  - If month is unknown, use 01 (January)
  - If day is unknown, use 01
  ${isEndDate ? `- Leave empty if the ${type} is ongoing` : ""}
  Examples:
  - "15/01/2020" for January 15, 2020
  - "01/01/2020" for January 2020 (when day is unknown)
`;

export const ExpreienceSchema = z.object({
  company: z.string().describe("The company of the candidate"),
  title: z.string().describe("The title of the candidate"),
  startDate: z
    .string()
    .describe(DATE_DESCRIPTION_TEMPLATE("experience"))
    .nullable()
    .optional(),
  endDate: z
    .string()
    .describe(DATE_DESCRIPTION_TEMPLATE("experience", true))
    .nullable()
    .optional(),
  description: z.string().describe("The description of the experience"),
});

export const EducationSchema = z.object({
  school: z.string().describe("The school of the candidate"),
  degree: z.string().describe("The degree of the candidate"),
  startDate: z
    .string()
    .describe(DATE_DESCRIPTION_TEMPLATE("education"))
    .nullable()
    .optional(),
  endDate: z
    .string()
    .describe(DATE_DESCRIPTION_TEMPLATE("education", true))
    .nullable()
    .optional(),
});

export const educationLevelSchema = z.enum([
  "high_school",
  "bachelors",
  "masters",
  "phd",
]);

export const expertiseLevelSchema = z.enum([
  "intern",
  "junior",
  "mid",
  "senior",
  "lead",
  "principal",
]);

export const CandidateSchema = z.object({
  name: z.string().describe("The name of the candidate"),
  email: z.string().describe("The email of the candidate"),
  title: z.string().describe("The specialization and title of the candidate"),
  skills: z
    .array(z.string())
    .describe("The skills of the candidate, i.e. 'Python', 'SQL', 'AWS', etc."),
  industries: z
    .array(IndustrySchema)
    .describe("The industries of the candidate"),
  experiences: z
    .array(ExpreienceSchema)
    .describe("The experiences of the candidate"),
  education: z
    .array(EducationSchema)
    .describe("The education of the candidate"),
  yearsOfExperience: z.number(),
  educationLevel: educationLevelSchema,
  expertiseLevel: expertiseLevelSchema,
  city: z.string(),
  state: z.string(),
  country: z.string(),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
  willingToRelocate: z.boolean(),
  hasRemoteExperience: z.boolean(),
});
