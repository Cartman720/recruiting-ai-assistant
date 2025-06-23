import { google } from "googleapis";
import { JWT, OAuth2Client } from "google-auth-library";
import { UserOAuthIntegration } from "@/generated/prisma";

// Option 1: Using OAuth2Client with access token
export async function getGoogleAuth(accessToken: string) {
  const auth = new OAuth2Client();
  auth.setCredentials({
    access_token: accessToken,
  });
  
  return auth;
}


// Updated calendar function that works with any auth type
export async function getGoogleCalendar(auth: OAuth2Client | JWT) {
  return google.calendar({ version: "v3", auth });
}
