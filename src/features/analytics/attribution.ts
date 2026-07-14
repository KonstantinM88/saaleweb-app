import { detectAiReferrer } from "./aiTraffic";

export const ATTRIBUTION_STORAGE_KEY = "saaleweb_attribution_v1";
export const ATTRIBUTION_STORAGE_VERSION = 1 as const;
export const ATTRIBUTION_TTL_DAYS = 90;
export const ATTRIBUTION_TTL_MS = ATTRIBUTION_TTL_DAYS * 24 * 60 * 60 * 1000;
export const ATTRIBUTION_CONSENT_EVENT = "saaleweb:analytics-consent";

export const DEVICE_CATEGORIES = ["mobile", "tablet", "desktop", "unknown"] as const;
export const CAPTURE_MODES = ["persistent", "request_only"] as const;

export type DeviceCategory = (typeof DEVICE_CATEGORIES)[number];
export type AttributionCaptureMode = (typeof CAPTURE_MODES)[number];

export type AttributionTouch = {
  source?: string;
  medium?: string;
  channel?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPage?: string;
  referrer?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  capturedAt?: string;
};

export type LeadAttributionPayload = {
  first?: AttributionTouch;
  last?: AttributionTouch;
  conversionPage?: string;
  deviceCategory?: DeviceCategory;
  captureMode?: AttributionCaptureMode;
};

export type StoredAttribution = {
  version: typeof ATTRIBUTION_STORAGE_VERSION;
  expiresAt: string;
  first: AttributionTouch;
  last: AttributionTouch;
};

export type AttributionClassification = {
  source: string;
  medium: string;
  channel: string;
};

export type AttributionCandidate = {
  touch: AttributionTouch;
  hasExternalSignal: boolean;
};

export type AttributionNotificationSummary = {
  channel?: string;
  firstSource?: string;
  firstMedium?: string;
  firstLandingPage?: string;
  lastSource?: string;
  lastMedium?: string;
  campaign?: string;
  conversionPage?: string;
  deviceCategory?: DeviceCategory;
  captureMode?: AttributionCaptureMode;
};

export type LeadConversionEvent = {
  formName: string;
  leadSource: string;
  leadMedium: string;
  leadChannel: string;
  leadCampaign?: string;
  pagePath: string;
  locale: "de" | "en" | "ru";
  deviceCategory: DeviceCategory;
};

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f]/g;
const HTML_TAGS = /<[^>]*>/g;
const DANGEROUS_PROTOCOL = /^(?:javascript|data|vbscript):/i;

const SEARCH_HOSTS: Array<{ source: string; pattern: RegExp }> = [
  { source: "google", pattern: /^google\.[a-z.]+$/i },
  { source: "bing", pattern: /^bing\.com$/i },
  { source: "duckduckgo", pattern: /^duckduckgo\.com$/i },
  { source: "yandex", pattern: /^yandex\.[a-z.]+$/i },
  { source: "ecosia", pattern: /^ecosia\.org$/i },
  { source: "brave", pattern: /^search\.brave\.com$/i },
  { source: "startpage", pattern: /^startpage\.com$/i },
];

const SOCIAL_HOSTS: Array<{ source: string; pattern: RegExp }> = [
  { source: "telegram", pattern: /(^|\.)(t\.me|telegram\.me|telegram\.org)$/i },
  { source: "instagram", pattern: /(^|\.)instagram\.com$/i },
  { source: "facebook", pattern: /(^|\.)(facebook\.com|fb\.com|l\.facebook\.com)$/i },
  { source: "linkedin", pattern: /(^|\.)linkedin\.com$/i },
  { source: "tiktok", pattern: /(^|\.)tiktok\.com$/i },
];

const SOCIAL_SOURCES = new Set(["telegram", "instagram", "facebook", "linkedin", "tiktok"]);

const AI_SOURCE_BY_LABEL: Record<string, string> = {
  "ChatGPT / OpenAI": "chatgpt",
  "Claude / Anthropic": "claude",
  Perplexity: "perplexity",
  "Google AI / Gemini": "gemini",
  "Copilot / Bing": "copilot",
  "Meta AI": "meta_ai",
  "Grok / xAI": "grok",
  DeepSeek: "deepseek",
  "Mistral / Le Chat": "mistral",
  "Other AI bot": "ai_referral",
};

const SOURCE_LABELS: Record<string, string> = {
  google: "Google",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  yandex: "Yandex",
  ecosia: "Ecosia",
  brave: "Brave Search",
  startpage: "Startpage",
  chatgpt: "ChatGPT",
  claude: "Claude",
  perplexity: "Perplexity",
  gemini: "Gemini",
  copilot: "Copilot",
  meta_ai: "Meta AI",
  grok: "Grok",
  deepseek: "DeepSeek",
  mistral: "Mistral",
  telegram: "Telegram",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  direct: "Direct",
};

export function sanitizeAttributionText(
  value: unknown,
  maxLength: number,
  options: { lowercase?: boolean } = {},
): string | undefined {
  if (typeof value !== "string") return undefined;
  let clean = value.replace(CONTROL_CHARACTERS, "").replace(HTML_TAGS, "").trim();
  if (!clean || DANGEROUS_PROTOCOL.test(clean)) return undefined;
  clean = clean.replace(/[<>]/g, "").trim();
  if (!clean) return undefined;
  const limited = clean.slice(0, maxLength);
  return options.lowercase ? limited.toLowerCase() : limited;
}

export function sanitizeClickId(value: unknown): string | undefined {
  const clean = sanitizeAttributionText(value, 255);
  if (!clean) return undefined;
  const safe = clean.replace(/[^a-zA-Z0-9._~-]/g, "");
  return safe || undefined;
}

export function sanitizeInternalPath(value: unknown): string | undefined {
  const clean = sanitizeAttributionText(value, 500);
  if (!clean || !clean.startsWith("/") || clean.startsWith("//") || clean.includes("\\")) {
    return undefined;
  }
  const pathname = clean.split(/[?#]/, 1)[0]?.trim();
  return pathname && pathname.startsWith("/") ? pathname.slice(0, 500) : undefined;
}

export function sanitizeReferrer(value: unknown): string | undefined {
  const clean = sanitizeAttributionText(value, 2_000);
  if (!clean) return undefined;
  try {
    const url = new URL(clean);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    const pathname = url.pathname === "/" ? "" : url.pathname;
    return `${url.protocol}//${url.host.toLowerCase()}${pathname}`.slice(0, 500);
  } catch {
    return undefined;
  }
}

export function referrerHostname(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function isInternalReferrer(value?: string, ownHostname?: string): boolean {
  const hostname = referrerHostname(value);
  if (!hostname) return false;
  const own = ownHostname?.toLowerCase().replace(/^www\./, "");
  if (own && (hostname === own || hostname.endsWith(`.${own}`))) return true;
  return hostname === "saaleweb.de" || hostname.endsWith(".saaleweb.de");
}

function sourceFromReferrer(referrer?: string): AttributionClassification | undefined {
  const hostname = referrerHostname(referrer);
  if (!hostname) return undefined;

  const search = SEARCH_HOSTS.find((item) => item.pattern.test(hostname));
  if (search) return { source: search.source, medium: "organic", channel: "Organic Search" };

  const aiLabel = detectAiReferrer(referrer);
  if (aiLabel) {
    return {
      source: AI_SOURCE_BY_LABEL[aiLabel] || "ai_referral",
      medium: "ai_referral",
      channel: "AI Referral",
    };
  }

  const social = SOCIAL_HOSTS.find((item) => item.pattern.test(hostname));
  if (social) return { source: social.source, medium: "social", channel: "Social" };

  return { source: hostname, medium: "referral", channel: "Referral" };
}

function inferMedium(source: string): string {
  if (SOCIAL_SOURCES.has(source)) return "social";
  if (["chatgpt", "claude", "perplexity", "gemini", "copilot", "meta_ai", "grok", "deepseek", "mistral", "ai_referral"].includes(source)) {
    return "ai_referral";
  }
  return "none";
}

export function classifyChannel(source: string, medium: string): string {
  const normalizedMedium = medium.toLowerCase().replace(/[\s-]+/g, "_");
  if (["cpc", "ppc", "paid", "paid_search", "paidsearch"].includes(normalizedMedium)) return "Paid Search";
  if (["organic", "seo"].includes(normalizedMedium)) return "Organic Search";
  if (["ai", "ai_referral", "llm_referral"].includes(normalizedMedium)) return "AI Referral";
  if (["social", "social_media", "organic_social", "paid_social"].includes(normalizedMedium)) return "Social";
  if (normalizedMedium === "referral") return "Referral";
  if (normalizedMedium === "email") return "Email";
  if (normalizedMedium === "none" && source === "direct") return "Direct";
  if (SOCIAL_SOURCES.has(source)) return "Social";
  return source === "direct" ? "Direct" : "Other";
}

export function classifyAttribution(input: {
  source?: unknown;
  medium?: unknown;
  campaign?: unknown;
  content?: unknown;
  term?: unknown;
  gclid?: unknown;
  fbclid?: unknown;
  msclkid?: unknown;
  referrer?: unknown;
}): AttributionClassification {
  const source = sanitizeAttributionText(input.source, 100, { lowercase: true });
  const medium = sanitizeAttributionText(input.medium, 100, { lowercase: true });
  const hasExplicitUtm = Boolean(
    source ||
      medium ||
      sanitizeAttributionText(input.campaign, 160) ||
      sanitizeAttributionText(input.content, 200) ||
      sanitizeAttributionText(input.term, 200),
  );

  if (hasExplicitUtm) {
    const clickFallback = sanitizeClickId(input.gclid)
      ? { source: "google", medium: "cpc" }
      : sanitizeClickId(input.msclkid)
        ? { source: "bing", medium: "cpc" }
        : sanitizeClickId(input.fbclid)
          ? { source: "facebook", medium: "social" }
          : undefined;
    const referrerFallback = sourceFromReferrer(sanitizeReferrer(input.referrer));
    const explicitSource = source || clickFallback?.source || referrerFallback?.source || "direct";
    const explicitMedium = medium || clickFallback?.medium || referrerFallback?.medium || inferMedium(explicitSource);
    return {
      source: explicitSource,
      medium: explicitMedium,
      channel: classifyChannel(explicitSource, explicitMedium),
    };
  }

  if (sanitizeClickId(input.gclid)) return { source: "google", medium: "cpc", channel: "Paid Search" };
  if (sanitizeClickId(input.msclkid)) return { source: "bing", medium: "cpc", channel: "Paid Search" };
  if (sanitizeClickId(input.fbclid)) return { source: "facebook", medium: "social", channel: "Social" };

  const referrer = sanitizeReferrer(input.referrer);
  return sourceFromReferrer(referrer) || { source: "direct", medium: "none", channel: "Direct" };
}

export function buildAttributionCandidate({
  href,
  referrer,
  ownHostname,
  includeClickIds,
  now = new Date(),
}: {
  href: string;
  referrer?: string;
  ownHostname?: string;
  includeClickIds: boolean;
  now?: Date;
}): AttributionCandidate {
  let url: URL;
  try {
    url = new URL(href, "https://saaleweb.de");
  } catch {
    url = new URL("https://saaleweb.de/");
  }

  const campaign = sanitizeAttributionText(url.searchParams.get("utm_campaign"), 160);
  const content = sanitizeAttributionText(url.searchParams.get("utm_content"), 200);
  const term = sanitizeAttributionText(url.searchParams.get("utm_term"), 200);
  const utmSource = sanitizeAttributionText(url.searchParams.get("utm_source"), 100, { lowercase: true });
  const utmMedium = sanitizeAttributionText(url.searchParams.get("utm_medium"), 100, { lowercase: true });
  const safeReferrer = sanitizeReferrer(referrer);
  const externalReferrer = safeReferrer && !isInternalReferrer(safeReferrer, ownHostname) ? safeReferrer : undefined;
  const gclid = includeClickIds ? sanitizeClickId(url.searchParams.get("gclid")) : undefined;
  const fbclid = includeClickIds ? sanitizeClickId(url.searchParams.get("fbclid")) : undefined;
  const msclkid = includeClickIds ? sanitizeClickId(url.searchParams.get("msclkid")) : undefined;
  const hasCampaignSignal = Boolean(utmSource || utmMedium || campaign || content || term || gclid || fbclid || msclkid);
  const classification = classifyAttribution({
    source: utmSource,
    medium: utmMedium,
    campaign,
    content,
    term,
    gclid,
    fbclid,
    msclkid,
    referrer: externalReferrer,
  });

  return {
    hasExternalSignal: hasCampaignSignal || Boolean(externalReferrer),
    touch: {
      ...classification,
      campaign,
      content,
      term,
      landingPage: sanitizeInternalPath(url.pathname) || "/",
      referrer: externalReferrer,
      gclid,
      fbclid,
      msclkid,
      capturedAt: now.toISOString(),
    },
  };
}

export function isStoredAttributionCurrent(value: StoredAttribution, now = new Date()): boolean {
  if (value.version !== ATTRIBUTION_STORAGE_VERSION) return false;
  const expiresAt = Date.parse(value.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt > now.getTime();
}

export function updateStoredAttribution(
  current: StoredAttribution | undefined,
  candidate: AttributionCandidate,
  now = new Date(),
): StoredAttribution {
  if (!current || !isStoredAttributionCurrent(current, now)) {
    return {
      version: ATTRIBUTION_STORAGE_VERSION,
      expiresAt: new Date(now.getTime() + ATTRIBUTION_TTL_MS).toISOString(),
      first: candidate.touch,
      last: candidate.touch,
    };
  }

  if (!candidate.hasExternalSignal) return current;
  return {
    ...current,
    last: candidate.touch,
  };
}

export function displaySource(source?: string): string | undefined {
  if (!source) return undefined;
  return SOURCE_LABELS[source.toLowerCase()] || source;
}

export function displayChannel(source?: string, channel?: string): string | undefined {
  if (!source && !channel) return undefined;
  if (channel === "Direct" || source === "direct") return "Direct";
  if (channel === "Referral") return "Referral";
  const sourceLabel = displaySource(source);
  return sourceLabel && channel ? `${sourceLabel} / ${channel}` : channel || sourceLabel;
}

export function toAttributionSummary(payload: {
  first: Pick<AttributionTouch, "source" | "medium" | "landingPage" | "campaign">;
  last: Pick<AttributionTouch, "source" | "medium" | "channel" | "campaign">;
  conversionPage?: string;
  deviceCategory?: DeviceCategory;
  captureMode?: AttributionCaptureMode;
}): AttributionNotificationSummary {
  return {
    channel: displayChannel(payload.last.source, payload.last.channel),
    firstSource: payload.first.source,
    firstMedium: payload.first.medium,
    firstLandingPage: payload.first.landingPage,
    lastSource: payload.last.source,
    lastMedium: payload.last.medium,
    campaign: payload.last.campaign || payload.first.campaign,
    conversionPage: payload.conversionPage,
    deviceCategory: payload.deviceCategory,
    captureMode: payload.captureMode,
  };
}
