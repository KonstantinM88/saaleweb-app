import "server-only";

import type { AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { sendLeadAutoReply, sendLeadNotification, type LeadNotification } from "@/features/notifications/mailer";
import { sendLeadTelegramNotification } from "@/features/notifications/telegramReports";
import {
  attributionNotificationSummary,
  leadAttributionCreateData,
  leadConversionEvent,
  normalizeLeadAttribution,
} from "@/features/analytics/attribution.server";
import type { LeadAttributionPayload, LeadConversionEvent } from "@/features/analytics/attribution";
import type { AssistantSalesProfile } from "./profile";

export type AssistantLeadResult = {
  created: boolean;
  leadId?: string;
  conversion?: LeadConversionEvent;
};

function fallbackName(locale: AppLocale): string {
  if (locale === "ru") return "Контакт из AI-ассистента";
  if (locale === "en") return "AI assistant contact";
  return "Kontakt vom AI-Assistenten";
}

function profileMessage(profile: AssistantSalesProfile, pagePath?: string): string {
  return [
    "Kontakt ausdrücklich über den SaaleWeb AI-Assistenten angefragt.",
    pagePath ? `Seite: ${pagePath}` : undefined,
    profile.websiteStatus ? `Website: ${profile.websiteStatus}` : undefined,
    profile.websiteUrl ? `Website-URL: ${profile.websiteUrl}` : undefined,
    profile.goals.length ? `Ziele: ${profile.goals.join(", ")}` : undefined,
    profile.features.length ? `Funktionen: ${profile.features.join(", ")}` : undefined,
    profile.languages.length ? `Sprachen: ${profile.languages.join(", ")}` : undefined,
    profile.budget ? `Budget: ${profile.budget}` : undefined,
    profile.timeframe ? `Zeitrahmen: ${profile.timeframe}` : undefined,
    profile.preferredContact ? `Kontaktkanal: ${profile.preferredContact}` : undefined,
    profile.notes.length ? `Gesprächsnotizen: ${profile.notes.join(" | ")}` : undefined,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

export async function createAssistantLead({
  conversationId,
  profile,
  locale,
  pagePath,
  attribution: attributionPayload,
}: {
  conversationId: string;
  profile: AssistantSalesProfile;
  locale: AppLocale;
  pagePath?: string;
  attribution?: LeadAttributionPayload;
}): Promise<AssistantLeadResult> {
  if (!profile.contactRequested || (!profile.phone && !profile.email)) return { created: false };

  try {
    const attribution = normalizeLeadAttribution(attributionPayload, {
      fallbackConversionPage: pagePath,
    });
    const leadData = {
      name: profile.name || fallbackName(locale),
      email: profile.email || null,
      phone: profile.phone || null,
      company: profile.businessType || null,
      message: profileMessage(profile, pagePath),
      source: "ai_assistant",
      locale,
    };

    const result = await prisma.$transaction(async (tx) => {
      const conversation = await tx.assistantConversation.findUnique({
        where: { id: conversationId },
        select: { leadId: true },
      });
      if (!conversation) return { created: false as const };
      if (conversation.leadId) return { created: false as const, leadId: conversation.leadId };

      const lead = await tx.lead.create({
        data: {
          ...leadData,
          attribution: { create: leadAttributionCreateData(attribution) },
        },
        select: { id: true },
      });
      const claimed = await tx.assistantConversation.updateMany({
        where: { id: conversationId, leadId: null },
        data: { leadId: lead.id, funnelStage: "HANDOFF" },
      });

      if (claimed.count === 0) {
        await tx.lead.delete({ where: { id: lead.id } });
        const current = await tx.assistantConversation.findUnique({
          where: { id: conversationId },
          select: { leadId: true },
        });
        return { created: false as const, leadId: current?.leadId || undefined };
      }

      return { created: true as const, leadId: lead.id };
    });

    if (!result.created) return result;

    const notification: LeadNotification = {
      ...leadData,
      projectWebsite: profile.websiteUrl || null,
      projectType: profile.features.join(", ") || null,
      budget: profile.budget || null,
      attribution: attributionNotificationSummary(attribution),
    };
    const notificationResults = await Promise.allSettled([
      sendLeadNotification(notification),
      profile.email ? sendLeadAutoReply(notification) : Promise.resolve(false),
      sendLeadTelegramNotification(notification),
    ]);
    const [adminNotificationSent, autoReplySent, telegramNotificationSent] = notificationResults.map(
      (item) => item.status === "fulfilled" && item.value,
    );
    console.info("[assistant] Qualified contact converted to lead.", {
      conversationId,
      leadId: result.leadId,
      locale,
      attributionPresent: Boolean(attributionPayload),
      captureMode: attribution.captureMode,
      classifiedSource: attribution.last.source,
      classifiedMedium: attribution.last.medium,
      submissionResult: "created",
      adminNotificationSent,
      autoReplySent,
      telegramNotificationSent,
    });
    return {
      ...result,
      conversion: leadConversionEvent(attribution, "ai_assistant", locale),
    };
  } catch (error) {
    console.error("[assistant] Lead conversion failed.", {
      conversationId,
      code:
        error && typeof error === "object" && "code" in error && typeof error.code === "string"
          ? error.code
          : "unknown",
      submissionResult: "error",
    });
    return { created: false };
  }
}
