'use server'

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function createSession() {
  const sessionId = nanoid();
  const cookieStore = await cookies();
  cookieStore.set("sessionId", sessionId);
  await prisma.user.create({
    data: {
      sessionId,
    },
  });
  return sessionId;
}

/**
 * This function is used to initialize the session.
 * If the sessionId is not found in the cookies, it will create a new session.
 * If the sessionId is found in the cookies, it will return the sessionId.
 */
export async function initSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return await createSession();
  }

  return sessionId;
}
