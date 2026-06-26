"use server";

import { prisma } from "@/lib/prisma";
import { sendLeadNotification } from "@/features/notifications/mailer";
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
    const projectDetails = [
      ["Projektart", parsed.data.projectType],
      ["Budget", parsed.data.budget],
      ["Website", parsed.data.projectWebsite],
    ].filter(([, value]) => value);
    const message =
      projectDetails.length > 0
        ? `${projectDetails.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nNachricht:\n${parsed.data.message}`
        : parsed.data.message;

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
    await sendLeadNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      message,
      locale: parsed.data.locale,
      source: parsed.data.source,
    });
    return { status: "success" };
  } catch {
    return { status: "error", message: "server" };
  }
}
