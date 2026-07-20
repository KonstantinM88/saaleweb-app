"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendLeadAutoReply, sendLeadNotification } from "@/features/notifications/mailer";
import { sendLeadTelegramNotification } from "@/features/notifications/telegramReports";
import {
  attributionNotificationSummary,
  conversionPageFromRequestReferrer,
  leadAttributionCreateData,
  leadConversionEvent,
  parseLeadAttributionFormValue,
} from "@/features/analytics/attribution.server";
import type { LeadConversionEvent } from "@/features/analytics/attribution";
import { turnstileRemoteIp, verifyTurnstileToken } from "@/features/captcha/turnstile";
import { contactSchema } from "./schema";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: "validation" | "captcha" | "server";
  created?: boolean;
  conversion?: LeadConversionEvent;
};

function isUniqueConstraintError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "P2002");
}

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
    submissionId: formData.get("submissionId") ?? "",
    attribution: formData.get("attribution") ?? "",
    locale: formData.get("locale") ?? "de",
    source: formData.get("source") ?? "homepage_contact",
  });

  if (!parsed.success) {
    return { status: "error", message: "validation" };
  }

  // Honeypot triggered -> pretend success, store nothing
  if (parsed.data.website) {
    return { status: "success", created: false };
  }

  try {
    const requestHeaders = await headers();
    const fallbackConversionPage = conversionPageFromRequestReferrer(requestHeaders.get("referer"));
    const attribution = parseLeadAttributionFormValue(
      formData.get("attribution"),
      fallbackConversionPage,
    );
    const submissionId = parsed.data.submissionId || null;

    // A retried request that already created a lead remains idempotently
    // successful and must not consume a new single-use Turnstile token.
    if (submissionId) {
      const duplicate = await prisma.lead.findUnique({
        where: { submissionId },
        select: { id: true },
      });
      if (duplicate) {
        console.info("[contact] Duplicate submission accepted idempotently.", {
          formName: parsed.data.source,
          captureMode: attribution.captureMode,
          classifiedSource: attribution.last.source,
          classifiedMedium: attribution.last.medium,
          submissionResult: "duplicate",
        });
        return { status: "success", created: false };
      }
    }

    const captcha = await verifyTurnstileToken({
      token: formData.get("cf-turnstile-response"),
      expectedAction: parsed.data.source,
      remoteIp: turnstileRemoteIp(requestHeaders),
      idempotencyKey: submissionId,
    });
    if (!captcha.success) {
      console.warn("[captcha] Contact submission rejected.", {
        formName: parsed.data.source,
        configured: captcha.configured,
        reason: captcha.reason,
        errorCodes: captcha.errorCodes,
      });
      return { status: "error", message: "captcha" };
    }

    const baseMessage =
      parsed.data.message?.trim() ||
      (parsed.data.source === "website_audit"
        ? "Bitte eine kostenlose Website-Analyse durchführen."
        : "");
    const projectDetails = [
      ["Projektart", parsed.data.projectType || (parsed.data.source === "website_audit" ? "Website-Audit" : "")],
      ["Budget", parsed.data.budget],
      ["Website", parsed.data.projectWebsite],
    ].filter(([, value]) => value);
    const message =
      projectDetails.length > 0
        ? `${projectDetails.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nNachricht:\n${baseMessage}`
        : baseMessage;

    let stored: { created: boolean; leadId?: string };
    try {
      stored = await prisma.$transaction(async (tx) => {
        if (submissionId) {
          const duplicate = await tx.lead.findUnique({
            where: { submissionId },
            select: { id: true },
          });
          if (duplicate) return { created: false, leadId: duplicate.id };
        }

        const lead = await tx.lead.create({
          data: {
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone || null,
            company: parsed.data.company || null,
            message,
            source: parsed.data.source,
            locale: parsed.data.locale,
            submissionId,
            attribution: { create: leadAttributionCreateData(attribution) },
          },
          select: { id: true },
        });
        return { created: true, leadId: lead.id };
      });
    } catch (error) {
      if (!submissionId || !isUniqueConstraintError(error)) throw error;
      const duplicate = await prisma.lead.findUnique({
        where: { submissionId },
        select: { id: true },
      });
      if (!duplicate) throw error;
      stored = { created: false, leadId: duplicate.id };
    }

    if (!stored.created) {
      console.info("[contact] Duplicate submission accepted idempotently.", {
        formName: parsed.data.source,
        captureMode: attribution.captureMode,
        classifiedSource: attribution.last.source,
        classifiedMedium: attribution.last.medium,
        submissionResult: "duplicate",
      });
      return { status: "success", created: false };
    }

    const safeAttribution = attributionNotificationSummary(attribution);
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
      attribution: safeAttribution,
    };
    const notificationResults = await Promise.allSettled([
      sendLeadNotification(leadNotification),
      sendLeadAutoReply(leadNotification),
      sendLeadTelegramNotification(leadNotification),
    ]);
    const [adminNotificationSent, autoReplySent, telegramNotificationSent] = notificationResults.map(
      (result) => result.status === "fulfilled" && result.value,
    );
    console.info("[contact] Lead processed.", {
      formName: parsed.data.source,
      locale: parsed.data.locale,
      attributionPresent: Boolean(parsed.data.attribution),
      captureMode: attribution.captureMode,
      classifiedSource: attribution.last.source,
      classifiedMedium: attribution.last.medium,
      submissionResult: "created",
      adminNotificationSent,
      autoReplySent,
      telegramNotificationSent,
    });
    return {
      status: "success",
      created: true,
      conversion: leadConversionEvent(attribution, parsed.data.source, parsed.data.locale),
    };
  } catch (error) {
    console.error("[contact] Lead submission failed.", {
      formName: parsed.data.source,
      code:
        error && typeof error === "object" && "code" in error && typeof error.code === "string"
          ? error.code
          : "unknown",
      submissionResult: "error",
    });
    return { status: "error", message: "server" };
  }
}
