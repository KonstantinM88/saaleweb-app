"use server";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/shared/config/site";
import { sendNewsletterConfirmation } from "@/features/notifications/newsletterMailer";
import { newsletterSchema } from "./schema";
import { createNewsletterToken } from "./token";

export type NewsletterState = {
  status: "idle" | "success" | "already" | "error";
  message?: string;
};

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    locale: formData.get("locale") ?? "de",
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: "validation" };
  }

  // Honeypot triggered -> pretend success, store nothing
  if (parsed.data.website) {
    return { status: "success" };
  }

  const { email, locale } = parsed.data;

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.confirmed) {
      return { status: "already" };
    }

    // Create the pending record (or refresh locale on a pending one) before
    // sending the confirmation email.
    if (existing) {
      await prisma.newsletterSubscriber.update({ where: { email }, data: { locale } });
    } else {
      await prisma.newsletterSubscriber.create({ data: { email, locale, confirmed: false } });
    }

    const token = await createNewsletterToken(email, "newsletter-confirm");
    const confirmUrl = `${siteConfig.url}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
    const sent = await sendNewsletterConfirmation({ email, locale, confirmUrl });

    if (!sent) {
      return { status: "error", message: "delivery" };
    }
    return { status: "success" };
  } catch {
    return { status: "error", message: "server" };
  }
}
