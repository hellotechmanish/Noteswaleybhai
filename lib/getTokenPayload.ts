// lib/getTokenPayload.ts
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getTokenPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  return payload;
}
