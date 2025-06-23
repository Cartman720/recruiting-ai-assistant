import { resolve } from "path";
import { readFile } from "fs/promises";
import { google } from "googleapis";
import { JWT } from "google-auth-library";

async function getGoogleKeyfile() {
  const credentials = await readFile(
    resolve(process.cwd(), "keys", "softgang-search-service-creds.json")
  );

  return JSON.parse(credentials.toString());
}

export async function getGoogleAuth() {
  const keyfile = await getGoogleKeyfile();

  const auth = new JWT({
    email: keyfile.client_email,
    key: keyfile.private_key,
    clientId: keyfile.client_id,
    projectId: keyfile.project_id,
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
