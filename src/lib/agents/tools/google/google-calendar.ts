import { getGoogleAuth, getGoogleCalendar } from "@/lib/services/google";
import { createGoogleCalendarViewTool } from "./google-calendar-view";
import { createGoogleCalendarCreateTool } from "./google-calendar-create";

export async function createGoogleCalendarTools({
  calendarId,
  googleAccessToken,
}: {
  calendarId: string;
  googleAccessToken?: string | null;
}) {
  if (!googleAccessToken) {
    return {
      googleCalendarViewTool: null,
      googleCalendarCreateTool: null,
    };
  }

  const auth = await getGoogleAuth(googleAccessToken);
  const calendar = await getGoogleCalendar(auth);

  const googleCalendarViewTool = createGoogleCalendarViewTool(
    calendar,
    calendarId
  );
  const googleCalendarCreateTool = createGoogleCalendarCreateTool(
    calendar,
    calendarId
  );

  return {
    googleCalendarViewTool,
    googleCalendarCreateTool,
  };
}
