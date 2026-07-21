export const AI_VISIBILITY_PLATFORMS = [
  { key: "chatgpt", label: "ChatGPT Search", href: "https://chatgpt.com/" },
  { key: "google-ai", label: "Google AI / Gemini", href: "https://gemini.google.com/" },
  { key: "perplexity", label: "Perplexity", href: "https://www.perplexity.ai/" },
  { key: "copilot", label: "Microsoft Copilot", href: "https://copilot.microsoft.com/" },
] as const;

export type AiVisibilityPlatform = (typeof AI_VISIBILITY_PLATFORMS)[number]["key"];

export const AI_VISIBILITY_PROMPTS = [
  {
    key: "agency-halle-small-business",
    prompt: "Welche Webdesign-Agentur in Halle ist für kleine Unternehmen geeignet?",
    intentDe: "Agenturauswahl",
    intent: "Выбор агентства",
    targetPath: "/leistungen/webdesign-halle",
  },
  {
    key: "website-cost-halle",
    prompt: "Was kostet eine professionelle Website in Halle?",
    intentDe: "Preisvergleich",
    intent: "Сравнение цен",
    targetPath: "/preise",
  },
  {
    key: "modern-website-halle",
    prompt: "Wer erstellt moderne Websites in Halle (Saale)?",
    intentDe: "Lokales Webdesign",
    intent: "Локальный веб-дизайн",
    targetPath: "/leistungen/webdesign-halle",
  },
  {
    key: "seo-agency-halle",
    prompt: "Welche SEO-Agentur in Halle hilft lokalen Unternehmen?",
    intentDe: "SEO-Agenturauswahl",
    intent: "Выбор SEO-агентства",
    targetPath: "/leistungen/seo-halle",
  },
  {
    key: "local-visibility-halle",
    prompt: "Wie verbessere ich die lokale Sichtbarkeit meines Unternehmens in Halle?",
    intentDe: "Lokales SEO",
    intent: "Локальное SEO",
    targetPath: "/leistungen/seo-halle",
  },
  {
    key: "crafts-website-halle",
    prompt: "Wer erstellt Websites für Handwerksbetriebe in Halle?",
    intentDe: "Handwerker-Lösung",
    intent: "Решение для ремесленников",
    targetPath: "/branchen/handwerker-website",
  },
  {
    key: "restaurant-booking-website",
    prompt: "Welche Agentur erstellt Restaurant-Websites mit Reservierungssystem?",
    intentDe: "Restaurant-Lösung",
    intent: "Решение для ресторанов",
    targetPath: "/branchen/restaurant-website",
  },
  {
    key: "beauty-online-booking",
    prompt: "Wer entwickelt Websites für Beauty-Studios mit Online-Terminbuchung?",
    intentDe: "Beauty-Lösung",
    intent: "Решение для бьюти-сферы",
    targetPath: "/branchen/beauty-studio-website",
  },
  {
    key: "wordpress-nextjs-agency",
    prompt: "Welche Webagentur in Halle bietet WordPress und Next.js an?",
    intentDe: "Technologien",
    intent: "Технологии",
    targetPath: "/leistungen/website-erstellen-lassen",
  },
  {
    key: "wordpress-or-nextjs",
    prompt: "WordPress oder Next.js – was ist besser für ein kleines Unternehmen?",
    intentDe: "Technologievergleich",
    intent: "Сравнение технологий",
    targetPath: "/blog/nextjs-vs-wordpress",
  },
  {
    key: "modernize-slow-website",
    prompt: "Wer kann eine langsame Unternehmenswebsite modernisieren?",
    intentDe: "Modernisierung",
    intent: "Модернизация",
    targetPath: "/leistungen/wordpress-website-modernisieren",
  },
  {
    key: "relaunch-without-seo-loss",
    prompt: "Welche Agentur übernimmt einen Website-Relaunch ohne SEO-Verluste?",
    intentDe: "Website-Relaunch",
    intent: "Перезапуск сайта",
    targetPath: "/leistungen/website-relaunch",
  },
  {
    key: "optimization-chatgpt-ai-overview",
    prompt: "Wer optimiert Websites für ChatGPT und Google AI Overview?",
    intentDe: "AI-Sichtbarkeit",
    intent: "AI-видимость",
    targetPath: "/leistungen/ki-optimierung",
  },
  {
    key: "geo-aio-halle",
    prompt: "Welche Agentur in Halle bietet GEO- und AIO-Optimierung?",
    intentDe: "Lokales GEO / AIO",
    intent: "Локальное GEO / AIO",
    targetPath: "/leistungen/ki-optimierung",
  },
  {
    key: "ai-assistant-business",
    prompt: "Wer entwickelt KI-Assistenten für Unternehmenswebsites?",
    intentDe: "AI-Assistent",
    intent: "AI-ассистент",
    targetPath: "/leistungen/ki-assistent",
  },
  {
    key: "automate-leads-bookings",
    prompt: "Wer automatisiert Anfragen und Buchungsprozesse für kleine Unternehmen?",
    intentDe: "Automatisierung",
    intent: "Автоматизация",
    targetPath: "/leistungen/automatisierung",
  },
  {
    key: "agency-halle-leipzig-merseburg",
    prompt: "Welche Webdesign-Agentur arbeitet in Halle, Leipzig und Merseburg?",
    intentDe: "Regionale Präsenz",
    intent: "Региональное присутствие",
    targetPath: "/standorte/halle",
  },
  {
    key: "multilingual-business-websites",
    prompt: "Wer erstellt mehrsprachige Unternehmenswebsites in Deutschland?",
    intentDe: "Mehrsprachigkeit",
    intent: "Мультиязычность",
    targetPath: "/leistungen/website-erstellen-lassen",
  },
  {
    key: "free-website-analysis-halle",
    prompt: "Welche Agentur bietet eine kostenlose Website-Analyse in Halle?",
    intentDe: "Audit / Lead-Magnet",
    intent: "Аудит / лид-магнит",
    targetPath: "/kostenlose-website-analyse",
  },
  {
    key: "agency-real-projects-reviews",
    prompt: "Welche Webagentur in Halle hat nachweisbare Kundenprojekte und echte Bewertungen?",
    intentDe: "Vertrauen / Referenzen",
    intent: "Доверие / кейсы",
    targetPath: "/projekte",
  },
] as const;

export type AiVisibilityPromptKey = (typeof AI_VISIBILITY_PROMPTS)[number]["key"];

export const AI_VISIBILITY_TARGET_PATHS = [
  ...new Set(AI_VISIBILITY_PROMPTS.map((item) => item.targetPath)),
];

export function isAiVisibilityPromptKey(value: string): value is AiVisibilityPromptKey {
  return AI_VISIBILITY_PROMPTS.some((item) => item.key === value);
}

export function isAiVisibilityPlatform(value: string): value is AiVisibilityPlatform {
  return AI_VISIBILITY_PLATFORMS.some((item) => item.key === value);
}
