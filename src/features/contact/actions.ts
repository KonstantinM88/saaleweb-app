"use server";

import { prisma } from "@/lib/prisma";
import { sendLeadAutoReply, sendLeadNotification } from "@/features/notifications/mailer";
import { sendLeadTelegramNotification } from "@/features/notifications/telegramReports";
import { contactSchema } from "./schema";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    company: formData.get("company") ?? "",
    projectWebsite: formData.get("projectWebsite") ?? "",
    projectType: formData.get("projectType") ?? "",
    budget: formData.get("budget") ?? "",
    message: formData.get("message"),
    privacy: formData.get("privacy") ?? "",
    website: formData.get("website") ?? "",
    utm: formData.get("utm") ?? "",
    locale: formData.get("locale") ?? "de",
    source: formData.get("source") ?? "homepage_contact",
  });

  if (!parsed.success) {
    return { status: "error", message: "validation" };
  }

  // Honeypot triggered -> pretend success, store nothing
  if (parsed.data.website) {
    return { status: "success" };
  }

  try {
    const baseMessage =
      parsed.data.message?.trim() ||
      (parsed.data.source === "website_audit"
        ? "Bitte eine kostenlose Website-Analyse durchführen."
        : "");
    const projectDetails = [
      ["Projektart", parsed.data.projectType || (parsed.data.source === "website_audit" ? "Website-Audit" : "")],
      ["Budget", parsed.data.budget],
      ["Website", parsed.data.projectWebsite],
      ["Kampagne (UTM)", parsed.data.utm],
    ].filter(([, value]) => value);
    const message =
      projectDetails.length > 0
        ? `${projectDetails.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nNachricht:\n${baseMessage}`
        : baseMessage;

    await prisma.lead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        company: parsed.data.company || null,
        message,
        source: parsed.data.source,
        locale: parsed.data.locale,
      },
    });
    const leadNotification = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      projectWebsite: parsed.data.projectWebsite || null,
      projectType: parsed.data.projectType || null,
      budget: parsed.data.budget || null,
      message,
      locale: parsed.data.locale,
      source: parsed.data.source,
    };
    const [adminNotificationSent, autoReplySent, telegramNotificationSent] = await Promise.all([
      sendLeadNotification(leadNotification),
      sendLeadAutoReply(leadNotification),
      sendLeadTelegramNotification(leadNotification),
    ]);
    console.info("[contact] Lead processed.", {
      source: parsed.data.source,
      locale: parsed.data.locale,
      adminNotificationSent,
      autoReplySent,
      telegramNotificationSent,
    });
    return { status: "success" };
  } catch {
    return { status: "error", message: "server" };
  }
}
