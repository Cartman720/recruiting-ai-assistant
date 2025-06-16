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
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        })
      }
      className="btn btn-outline w-full"
    >
      Login with Google
    </button>
  );
}
