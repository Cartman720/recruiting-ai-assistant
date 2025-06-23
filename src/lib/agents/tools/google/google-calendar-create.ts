import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { calendar_v3 } from "googleapis";

const googleCalendarCreateSchema = z.object({
  summary: z.string().describe("The title of the event."),
  start: z.object({
    dateTime: z
      .string()
      .describe(
        "The start time of the event in RFC3339 format. For example: '2025-07-14T15:00:00-07:00'"
      ),
    timeZone: z
      .string()
      .optional()
      .describe(
        "The IANA Time Zone Database name for the start time. For example: 'America/Los_Angeles'."
      ),
  }),
  end: z.object({
    dateTime: z
      .string()
      .describe(
        "The end time of the event in RFC3339 format. For example: '2025-07-14T16:00:00-07:00'"
      ),
    timeZone: z
      .string()
      .optional()
      .describe(
        "The IANA Time Zone Database name for the end time. For example: 'America/Los_Angeles'."
      ),
  }),
  description: z.string().optional().describe("The description of the event."),
  location: z.string().optional().describe("The location of the event."),
  attendees: z
    .array(
      z.object({
        email: z.string().email().describe("The email of the attendee."),
      })
    )
    .optional()
    .describe("A list of attendees for the event."),
});

export function createGoogleCalendarCreateTool(
  calendar: calendar_v3.Calendar,
  calendarId: string
) {
  const googleCalendarCreateTool = new DynamicStructuredTool({
    name: "google-calendar-create",
    description: "A tool to create events in a Google Calendar.",
    schema: googleCalendarCreateSchema,
    func: async (arg: z.infer<typeof googleCalendarCreateSchema>) => {
      const { summary, description, location, start, end, attendees } = arg;
      try {
        const event = {
          summary,
          description,
          location,
          start,
          end,
          attendees,
        };
        const response = await calendar.events.insert({
          calendarId,
          requestBody: event,
        });
        return JSON.stringify(response.data, null, 2);
      } catch (error) {
        console.error("Error creating calendar event:", error);
        return "An error occurred while creating the calendar event.";
      }
    },
  });

  return googleCalendarCreateTool;
}
