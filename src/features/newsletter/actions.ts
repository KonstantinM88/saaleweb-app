"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { turnstileRemoteIp, verifyTurnstileToken } from "@/features/captcha/turnstile";
import { sendNewsletterConfirmation } from "@/features/notifications/newsletterMailer";
import { createNewsletterToken } from "./token";
import { processNewsletterSignup, type NewsletterState } from "./subscribe";
export type { NewsletterState } from "./subscribe";

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  return processNewsletterSignup(formData, {
    db: prisma,
    createToken: createNewsletterToken,
    sendConfirmation: sendNewsletterConfirmation,
    verifyCaptcha: async () => verifyTurnstileToken({
      token: formData.get("cf-turnstile-response"),
      expectedAction: "newsletter_signup",
      remoteIp: turnstileRemoteIp(await headers()),
    }),
  });
}
