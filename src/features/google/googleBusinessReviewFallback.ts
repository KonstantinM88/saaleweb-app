import type { AppLocale } from "@/i18n/routing";
import { siteConfig } from "@/shared/config/site";
import type { GoogleBusinessReviewFeed } from "./googleBusinessReviewTypes";

type VerifiedReview = {
  id: string;
  authorName: string;
  originalLocale: AppLocale;
  publishedLabel: Record<AppLocale, string>;
  text: Record<AppLocale, string>;
};

/**
 * Owner-verified copies of the two public Google Business reviews visible in
 * July 2026. They keep the testimonials honest until live Places API access is
 * configured. The German entries are the originals; EN/RU are clearly marked
 * translations in the UI and every card links back to the public profile.
 */
const VERIFIED_REVIEWS: VerifiedReview[] = [
  {
    id: "google-sorgfaltbau-july-2026",
    authorName: "Gheorghi Iabanji",
    originalLocale: "de",
    publishedLabel: {
      de: "Juli 2026 · Google-Rezension",
      en: "July 2026 · Google review",
      ru: "Июль 2026 · отзыв в Google",
    },
    text: {
      de: `Wir sind mit der Zusammenarbeit mit SaaleWeb rundum zufrieden. Von Anfang an wurden unsere Wünsche verstanden und professionell umgesetzt. Unsere neue Website sieht nicht nur hochwertig aus, sondern vermittelt unseren Kunden endlich genau den Eindruck, den wir uns für unser Unternehmen vorgestellt haben.

Besonders schätzen wir die schnelle Kommunikation, die ehrliche Beratung und die vielen eigenen Ideen, die das Projekt deutlich besser gemacht haben. Änderungswünsche wurden immer zügig umgesetzt und wir hatten während des gesamten Projekts einen zuverlässigen Ansprechpartner.

Wir können SaaleWeb jedem Unternehmen empfehlen, das Wert auf Qualität, Zuverlässigkeit und eine moderne Website legt. Vielen Dank für die hervorragende Zusammenarbeit!
SorgfaltBau`,
      en: `We are completely satisfied with our collaboration with SaaleWeb. From the very beginning, our wishes were understood and implemented professionally. Our new website not only looks high-quality, but finally gives our customers exactly the impression we envisioned for our company.

We particularly appreciate the fast communication, honest advice and the many valuable ideas that made the project significantly better. Change requests were always implemented promptly, and we had a reliable point of contact throughout the entire project.

We can recommend SaaleWeb to any company that values quality, reliability and a modern website. Thank you very much for the excellent collaboration!
SorgfaltBau`,
      ru: `Мы полностью довольны сотрудничеством с SaaleWeb. С самого начала наши пожелания были поняты и профессионально реализованы. Наш новый сайт не только выглядит качественно, но и наконец создаёт у клиентов именно то впечатление о компании, к которому мы стремились.

Особенно мы ценим быструю коммуникацию, честные консультации и множество ценных идей, благодаря которым проект стал заметно лучше. Все пожелания по изменениям всегда выполнялись оперативно, а на протяжении всего проекта у нас был надёжный контактный специалист.

Мы можем рекомендовать SaaleWeb любой компании, для которой важны качество, надёжность и современный сайт. Большое спасибо за отличное сотрудничество!
SorgfaltBau`,
    },
  },
  {
    id: "google-salon-elen-july-2026",
    authorName: "Salon Elen",
    originalLocale: "de",
    publishedLabel: {
      de: "Juli 2026 · Google-Rezension",
      en: "July 2026 · Google review",
      ru: "Июль 2026 · отзыв в Google",
    },
    text: {
      de: "Ich bin mit der Zusammenarbeit sehr zufrieden. Von Anfang an wurden alle Wünsche berücksichtigt und professionell umgesetzt. Besonders gefallen haben mir das moderne Design, die einfache Online-Terminbuchung und die schnelle Ladezeit der Website. Auch nach dem Launch wurden Anpassungen schnell erledigt und ich bekomme jederzeit kompetente Unterstützung. Ich kann SaaleWeb uneingeschränkt weiterempfehlen.",
      en: "I am very satisfied with our collaboration. From the very beginning, all my wishes were taken into account and implemented professionally. I especially liked the modern design, the simple online appointment booking and the website's fast loading speed. Adjustments were also completed quickly after launch, and I can always rely on expert support. I can recommend SaaleWeb without reservation.",
      ru: "Я очень довольна сотрудничеством. С самого начала все мои пожелания были учтены и профессионально реализованы. Особенно мне понравились современный дизайн, простая онлайн-запись и быстрая загрузка сайта. Даже после запуска необходимые изменения выполнялись оперативно, и я всегда могу рассчитывать на компетентную поддержку. Я безоговорочно рекомендую SaaleWeb.",
    },
  },
];

export function getVerifiedGoogleReviewFallback(
  locale: AppLocale,
): GoogleBusinessReviewFeed {
  return {
    placeId: siteConfig.googleBusiness.placeId,
    placeName: siteConfig.name,
    rating: 5,
    userRatingCount: 2,
    reviews: VERIFIED_REVIEWS.map((review) => ({
      id: review.id,
      authorName: review.authorName,
      rating: 5,
      text: review.text[locale],
      languageCode: locale,
      relativePublishTime: review.publishedLabel[locale],
      reviewUrl: siteConfig.googleBusiness.placeUrl,
      isTranslated: locale !== review.originalLocale,
    })),
  };
}
