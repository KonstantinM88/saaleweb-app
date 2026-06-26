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
    company: formData.get("company") ?? "",
    message: formData.get("message"),
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
    await prisma.lead.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || null,
        message: parsed.data.message,
        source: parsed.data.source,
        locale: parsed.data.locale,
      },
    });
    await sendLeadNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      message: parsed.data.message,
      locale: parsed.data.locale,
      source: parsed.data.source,
    });
    return { status: "success" };
  } catch {
    return { status: "error", message: "server" };
  }
}
