import {
  Code2,
  Search,
  MapPin,
  Sparkles,
  RefreshCw,
  Gauge,
  Server,
  Wrench,
  Compass,
  type LucideIcon,
} from "lucide-react";

/**
 * Per-service icon + plain-language outcome bullets, keyed by the German
 * canonical slug. Falls back to a generic set when a slug is unknown, so
 * admin-created services still render nicely.
 */
export type ServiceMeta = { icon: LucideIcon; outcomes: Record<string, string[]> };

const ORDER: { match: string[]; icon: LucideIcon; key: string }[] = [
  { key: "web", match: ["website-entwicklung", "web", "entwicklung", "development"], icon: Code2 },
  { key: "seo", match: ["seo-optimierung", "seo", "optimization", "optimierung"], icon: Search },
  { key: "local", match: ["local-seo", "lokales-seo", "local"], icon: MapPin },
  { key: "ai", match: ["ki-integration", "ai", "ki", "integration"], icon: Sparkles },
  { key: "relaunch", match: ["website-relaunch", "relaunch"], icon: RefreshCw },
  { key: "perf", match: ["performance", "speed", "tempo"], icon: Gauge },
  { key: "hosting", match: ["hosting"], icon: Server },
  { key: "care", match: ["wartung", "maintenance", "support"], icon: Wrench },
  { key: "consult", match: ["digitalberatung", "beratung", "consulting", "strategy"], icon: Compass },
];

const OUTCOMES: Record<string, Record<string, string[]>> = {
  web: {
    de: ["Mehr Anfragen über Ihre Seite", "Funktioniert perfekt auf dem Handy", "Sie pflegen Inhalte selbst"],
    en: ["More enquiries through your site", "Flawless on mobile", "You edit content yourself"],
    ru: ["Больше заявок через сайт", "Идеально на телефоне", "Вы сами меняете контент"],
  },
  seo: {
    de: ["Top-Platzierungen bei Google", "Mehr Besucher ohne Werbekosten", "Messbare Ergebnisse"],
    en: ["Top Google rankings", "More visitors without ad spend", "Measurable results"],
    ru: ["Верхние места в Google", "Больше посетителей без рекламы", "Измеримый результат"],
  },
  local: {
    de: ["Gefunden von Kunden vor Ort", "Top bei Google Maps", "Mehr Bewertungen & Anrufe"],
    en: ["Found by local customers", "Top on Google Maps", "More reviews & calls"],
    ru: ["Вас находят местные клиенты", "Топ на Google Maps", "Больше отзывов и звонков"],
  },
  ai: {
    de: ["Empfohlen von ChatGPT & Gemini", "Sichtbar in der KI-Suche", "Vorsprung vor Wettbewerbern"],
    en: ["Recommended by ChatGPT & Gemini", "Visible in AI search", "Ahead of competitors"],
    ru: ["Рекомендуют ChatGPT и Gemini", "Видно в ИИ-поиске", "Опережаете конкурентов"],
  },
  relaunch: {
    de: ["Moderner Auftritt ohne Ranking-Verlust", "Schneller & sicherer", "Bereit für die Zukunft"],
    en: ["Modern look without losing rankings", "Faster & safer", "Future-ready"],
    ru: ["Современный вид без потери позиций", "Быстрее и безопаснее", "Готовность к будущему"],
  },
  perf: {
    de: ["Ladezeit unter 1 Sekunde", "Bessere Google-Bewertung", "Weniger Absprünge"],
    en: ["Load time under 1 second", "Better Google score", "Fewer bounces"],
    ru: ["Загрузка меньше 1 секунды", "Лучшая оценка Google", "Меньше отказов"],
  },
  hosting: {
    de: ["Weltweit blitzschnell", "Sicher & DSGVO-konform", "Kein technischer Aufwand für Sie"],
    en: ["Blazing fast worldwide", "Secure & GDPR-compliant", "No technical hassle for you"],
    ru: ["Молниеносно по всему миру", "Безопасно и по GDPR", "Никаких технических забот"],
  },
  care: {
    de: ["Immer aktuell & sicher", "Schnelle Hilfe bei Fragen", "Laufende Verbesserungen"],
    en: ["Always up to date & secure", "Quick help when you need it", "Ongoing improvements"],
    ru: ["Всегда обновлён и защищён", "Быстрая помощь по вопросам", "Постоянные улучшения"],
  },
  consult: {
    de: ["Klarer Plan für Ihr Wachstum", "Verständlich erklärt", "Sie treffen sichere Entscheidungen"],
    en: ["A clear plan for your growth", "Explained in plain language", "You make confident decisions"],
    ru: ["Понятный план роста", "Объясняем простым языком", "Уверенные решения"],
  },
};

const GENERIC: Record<string, string[]> = {
  de: ["Mehr Sichtbarkeit", "Mehr Anfragen", "Verständlich umgesetzt"],
  en: ["More visibility", "More enquiries", "Clearly delivered"],
  ru: ["Больше видимости", "Больше заявок", "Понятная реализация"],
};

export function serviceMeta(slug: string, fallbackIndex: number): {
  icon: LucideIcon;
  outcomes: (locale: string) => string[];
} {
  const s = slug.toLowerCase();
  const hit =
    ORDER.find((o) => o.match.includes(s)) ??
    ORDER.find((o) => o.match.some((m) => s.includes(m))) ??
    ORDER[fallbackIndex % ORDER.length];
  return {
    icon: hit.icon,
    outcomes: (locale: string) => OUTCOMES[hit.key]?.[locale] ?? GENERIC[locale] ?? GENERIC.de,
  };
}
