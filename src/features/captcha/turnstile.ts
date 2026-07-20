import "server-only";

import { z } from "zod";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TOKEN_MAX_LENGTH = 2048;

export const turnstileActionSchema = z.enum([
  "homepage_contact",
  "contact_page",
  "website_audit",
]);

export type TurnstileAction = z.infer<typeof turnstileActionSchema>;

const siteverifyResponseSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
});

export type TurnstileVerificationResult = {
  success: boolean;
  configured: boolean;
  reason:
    | "verified"
    | "disabled"
    | "misconfigured"
    | "missing_token"
    | "invalid_token"
    | "action_mismatch"
    | "hostname_mismatch"
    | "service_unavailable";
  errorCodes?: string[];
};

type VerifyTurnstileOptions = {
  token: FormDataEntryValue | null;
  expectedAction: TurnstileAction;
  remoteIp?: string | null;
  idempotencyKey?: string | null;
};

function envValue(name: "NEXT_PUBLIC_TURNSTILE_SITE_KEY" | "TURNSTILE_SECRET_KEY") {
  return process.env[name]?.trim() ?? "";
}

function expectedProductionHostname() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://saaleweb.de";

  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "saaleweb.de";
  }
}

function normalizeToken(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "";
  const token = value.trim();
  return token.length <= TURNSTILE_TOKEN_MAX_LENGTH ? token : "";
}

function normalizeRemoteIp(value?: string | null) {
  if (!value) return "";
  const candidate = value.split(",")[0]?.trim() ?? "";
  return /^[0-9a-f:.]{3,64}$/i.test(candidate) ? candidate : "";
}

/**
 * Validates a Cloudflare Turnstile token server-side. When both environment
 * values are intentionally empty the feature remains disabled, which keeps
 * local development and deployments made before key provisioning functional.
 * A partially configured environment fails closed.
 */
export async function verifyTurnstileToken({
  token: rawToken,
  expectedAction,
  remoteIp,
  idempotencyKey,
}: VerifyTurnstileOptions): Promise<TurnstileVerificationResult> {
  const siteKey = envValue("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  const secretKey = envValue("TURNSTILE_SECRET_KEY");

  if (!siteKey && !secretKey) {
    return { success: true, configured: false, reason: "disabled" };
  }

  if (!siteKey || !secretKey) {
    return { success: false, configured: false, reason: "misconfigured" };
  }

  const token = normalizeToken(rawToken);
  if (!token) {
    return { success: false, configured: true, reason: "missing_token" };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
  });
  const safeRemoteIp = normalizeRemoteIp(remoteIp);
  if (safeRemoteIp) body.set("remoteip", safeRemoteIp);
  if (idempotencyKey) body.set("idempotency_key", idempotencyKey);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return { success: false, configured: true, reason: "service_unavailable" };
    }

    const parsed = siteverifyResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      return { success: false, configured: true, reason: "service_unavailable" };
    }

    const result = parsed.data;
    if (!result.success) {
      return {
        success: false,
        configured: true,
        reason: "invalid_token",
        errorCodes: result["error-codes"]?.slice(0, 5),
      };
    }

    if (result.action !== expectedAction) {
      return { success: false, configured: true, reason: "action_mismatch" };
    }

    if (
      process.env.NODE_ENV === "production" &&
      result.hostname?.toLowerCase() !== expectedProductionHostname()
    ) {
      return { success: false, configured: true, reason: "hostname_mismatch" };
    }

    return { success: true, configured: true, reason: "verified" };
  } catch {
    return { success: false, configured: true, reason: "service_unavailable" };
  }
}

/** Extracts a request IP only for the one-time Siteverify request; it is never stored or logged. */
export function turnstileRemoteIp(requestHeaders: Headers) {
  return (
    requestHeaders.get("cf-connecting-ip") ||
    requestHeaders.get("x-real-ip") ||
    requestHeaders.get("x-forwarded-for") ||
    null
  );
}
