import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { AppLocale } from "@/i18n/routing";
import { HOMEPAGE_CACHE_SECONDS, HOMEPAGE_CACHE_TAGS } from "./cache";

export type HomepageFaqItem = { q: string; a: string };

// Exact pre-November-17 defaults only. Replace these outdated templates with
// the reviewed translations; a separately edited CMS answer remains authoritative.
const legacyAnswers = new Set<string>([
  "Ja. Technisches SEO, saubere Seitenstruktur, schnelle Ladezeiten, Meta-Daten und strukturierte Daten gehören von Anfang an dazu. So werden Sie bei Google in Halle, Leipzig und Umgebung gefunden — auf Wunsch ergänzen wir zusätzliche SEO-Landingpages für einzelne Leistungen.",
  "GEO (Generative Engine Optimization) und AIO (AI Optimization) sorgen dafür, dass KI-Systeme wie ChatGPT, Gemini, Claude und Perplexity Ihr Unternehmen verstehen, korrekt zitieren und weiterempfehlen. Dafür strukturieren wir Inhalte semantisch, ergänzen strukturierte Daten nach Schema.org und beantworten echte Kundenfragen direkt auf der Website.",
  "KI-Suchsysteme bevorzugen Websites mit klaren Fakten: wer Sie sind, was Sie anbieten, wo Sie arbeiten und was es kostet. Genau diese Informationen bereiten wir maschinenlesbar auf — mit FAQ-Bereichen, LocalBusiness-Daten und eindeutigen Leistungsseiten. So steigt die Chance, dass KI-Antworten Ihr Unternehmen nennen.",
  "Ja. Impressum, Datenschutzerklärung, SSL-Verschlüsselung und europäische Hosting-Optionen gehören zum Standard. Unsere cookielose Besucherstatistik kommt ohne Cookie-Banner aus — das verbessert Nutzererlebnis und Conversion.",
  "Yes. Technical SEO, a clean page structure, fast load times, meta data and structured data are part of every project from the start. That's how you get found on Google in Halle, Leipzig and the region — and we can add dedicated SEO landing pages for individual services.",
  "GEO (Generative Engine Optimization) and AIO (AI Optimization) make sure AI systems like ChatGPT, Gemini, Claude and Perplexity understand, correctly cite and recommend your business. We structure content semantically, add Schema.org structured data and answer real customer questions directly on the website.",
  "AI search systems prefer websites with clear facts: who you are, what you offer, where you work and what it costs. We prepare exactly this information in machine-readable form — with FAQ sections, LocalBusiness data and unambiguous service pages. That raises the chance that AI answers mention your business.",
  "Yes. Legal notice, privacy policy, SSL encryption and European hosting options are standard. Our cookieless visitor statistics work without a cookie banner — which improves user experience and conversion.",
  "Да. Техническое SEO, чистая структура страниц, быстрая загрузка, мета-данные и структурированные данные — часть каждого проекта с первого дня. Так вас находят в Google в Галле, Лейпциге и регионе, а при необходимости мы добавляем отдельные SEO-лендинги под конкретные услуги.",
  "GEO (Generative Engine Optimization) и AIO (AI Optimization) делают так, чтобы ИИ-системы — ChatGPT, Gemini, Claude, Perplexity — понимали ваш бизнес, корректно цитировали и рекомендовали его. Для этого мы семантически структурируем контент, добавляем разметку Schema.org и отвечаем на реальные вопросы клиентов прямо на сайте.",
  "ИИ-поиск предпочитает сайты с ясными фактами: кто вы, что предлагаете, где работаете и сколько это стоит. Именно эту информацию мы оформляем в машиночитаемом виде — FAQ-разделы, данные LocalBusiness, однозначные страницы услуг. Это повышает шанс, что ИИ-ответы назовут именно ваш бизнес.",
  "Да. Impressum, политика конфиденциальности, SSL-шифрование и европейские варианты хостинга — стандарт. Наша аналитика без cookies обходится без cookie-баннера — это улучшает пользовательский опыт и конверсию."
]);

const readCachedDbFaq = unstable_cache(
  async (locale: AppLocale): Promise<HomepageFaqItem[]> => {
    const rows = await prisma.faq.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { translations: { where: { locale }, take: 1 } },
    });
    return rows.flatMap((row) => {
      const tr = row.translations[0];
      return tr ? [{ q: tr.question, a: tr.answer }] : [];
    });
  },
  ["homepage-faq-items"],
  { revalidate: HOMEPAGE_CACHE_SECONDS, tags: [HOMEPAGE_CACHE_TAGS.faq] },
);

/** One request-memoized source for visible FAQ and its FAQPage schema. */
export const getHomepageFaqItems = cache(async (locale: AppLocale): Promise<HomepageFaqItem[]> => {
  const t = await getTranslations({ locale, namespace: "Faq" });
  const fallback = t.raw("items") as HomepageFaqItem[];
  try {
    const dbItems = await readCachedDbFaq(locale);
    if (dbItems.length < fallback.length) return fallback;
    const reviewed = new Map(fallback.map((item) => [item.q, item]));
    return dbItems.map((item) => legacyAnswers.has(item.a) ? reviewed.get(item.q) ?? item : item);
  } catch {
    return fallback;
  }
});
