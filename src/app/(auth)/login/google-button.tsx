"use client";

import { createClient } from "@/lib/supabase/client";

export default function GoogleButton() {
  const client = createClient();

  return (
    <button
      type="button"
      onClick={() =>
        client.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
            scopes: [
              "openid",
              "email",
              "profile",
              "https://www.googleapis.com/auth/calendar",
              "https://www.googleapis.com/auth/calendar.events",
            ].join(" "),
          },
        })
      }
      className="btn btn-outline w-full"
    >
      Login with Google
    </button>
  );
}
