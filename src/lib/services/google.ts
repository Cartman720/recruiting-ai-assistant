import { google } from "googleapis";
import { JWT } from "google-auth-library";

export async function getGoogleAuth() {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    clientId: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    projectId: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  return auth;
}

export async function getGoogleCalendar(auth: JWT) {
  return google.calendar({ version: "v3", auth });
}
