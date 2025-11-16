import { jwtVerify, SignJWT } from "jose";
import type { JwtPayload } from "./types";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export async function signToken(payload: Omit<JwtPayload, "iat" | "exp">) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);

    return verified.payload as unknown as JwtPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
