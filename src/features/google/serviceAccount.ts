import "server-only";

import { SignJWT, importPKCS8 } from "jose";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const TOKEN_TIMEOUT_MS = 15_000;
const TOKEN_EXPIRY_SAFETY_MS = 120_000;

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

const tokenCache = new Map<string, CachedToken>();
const pendingTokens = new Map<string, Promise<string>>();

export class GoogleServiceAccountError extends Error {
  constructor(
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(code);
    this.name = "GoogleServiceAccountError";
  }
}

function credentials(): { email: string; privateKey: string } | null {
  const email = process.env.GSC_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  if (!email || !privateKey) return null;
  return { email, privateKey };
}

export function hasGoogleServiceAccountCredentials(): boolean {
  return credentials() !== null;
}

function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

async function requestAccessToken(scope: string): Promise<string> {
  const creds = credentials();
  if (!creds) throw new GoogleServiceAccountError("missing_google_credentials");

  let assertion: string;
  try {
    const privateKey = await importPKCS8(creds.privateKey, "RS256");
    const now = Math.floor(Date.now() / 1000);
    assertion = await new SignJWT({ scope })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuer(creds.email)
      .setAudience(GOOGLE_TOKEN_URL)
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .sign(privateKey);
  } catch {
    throw new GoogleServiceAccountError("invalid_google_private_key");
  }

  let response: Response;
  try {
    response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
      signal: AbortSignal.timeout(TOKEN_TIMEOUT_MS),
    });
  } catch (error) {
    throw new GoogleServiceAccountError(
      isTimeoutError(error) ? "google_token_timeout" : "google_token_request_failed",
    );
  }

  if (!response.ok) {
    throw new GoogleServiceAccountError("google_token_http_error", response.status);
  }

  const data = (await response.json().catch(() => null)) as GoogleTokenResponse | null;
  if (!data?.access_token) {
    throw new GoogleServiceAccountError("google_token_missing_access_token");
  }

  const expiresInSeconds =
    typeof data.expires_in === "number" && Number.isFinite(data.expires_in)
      ? data.expires_in
      : 3600;
  tokenCache.set(scope, {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresInSeconds * 1000 - TOKEN_EXPIRY_SAFETY_MS,
  });

  return data.access_token;
}

/**
 * Returns a cached OAuth token for the requested Google API scope. Concurrent
 * requests share one JWT exchange, so reports do not mint several tokens at once.
 */
export async function getGoogleServiceAccountAccessToken(scope: string): Promise<string> {
  const normalizedScope = scope.trim();
  if (!normalizedScope) throw new GoogleServiceAccountError("missing_google_scope");

  const cached = tokenCache.get(normalizedScope);
  if (cached && cached.expiresAt > Date.now()) return cached.accessToken;

  const pending = pendingTokens.get(normalizedScope);
  if (pending) return pending;

  const request = requestAccessToken(normalizedScope).finally(() => {
    pendingTokens.delete(normalizedScope);
  });
  pendingTokens.set(normalizedScope, request);
  return request;
}
