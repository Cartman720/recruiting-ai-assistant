import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (
      data?.user &&
      data.session.provider_token &&
      data.session.provider_refresh_token
    ) {
      await prisma.userOAuthIntegration.create({
        data: {
          userId: data.user.id,
          provider: "google",
          accessToken: data.session.provider_token,
          refreshToken: data.session.provider_refresh_token,
          expiresAt: data.session.expires_at
            ? new Date(data.session.expires_at * 1000)
            : undefined,
        },
      });
    }

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
