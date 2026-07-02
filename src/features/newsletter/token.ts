import { SignJWT, jwtVerify } from "jose";

// Stateless double-opt-in tokens: signed with AUTH_SECRET, so no extra
// database columns are needed. The confirm token is short-lived; the
// unsubscribe token stays valid long-term because it is embedded in every
// newsletter email footer.

export type NewsletterTokenPurpose = "newsletter-confirm" | "newsletter-unsubscribe";

const CONFIRM_MAX_AGE = "14d";
const UNSUBSCRIBE_MAX_AGE = "3650d";

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createNewsletterToken(
  email: string,
  purpose: NewsletterTokenPurpose,
): Promise<string> {
  return new SignJWT({ email, purpose })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(purpose === "newsletter-confirm" ? CONFIRM_MAX_AGE : UNSUBSCRIBE_MAX_AGE)
    .sign(secretKey());
}

export async function verifyNewsletterToken(
  token: string,
  purpose: NewsletterTokenPurpose,
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.email === "string" && payload.purpose === purpose) {
      return { email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}
