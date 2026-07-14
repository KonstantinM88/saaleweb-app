import "server-only";

import { z } from "zod";
import {
  ATTRIBUTION_TTL_MS,
  CAPTURE_MODES,
  DEVICE_CATEGORIES,
  classifyAttribution,
  isInternalReferrer,
  sanitizeAttributionText,
  sanitizeClickId,
  sanitizeInternalPath,
  sanitizeReferrer,
  toAttributionSummary,
  type AttributionCaptureMode,
  type AttributionNotificationSummary,
  type DeviceCategory,
  type LeadConversionEvent,
  type LeadAttributionPayload,
} from "./attribution";

const touchSchema = z
  .object({
    source: z.string().max(100).optional(),
    medium: z.string().max(100).optional(),
    channel: z.string().max(100).optional(),
    campaign: z.string().max(160).optional(),
    content: z.string().max(200).optional(),
    term: z.string().max(200).optional(),
    landingPage: z.string().max(500).optional(),
    referrer: z.string().max(500).optional(),
    gclid: z.string().max(255).optional(),
    fbclid: z.string().max(255).optional(),
    msclkid: z.string().max(255).optional(),
    capturedAt: z.string().max(40).optional(),
  })
  .strict();

export const leadAttributionPayloadSchema = z
  .object({
    first: touchSchema.optional(),
    last: touchSchema.optional(),
    conversionPage: z.string().max(500).optional(),
    deviceCategory: z.enum(DEVICE_CATEGORIES).optional(),
    captureMode: z.enum(CAPTURE_MODES).optional(),
  })
  .strict();

export type NormalizedAttributionTouch = {
  source: string;
  medium: string;
  channel: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPage?: string;
  referrer?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  capturedAt: Date;
};

export type NormalizedLeadAttribution = {
  first: NormalizedAttributionTouch;
  last: NormalizedAttributionTouch;
  conversionPage?: string;
  deviceCategory: DeviceCategory;
  captureMode: AttributionCaptureMode;
};

function normalizedCapturedAt(value: unknown, now: Date): Date {
  if (typeof value !== "string") return now;
  const timestamp = Date.parse(value);
  const oldest = now.getTime() - ATTRIBUTION_TTL_MS;
  const futureTolerance = now.getTime() + 5 * 60 * 1000;
  if (!Number.isFinite(timestamp) || timestamp < oldest || timestamp > futureTolerance) return now;
  return new Date(timestamp);
}

function normalizeTouch(
  input: z.infer<typeof touchSchema> | undefined,
  captureMode: AttributionCaptureMode,
  fallbackLandingPage: string | undefined,
  now: Date,
): NormalizedAttributionTouch {
  const campaign = sanitizeAttributionText(input?.campaign, 160);
  const content = sanitizeAttributionText(input?.content, 200);
  const term = sanitizeAttributionText(input?.term, 200);
  const safeReferrer = sanitizeReferrer(input?.referrer);
  const referrer = safeReferrer && !isInternalReferrer(safeReferrer) ? safeReferrer : undefined;
  const gclid = captureMode === "persistent" ? sanitizeClickId(input?.gclid) : undefined;
  const fbclid = captureMode === "persistent" ? sanitizeClickId(input?.fbclid) : undefined;
  const msclkid = captureMode === "persistent" ? sanitizeClickId(input?.msclkid) : undefined;
  const classification = classifyAttribution({
    source: sanitizeAttributionText(input?.source, 100, { lowercase: true }),
    medium: sanitizeAttributionText(input?.medium, 100, { lowercase: true }),
    campaign,
    content,
    term,
    gclid,
    fbclid,
    msclkid,
    referrer,
  });

  return {
    ...classification,
    campaign,
    content,
    term,
    landingPage: sanitizeInternalPath(input?.landingPage) || fallbackLandingPage,
    referrer,
    gclid,
    fbclid,
    msclkid,
    capturedAt: normalizedCapturedAt(input?.capturedAt, now),
  };
}

function fallbackPayload(conversionPage?: string): LeadAttributionPayload {
  const capturedAt = new Date().toISOString();
  const touch = {
    source: "direct",
    medium: "none",
    channel: "Direct",
    landingPage: conversionPage,
    capturedAt,
  };
  return {
    first: touch,
    last: touch,
    conversionPage,
    deviceCategory: "unknown",
    captureMode: "request_only",
  };
}

export function normalizeLeadAttribution(
  input: unknown,
  options: { fallbackConversionPage?: string; now?: Date } = {},
): NormalizedLeadAttribution {
  const fallbackConversionPage = sanitizeInternalPath(options.fallbackConversionPage);
  const parsed = leadAttributionPayloadSchema.safeParse(input);
  const payload = parsed.success ? parsed.data : fallbackPayload(fallbackConversionPage);
  const now = options.now || new Date();
  const captureMode: AttributionCaptureMode = payload.captureMode === "persistent" ? "persistent" : "request_only";
  const conversionPage = sanitizeInternalPath(payload.conversionPage) || fallbackConversionPage;
  const first = normalizeTouch(payload.first, captureMode, conversionPage, now);
  const last = normalizeTouch(payload.last || payload.first, captureMode, conversionPage, now);

  return {
    first,
    last,
    conversionPage,
    deviceCategory: DEVICE_CATEGORIES.includes(payload.deviceCategory as DeviceCategory)
      ? (payload.deviceCategory as DeviceCategory)
      : "unknown",
    captureMode,
  };
}

export function parseLeadAttributionFormValue(
  value: FormDataEntryValue | null,
  fallbackConversionPage?: string,
): NormalizedLeadAttribution {
  if (typeof value !== "string" || !value || value.length > 8_000) {
    return normalizeLeadAttribution(undefined, { fallbackConversionPage });
  }
  try {
    return normalizeLeadAttribution(JSON.parse(value), { fallbackConversionPage });
  } catch {
    return normalizeLeadAttribution(undefined, { fallbackConversionPage });
  }
}

export function conversionPageFromRequestReferrer(value?: string | null): string | undefined {
  const safe = sanitizeReferrer(value);
  if (!safe || !isInternalReferrer(safe)) return undefined;
  try {
    return sanitizeInternalPath(new URL(safe).pathname);
  } catch {
    return undefined;
  }
}

export function leadAttributionCreateData(value: NormalizedLeadAttribution) {
  return {
    firstSource: value.first.source,
    firstMedium: value.first.medium,
    firstChannel: value.first.channel,
    firstCampaign: value.first.campaign || null,
    firstContent: value.first.content || null,
    firstTerm: value.first.term || null,
    firstLandingPage: value.first.landingPage || null,
    firstReferrer: value.first.referrer || null,
    firstGclid: value.first.gclid || null,
    firstFbclid: value.first.fbclid || null,
    firstMsclkid: value.first.msclkid || null,
    firstCapturedAt: value.first.capturedAt,
    lastSource: value.last.source,
    lastMedium: value.last.medium,
    lastChannel: value.last.channel,
    lastCampaign: value.last.campaign || null,
    lastContent: value.last.content || null,
    lastTerm: value.last.term || null,
    lastLandingPage: value.last.landingPage || null,
    lastReferrer: value.last.referrer || null,
    lastGclid: value.last.gclid || null,
    lastFbclid: value.last.fbclid || null,
    lastMsclkid: value.last.msclkid || null,
    lastCapturedAt: value.last.capturedAt,
    conversionPage: value.conversionPage || null,
    deviceCategory: value.deviceCategory,
    captureMode: value.captureMode,
  };
}

export function attributionNotificationSummary(
  value: NormalizedLeadAttribution,
): AttributionNotificationSummary {
  return toAttributionSummary({
    first: value.first,
    last: value.last,
    conversionPage: value.conversionPage,
    deviceCategory: value.deviceCategory,
    captureMode: value.captureMode,
  });
}

export function leadConversionEvent(
  value: NormalizedLeadAttribution,
  formName: string,
  locale: "de" | "en" | "ru",
): LeadConversionEvent {
  return {
    formName,
    leadSource: value.last.source,
    leadMedium: value.last.medium,
    leadChannel: value.last.channel,
    leadCampaign: value.last.campaign,
    pagePath: value.conversionPage || "/",
    locale,
    deviceCategory: value.deviceCategory,
  };
}
