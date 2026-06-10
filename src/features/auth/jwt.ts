import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "saaleweb_admin";
export const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionPayload = { email: string; role: string };

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.email === "string" && typeof payload.role === "string") {
      return { email: payload.email, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}
