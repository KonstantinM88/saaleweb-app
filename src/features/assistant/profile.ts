import type { AppLocale } from "@/i18n/routing";
import type { AssistantChatMessage } from "./knowledge";
import { isExecutableMarkupProbe } from "./policy";

export const ASSISTANT_FUNNEL_STAGES = [
  "DISCOVERY",
  "QUALIFICATION",
  "SOLUTION",
  "PROPOSAL",
  "CONTACT",
  "HANDOFF",
] as const;

export type AssistantFunnelStage = (typeof ASSISTANT_FUNNEL_STAGES)[number];

export type AssistantSalesProfile = {
  name?: string;
  businessType?: string;
  websiteStatus?: "existing" | "new";
  websiteUrl?: string;
  goals: string[];
  features: string[];
  languages: AppLocale[];
  budget?: string;
  timeframe?: string;
  phone?: string;
  email?: string;
  preferredContact?: "phone" | "whatsapp" | "telegram" | "email";
  contactRequested: boolean;
  notes: string[];
};

const BUSINESS_PATTERNS: Array<[RegExp, string]> = [
  [/стоматолог|стоматол|зубн|dental|dentist|zahnarzt|zahnklinik/i, "Dental practice / clinic"],
  [/веб[- ]?студи|webstudio|webagentur|web\s+agency|digital\s+agency/i, "Web agency / digital studio"],
  [/салон|парикмах|косметолог|beauty|friseur|kosmetik|barber/i, "Beauty salon / hairdresser"],
  [/ресторан|кафе|гастроном|restaurant|café|cafe|gastronom/i, "Restaurant / gastronomy"],
  [/строител|ремонт|bauunternehmen|bau |construction/i, "Construction"],
  [/стекол|glaserei|glazier/i, "Glazing / craft business"],
  [/отел|гостини|hotel|pension|guesthouse/i, "Hotel / accommodation"],
  [/недвиж|immobil|real estate/i, "Real estate"],
  [/врач|клиник|медицин|arzt|praxis|clinic|medical/i, "Medical practice"],
  [/юрист|адвокат|anwalt|kanzlei|lawyer|legal/i, "Legal services"],
  [/handwerk|ремесл|мастер|craft/i, "Craft / local services"],
  [/магазин|online[- ]?shop|e-?commerce/i, "E-commerce"],
];

const NEW_WEBSITE_INTENT =
  /(?:напиш|созда|сдела|разработ|запуст|нужен|нужна|хочу)[\p{L}-]*[^\n]{0,70}(?:сайт|лендинг)|(?:write|build|create|launch|need)[^\n]{0,60}(?:website|landing page)|(?:website|landingpage)[^\n]{0,50}(?:erstellen|aufbauen|benötig)/iu;

const GOAL_PATTERNS: Array<[RegExp, string]> = [
  [/заявк|лид|anfragen|leads?|inquir/i, "more qualified inquiries"],
  [/онлайн[- ]?запис|бронир|terminbuch|booking|reservation/i, "more online bookings"],
  [/видимост|google|seo|ranking|sichtbarkeit/i, "better Google visibility"],
  [/ai[- ]?(?:поиск|видим)|ии[- ]?(?:поиск|видим)|geo\/aio|chatgpt|gemini|perplexity|ki-suche/i, "AI-search visibility"],
  [/релонч|редизайн|обнов|relaunch|redesign|modernis/i, "website relaunch"],
  [/имидж|довер|präsent|image|trust/i, "stronger business presentation and trust"],
  [/с нуля|нов(?:ый|ого) сайт|new website|neue website/i, "launch a new website"],
  [NEW_WEBSITE_INTENT, "launch a new website"],
];

const FEATURE_PATTERNS: Array<[RegExp, string]> = [
  [/онлайн[- ]?запис|terminbuch|online booking/i, "online booking"],
  [/календар|calendar|kalender/i, "calendar synchronization"],
  [/crm/i, "CRM integration"],
  [/whatsapp/i, "WhatsApp integration"],
  [/telegram/i, "Telegram integration"],
  [/автоматизац|automation|automatisierung/i, "automation"],
  [/мультиязы|несколько язы|mehrsprach|multilingual|multiple languages|всех язы/i, "multilingual website"],
  [/интернет[- ]?магазин|online[- ]?shop|e-?commerce/i, "online shop"],
  [/local seo|локальн[\p{L}-]* seo|lokal(?:es)? seo/iu, "local SEO"],
  [/\bseo\b/i, "SEO structure"],
  [/geo\/aio|ai[- ]?(?:поиск|видим)|ии[- ]?(?:поиск|видим)|ki-suche/i, "GEO/AIO readiness"],
];

const GENERIC_REPLY = /^(?:да|нет|хочу|хорошо|ок(?:ей)?|ладно|подскажи|предложи|набросай|покажи|weiter|ja|nein|okay|ok|yes|no|show me|tell me|continue)[.!?\s]*$/i;
const AFFIRMATIVE_CONTACT_CONFIRMATION =
  /^(?:да|давайте|хочу|хорошо|ок(?:ей)?|ладно|можно|yes|sure|ok(?:ay)?|ja|gerne|passt|weiter)[.!?\s]*$/i;
const CONTACT_REQUEST = /(?:свяж(?:итесь|ись)|позвон(?:ите|и)|напиш(?:ите|и)\s+(?:мне|нам)|хочу\s+(?:созвон|консультац)|contact\s+me|call\s+me|write\s+to\s+me|kontaktier|rufen\s+sie\s+mich|zurückrufen|callback)/i;

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function emptyAssistantSalesProfile(): AssistantSalesProfile {
  return {
    goals: [],
    features: [],
    languages: [],
    contactRequested: false,
    notes: [],
  };
}

function stringValue(value: unknown, max = 240): string | undefined {
  if (typeof value !== "string") return undefined;
  const clean = value.trim();
  return clean ? clean.slice(0, max) : undefined;
}

function stringArray(value: unknown, maxItems: number): string[] {
  if (!Array.isArray(value)) return [];
  return unique(value.map((item) => stringValue(item, 220)).filter((item): item is string => Boolean(item))).slice(-maxItems);
}

export function readAssistantSalesProfile(value: unknown): AssistantSalesProfile {
  if (!value || typeof value !== "object" || Array.isArray(value)) return emptyAssistantSalesProfile();
  const raw = value as Record<string, unknown>;
  const websiteStatus = raw.websiteStatus === "existing" || raw.websiteStatus === "new" ? raw.websiteStatus : undefined;
  const preferredContact =
    raw.preferredContact === "phone" ||
    raw.preferredContact === "whatsapp" ||
    raw.preferredContact === "telegram" ||
    raw.preferredContact === "email"
      ? raw.preferredContact
      : undefined;
  const languages = Array.isArray(raw.languages)
    ? unique(raw.languages.filter((item): item is AppLocale => item === "de" || item === "en" || item === "ru"))
    : [];

  return {
    name: stringValue(raw.name, 120),
    businessType: stringValue(raw.businessType, 180),
    websiteStatus,
    websiteUrl: stringValue(raw.websiteUrl),
    goals: stringArray(raw.goals, 8),
    features: stringArray(raw.features, 12),
    languages,
    budget: stringValue(raw.budget, 120),
    timeframe: stringValue(raw.timeframe, 120),
    phone: stringValue(raw.phone, 80),
    email: stringValue(raw.email, 180),
    preferredContact,
    contactRequested: raw.contactRequested === true,
    notes: stringArray(raw.notes, 8),
  };
}

function extractPhone(text: string): string | undefined {
  const match = text.match(/(?:\+|00)\d(?:[\s().-]*\d){7,14}/);
  if (!match) return undefined;
  const compact = match[0].replace(/[^\d+]/g, "").replace(/^00/, "+");
  return compact.length >= 9 ? compact : undefined;
}

function extractEmail(text: string): string | undefined {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]?.toLowerCase();
}

function extractUrl(text: string): string | undefined {
  const match = text.match(/(?:https?:\/\/)?(?:www\.)?[a-z0-9](?:[a-z0-9-]*\.)+[a-z]{2,}(?:\/[^\s]*)?/i)?.[0];
  if (!match) return undefined;
  return /^https?:\/\//i.test(match) ? match : `https://${match}`;
}

function extractName(text: string): string | undefined {
  const match = text.match(/(?:меня зовут|my name is|ich hei(?:ß|ss)e)\s+([\p{L}][\p{L}'-]{1,40}(?:\s+[\p{L}][\p{L}'-]{1,40})?)/iu);
  return match?.[1]?.trim();
}

function extractBudget(text: string): string | undefined {
  const match = text.match(/(?:бюджет|budget|etat|investition)\s*(?:около|примерно|bis|до|from|от|:|-)?\s*([^\n,.!?]{1,60})/i);
  return match?.[1]?.trim();
}

function extractTimeframe(text: string): string | undefined {
  const match = text.match(/(?:срок|запуск|timeframe|timeline|launch|termin|fertig)\s*(?:около|примерно|bis|до|:|-)?\s*([^\n,.!?]{1,60})/i);
  return match?.[1]?.trim();
}

function noteFromMessage(text: string): string | undefined {
  if (isExecutableMarkupProbe(text)) return undefined;
  const clean = text.replace(/(?:\+|00)\d(?:[\s().-]*\d){7,14}/g, "[phone]").replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]").trim();
  if (clean.length < 12 || GENERIC_REPLY.test(clean)) return undefined;
  return clean.slice(0, 220);
}

function applyMessage(profile: AssistantSalesProfile, text: string): AssistantSalesProfile {
  const next = readAssistantSalesProfile(profile);
  const phone = extractPhone(text);
  const email = extractEmail(text);
  const websiteUrl = extractUrl(text);
  const name = extractName(text);
  const budget = extractBudget(text);
  const timeframe = extractTimeframe(text);

  for (const [pattern, label] of BUSINESS_PATTERNS) {
    if (pattern.test(text)) {
      next.businessType = label;
      break;
    }
  }

  if (
    /с нуля|нет\s+(?:ещ[ёе]\s+)?сайт|без сайта|from scratch|no website|keine website|noch keine website/i.test(text) ||
    NEW_WEBSITE_INTENT.test(text)
  ) {
    next.websiteStatus = "new";
  } else if (/(?:у\s+(?:меня|нас)\s+)?(?:уже\s+)?есть сайт|existing website|already have a website|bestehende website|website vorhanden/i.test(text)) {
    next.websiteStatus = "existing";
  }

  if (/на всех языках|все языки|all (?:three )?languages|alle (?:drei )?sprachen/i.test(text)) {
    next.languages = ["de", "en", "ru"];
  } else {
    const languages = [...next.languages];
    if (/\bde\b|deutsch|german|немец/i.test(text)) languages.push("de");
    if (/\ben\b|english|англий/i.test(text)) languages.push("en");
    if (/\bru\b|russian|русск/i.test(text)) languages.push("ru");
    next.languages = unique(languages);
  }

  next.goals = unique([...next.goals, ...GOAL_PATTERNS.filter(([pattern]) => pattern.test(text)).map(([, label]) => label)]);
  next.features = unique([...next.features, ...FEATURE_PATTERNS.filter(([pattern]) => pattern.test(text)).map(([, label]) => label)]);
  next.name = name || next.name;
  next.phone = phone || next.phone;
  next.email = email || next.email;
  next.websiteUrl = websiteUrl || next.websiteUrl;
  if (websiteUrl) next.websiteStatus = "existing";
  next.budget = budget || next.budget;
  next.timeframe = timeframe || next.timeframe;
  next.contactRequested =
    next.contactRequested || CONTACT_REQUEST.test(text) || (Boolean(next.phone || next.email) && latestMessageConfirmsContact(text));

  if (/whatsapp/i.test(text)) next.preferredContact = "whatsapp";
  else if (/telegram/i.test(text)) next.preferredContact = "telegram";
  else if (/e-?mail|почт/i.test(text)) next.preferredContact = "email";
  else if (/позвон|call|anrufen|telefon/i.test(text)) next.preferredContact = "phone";

  const note = noteFromMessage(text);
  if (note) next.notes = unique([...next.notes, note]).slice(-8);
  return next;
}

export function updateAssistantSalesProfile(
  current: unknown,
  messages: AssistantChatMessage[],
): AssistantSalesProfile {
  return messages
    .filter((message) => message.role === "user")
    .reduce((profile, message) => applyMessage(profile, message.content), readAssistantSalesProfile(current));
}

export function deriveAssistantFunnelStage(profile: AssistantSalesProfile, hasLead = false): AssistantFunnelStage {
  if (hasLead) return "HANDOFF";
  if (profile.contactRequested && (profile.phone || profile.email)) return "CONTACT";
  const qualificationSignals = [
    profile.businessType,
    profile.websiteStatus,
    profile.goals.length > 0,
    profile.features.length > 0,
    profile.languages.length > 0,
  ].filter(Boolean).length;
  if (profile.budget || profile.timeframe) return "PROPOSAL";
  if (qualificationSignals >= 3) return "SOLUTION";
  if (qualificationSignals >= 1) return "QUALIFICATION";
  return "DISCOVERY";
}

export function latestMessageRequestsContact(text: string): boolean {
  return CONTACT_REQUEST.test(text) || Boolean(extractPhone(text) || extractEmail(text));
}

export function latestMessageConfirmsContact(text: string): boolean {
  return AFFIRMATIVE_CONTACT_CONFIRMATION.test(text.trim());
}

export function assistantSalesMemoryText(
  profile: AssistantSalesProfile,
  stage: AssistantFunnelStage,
  handoffConfirmed: boolean,
): string {
  const lines = [
    `Funnel stage: ${stage}.`,
    `Lead handoff confirmed by the application: ${handoffConfirmed ? "yes" : "no"}.`,
    `Name: ${profile.name || "unknown"}.`,
    `Business type: ${profile.businessType || "unknown"}.`,
    `Website status: ${profile.websiteStatus || "unknown"}.`,
    `Website URL: ${profile.websiteUrl || "unknown"}.`,
    `Goals: ${profile.goals.join(", ") || "unknown"}.`,
    `Requested features: ${profile.features.join(", ") || "unknown"}.`,
    `Languages: ${profile.languages.join(", ") || "unknown"}.`,
    `Budget: ${profile.budget || "unknown"}.`,
    `Timeframe: ${profile.timeframe || "unknown"}.`,
    `Phone: ${profile.phone || "unknown"}.`,
    `Email: ${profile.email || "unknown"}.`,
    `Preferred contact: ${profile.preferredContact || "unknown"}.`,
    `Visitor explicitly requested contact: ${profile.contactRequested ? "yes" : "no"}.`,
    `Relevant visitor notes: ${profile.notes.join(" | ") || "none"}.`,
  ];
  return lines.join("\n");
}
