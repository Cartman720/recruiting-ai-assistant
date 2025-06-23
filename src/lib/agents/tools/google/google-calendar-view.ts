import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { calendar_v3 } from "googleapis";

const googleCalendarViewSchema = z.object({
  query: z.string().describe("The search query for calendar events."),
  timeMin: z
    .string()
    .optional()
    .describe(
      "The start time for the search, in RFC3339 timestamp format. Defaults to the current time."
    ),
  timeMax: z
    .string()
    .optional()
    .describe("The end time for the search, in RFC3339 timestamp format."),
});

export function createGoogleCalendarViewTool(
  calendar: calendar_v3.Calendar,
  calendarId: string
) {
  const googleCalendarViewTool = new DynamicStructuredTool({
    name: "google-calendar-view",
    description: "A tool to view events in a Google Calendar.",
    schema: googleCalendarViewSchema,
    func: async (arg: z.infer<typeof googleCalendarViewSchema>) => {
      const { query, timeMin, timeMax } = arg;

      try {
        const response = await calendar.events.list({
          calendarId,
          q: query,
          timeMin: timeMin || new Date().toISOString(),
          timeMax: timeMax,
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime",
        });

        const events = response.data.items;
        if (!events || events.length === 0) {
          return "No upcoming events found.";
        }
        return JSON.stringify(events, null, 2);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
        return "An error occurred while fetching calendar events.";
      }
    },
  });

  return googleCalendarViewTool;
}
