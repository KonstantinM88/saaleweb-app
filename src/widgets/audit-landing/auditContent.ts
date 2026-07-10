/**
 * Delta 28 — conversion landing page copy for the free website audit.
 * Ad-traffic page (Telegram/Instagram/Facebook/TikTok/LinkedIn), three locales.
 * Written for conversion: short blocks, honest claims, one goal — the form.
 */
import type { AppLocale } from "@/i18n/routing";

export type AuditCard = { title: string; text: string };
export type AuditFaqItem = { q: string; a: string };

export type AuditLandingCopy = {
  metaTitle: string;
  metaDescription: string;
  heroImage: { src: string; alt: string; buttonLabel: string };
  eyebrow: string;
  h1: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustLine: string;
  badges: string[];
  problem: { title: string; cards: AuditCard[] };
  deliverables: { title: string; cards: AuditCard[]; note: string };
  forWhom: { title: string; items: string[] };
  process: { title: string; steps: AuditCard[] };
  trust: { title: string; text: string; projects: { name: string; label: string }[]; linkLabel: string };
  form: {
    title: string;
    subtitle: string;
    labels: { name: string; company: string; website: string; email: string; phone: string; message: string };
    submit: string;
    sending: string;
    successTitle: string;
    successText: string;
    error: string;
    privacyNote: string;
  };
  faqTitle: string;
  faq: AuditFaqItem[];
  final: { title: string; button: string };
};

const COPY: Record<AppLocale, AuditLandingCopy> = {
  de: {
    metaTitle: "Kostenlose Website-Analyse für Unternehmen in Deutschland | SaaleWeb",
    metaDescription:
      "Kostenlose Prüfung Ihrer Website, Instagram-Seite oder Ihres Google-Unternehmensprofils mit 3–5 konkreten Empfehlungen für mehr Vertrauen, Sichtbarkeit und Anfragen.",
    heroImage: {
      src: "/images/audit/audit-hero-de.webp",
      alt: "Kostenlose SaaleWeb Website-Analyse mit Prüfung von SEO, Geschwindigkeit, mobiler Version und Vertrauen",
      buttonLabel: "Anfrage senden",
    },
    eyebrow: "Kostenlose Analyse",
    h1: "Kostenlose Website-Analyse für Unternehmen in Deutschland",
    subtitle:
      "Ich zeige Ihnen 3–5 konkrete Schwachstellen, durch die Ihre Website, Instagram-Seite oder Ihr Google-Unternehmensprofil potenzielle Kunden verlieren kann — und was zuerst verbessert werden sollte.",
    ctaPrimary: "Kostenlose Analyse anfragen",
    ctaSecondary: "Website oder Instagram senden",
    trustLine:
      "Für lokale Unternehmen, Salons, Handwerker, Restaurants, Dienstleister und neue Projekte in Deutschland.",
    badges: ["100 % kostenlos", "Manuell geprüft", "Ohne Verpflichtung", "Antwort in klarer Sprache"],
    problem: {
      title: "Ihre Website kann gut aussehen — und trotzdem keine Anfragen bringen",
      cards: [
        {
          title: "Schwacher erster Eindruck",
          text: "Der erste Bildschirm erklärt nicht in Sekunden, was Sie anbieten und warum man Sie kontaktieren sollte.",
        },
        {
          title: "Zu wenig Vertrauen",
          text: "Keine Referenzen, Bewertungen, echten Fotos oder klare Struktur — Besucher bleiben unsicher und springen ab.",
        },
        {
          title: "Mobil schwach oder langsam",
          text: "Über die Hälfte der Besucher kommt vom Smartphone. Lädt die Seite langsam oder wirkt unübersichtlich, sind sie weg.",
        },
        {
          title: "Unsichtbar für Google & KI-Suche",
          text: "Ohne saubere SEO-, Local-SEO- und GEO/AIO-Struktur erscheinen Sie weder in der lokalen Suche noch in KI-Antworten.",
        },
      ],
    },
    deliverables: {
      title: "Was Sie kostenlos erhalten",
      cards: [
        { title: "Erster Eindruck", text: "Versteht ein neuer Besucher in 5 Sekunden, was Sie anbieten?" },
        { title: "Struktur & CTA", text: "Führt die Seite logisch zur Anfrage — oder verliert sie Besucher unterwegs?" },
        { title: "Mobile Version", text: "Darstellung, Bedienbarkeit und Tempo auf dem Smartphone." },
        { title: "SEO & Local SEO", text: "Grundlagen der Sichtbarkeit bei Google und in der lokalen Suche." },
        { title: "Vertrauen & Conversion", text: "Referenzen, Bewertungen, Kontaktwege und Überzeugungskraft." },
        { title: "Prioritäten-Liste", text: "3–5 konkrete Verbesserungen — sortiert nach Wirkung, nicht nach Aufwand." },
      ],
      note: "Das ist kein automatischer Standardbericht. Ich prüfe Ihre Website oder Seite manuell und gebe verständliche Empfehlungen in klarer Sprache.",
    },
    forWhom: {
      title: "Für wen die kostenlose Analyse geeignet ist",
      items: [
        "Beauty-Salons und Einzelmeister",
        "Bauunternehmen und Handwerker",
        "Restaurants, Cafés und Hotels",
        "Lokale Dienstleister",
        "Freiberufler und Gewerbe",
        "Unternehmen, die mehr Anfragen aus Google und Social Media wollen",
      ],
    },
    process: {
      title: "So läuft die Analyse ab",
      steps: [
        { title: "Sie senden den Link", text: "Website, Instagram, Facebook oder Google-Unternehmensprofil — was Sie haben." },
        { title: "Ich prüfe manuell", text: "Struktur, Vertrauen, mobile Version, SEO-Basis und Conversion-Wege." },
        { title: "Sie erhalten Empfehlungen", text: "3–5 konkrete Punkte, verständlich erklärt und nach Priorität sortiert." },
        { title: "Optional: nächste Schritte", text: "Auf Wunsch besprechen wir, wie SaaleWeb bei Website, SEO oder Verbesserungen helfen kann." },
      ],
    },
    trust: {
      title: "SaaleWeb arbeitet bereits mit lokalen Projekten in Deutschland",
      text: "Beauty, Gastronomie, Bau, Handwerk und Dienstleistungen.",
      projects: [
        { name: "Salon Elen", label: "Beauty · permanent-halle.de" },
        { name: "Neue Liebe", label: "Gastronomie · neueliebe-nebra.de" },
        { name: "SorgfaltBau", label: "Bau · sorgfaltbau.de" },
        { name: "Waldschlösschen", label: "Gastronomie & Events" },
        { name: "Glaserei Schubert", label: "Handwerk" },
      ],
      linkLabel: "Alle Projekte ansehen",
    },
    form: {
      title: "Kostenlose Analyse anfragen",
      subtitle: "Dauert eine Minute. Sie erhalten eine persönliche Antwort — keinen automatischen Bericht.",
      labels: {
        name: "Name",
        company: "Unternehmen / Branche",
        website: "Website, Instagram oder Google-Profil",
        email: "E-Mail",
        phone: "Telefon / WhatsApp / Telegram",
        message: "Was soll geprüft werden?",
      },
      submit: "Kostenlose Analyse anfragen",
      sending: "Wird gesendet…",
      successTitle: "Vielen Dank!",
      successText: "Ich habe Ihre Anfrage erhalten und melde mich nach der Prüfung.",
      error: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt.",
      privacyNote: "Ihre Daten werden nur zur Beantwortung der Anfrage genutzt — kein Newsletter, keine Weitergabe.",
    },
    faqTitle: "Häufige Fragen zur kostenlosen Analyse",
    faq: [
      {
        q: "Ist die Analyse wirklich kostenlos?",
        a: "Ja, vollständig — ohne versteckte Bedingungen und ohne Verpflichtung. Sie ist mein erster Arbeitsnachweis: Sie sehen, wie ich denke, bevor Sie irgendetwas beauftragen.",
      },
      {
        q: "Was kann ich zur Prüfung senden?",
        a: "Eine Website, eine Instagram- oder Facebook-Seite oder Ihr Google-Unternehmensprofil. Auch eine Kombination ist möglich — ich schaue mir an, was für Ihre Kunden am wichtigsten ist.",
      },
      {
        q: "Ist die Analyse geeignet, wenn ich noch keine Website habe?",
        a: "Ja. Dann prüfe ich Ihre vorhandene Präsenz (Instagram oder Google-Profil) und zeige, was eine Website für Ihr Geschäft leisten sollte — mit realistischer Budget-Orientierung.",
      },
      {
        q: "Wie viele Empfehlungen erhalte ich?",
        a: "3–5 konkrete Punkte, sortiert nach Wirkung. Bewusst keine 40-Seiten-Liste: Sie bekommen das, was sich zuerst lohnt — verständlich erklärt.",
      },
      {
        q: "Wird mir danach sofort eine Website verkauft?",
        a: "Nein. Sie erhalten die Empfehlungen ohne Gegenleistung und können sie auch selbst oder mit einem anderen Anbieter umsetzen. Wenn Sie Unterstützung möchten, besprechen wir das gern — die Entscheidung liegt bei Ihnen.",
      },
    ],
    final: {
      title: "Senden Sie Ihre Website oder Seite — ich zeige Ihnen kostenlos, was mehr Anfragen verhindern kann.",
      button: "Kostenlose Analyse anfragen",
    },
  },
  en: {
    metaTitle: "Free Website Audit for Businesses in Germany | SaaleWeb",
    metaDescription:
      "Get a free manual review of your website, Instagram page or Google Business Profile with 3–5 practical recommendations to improve trust, visibility and leads.",
    heroImage: {
      src: "/images/audit/audit-hero-en.webp",
      alt: "Free SaaleWeb website audit covering SEO, speed, mobile usability and trust",
      buttonLabel: "Request Audit",
    },
    eyebrow: "Free audit",
    h1: "Free Website Audit for Businesses in Germany",
    subtitle:
      "I will show you 3–5 specific issues that may be costing you customers on your website, Instagram page or Google Business Profile — and explain what should be improved first.",
    ctaPrimary: "Request a free audit",
    ctaSecondary: "Send website or Instagram",
    trustLine: "For local businesses, salons, trades, restaurants, service providers and new projects in Germany.",
    badges: ["100% free", "Reviewed manually", "No obligations", "Answers in plain language"],
    problem: {
      title: "Your website may look fine — but still fail to bring leads",
      cards: [
        {
          title: "Weak first impression",
          text: "The first screen doesn't explain in seconds what you offer and why someone should contact you.",
        },
        {
          title: "Not enough trust",
          text: "No references, reviews, real photos or clear structure — visitors stay unsure and leave.",
        },
        {
          title: "Weak or slow on mobile",
          text: "More than half of your visitors come from a smartphone. If the page loads slowly or feels cluttered, they're gone.",
        },
        {
          title: "Invisible to Google & AI search",
          text: "Without a clean SEO, local SEO and GEO/AIO structure you appear neither in local search nor in AI answers.",
        },
      ],
    },
    deliverables: {
      title: "What you receive for free",
      cards: [
        { title: "First impression", text: "Does a new visitor understand in 5 seconds what you offer?" },
        { title: "Structure & CTA", text: "Does the page lead logically to an inquiry — or lose visitors along the way?" },
        { title: "Mobile version", text: "Layout, usability and speed on the smartphone." },
        { title: "SEO & local SEO", text: "The foundations of visibility on Google and in local search." },
        { title: "Trust & conversion", text: "References, reviews, contact paths and persuasiveness." },
        { title: "Priority list", text: "3–5 concrete improvements — sorted by impact, not by effort." },
      ],
      note: "This is not an automated generic report. I manually review your website or page and provide clear, practical recommendations.",
    },
    forWhom: {
      title: "Who this free audit is for",
      items: [
        "Beauty salons and independent professionals",
        "Construction companies and trades",
        "Restaurants, cafés and hotels",
        "Local service providers",
        "Freelancers and small businesses",
        "Businesses that want more inquiries from Google and social media",
      ],
    },
    process: {
      title: "How the audit works",
      steps: [
        { title: "You send the link", text: "Website, Instagram, Facebook or Google Business Profile — whatever you have." },
        { title: "I review manually", text: "Structure, trust, mobile version, SEO basics and conversion paths." },
        { title: "You get recommendations", text: "3–5 concrete points, explained clearly and sorted by priority." },
        { title: "Optional: next steps", text: "If you like, we discuss how SaaleWeb can help with a website, SEO or improvements." },
      ],
    },
    trust: {
      title: "SaaleWeb already works with local projects in Germany",
      text: "Beauty, gastronomy, construction, trades and service businesses.",
      projects: [
        { name: "Salon Elen", label: "Beauty · permanent-halle.de" },
        { name: "Neue Liebe", label: "Gastronomy · neueliebe-nebra.de" },
        { name: "SorgfaltBau", label: "Construction · sorgfaltbau.de" },
        { name: "Waldschlösschen", label: "Gastronomy & events" },
        { name: "Glaserei Schubert", label: "Trades" },
      ],
      linkLabel: "See all projects",
    },
    form: {
      title: "Request a free audit",
      subtitle: "Takes one minute. You get a personal answer — not an automated report.",
      labels: {
        name: "Name",
        company: "Business / Industry",
        website: "Website, Instagram or Google profile",
        email: "Email",
        phone: "Phone / WhatsApp / Telegram",
        message: "What should be checked?",
      },
      submit: "Request free audit",
      sending: "Sending…",
      successTitle: "Thank you!",
      successText: "I received your request and will contact you after the review.",
      error: "The request could not be sent. Please try again or contact me directly.",
      privacyNote: "Your data is used only to answer your request — no newsletter, no sharing.",
    },
    faqTitle: "Frequent questions about the free audit",
    faq: [
      {
        q: "Is the audit really free?",
        a: "Yes, completely — no hidden conditions and no obligations. It's my first proof of work: you see how I think before you order anything.",
      },
      {
        q: "What can I send for review?",
        a: "A website, an Instagram or Facebook page, or your Google Business Profile. A combination works too — I look at what matters most for your customers.",
      },
      {
        q: "Is this useful if I do not have a website yet?",
        a: "Yes. Then I review your existing presence (Instagram or Google profile) and show what a website should do for your business — with a realistic budget orientation.",
      },
      {
        q: "How many recommendations will I receive?",
        a: "3–5 concrete points, sorted by impact. Deliberately not a 40-page list: you get what pays off first — explained in plain language.",
      },
      {
        q: "Will you immediately try to sell me a website afterwards?",
        a: "No. You receive the recommendations with no strings attached and can implement them yourself or with another provider. If you'd like support, we can talk — the decision stays with you.",
      },
    ],
    final: {
      title: "Send your website or page — I will show you for free what may be blocking more inquiries.",
      button: "Request a free audit",
    },
  },
  ru: {
    metaTitle: "Бесплатный аудит сайта для бизнеса в Германии | SaaleWeb",
    metaDescription:
      "Бесплатно проверю ваш сайт, Instagram или Google-профиль и покажу 3–5 ошибок, из-за которых бизнес может терять клиентов.",
    heroImage: {
      src: "/images/audit/audit-hero-ru.webp",
      alt: "Бесплатный аудит сайта SaaleWeb с проверкой SEO, скорости, мобильной версии и доверия",
      buttonLabel: "Оставить заявку",
    },
    eyebrow: "Бесплатный аудит",
    h1: "Бесплатный аудит сайта для бизнеса в Германии",
    subtitle:
      "Покажу 3–5 конкретных ошибок, из-за которых ваш сайт, Instagram или Google-профиль могут терять клиентов — и объясню, что можно улучшить в первую очередь.",
    ctaPrimary: "Получить бесплатный аудит",
    ctaSecondary: "Отправить сайт или Instagram",
    trustLine: "Для локального бизнеса, салонов, Handwerker, ресторанов, услуг и новых проектов в Германии.",
    badges: ["100 % бесплатно", "Проверяю вручную", "Без обязательств", "Ответ простым языком"],
    problem: {
      title: "Ваш сайт может выглядеть нормально, но всё равно не приносить заявки",
      cards: [
        {
          title: "Слабый первый экран",
          text: "Посетитель за несколько секунд не понимает, что вы предлагаете и почему стоит обратиться именно к вам.",
        },
        {
          title: "Мало доверия",
          text: "Нет кейсов, отзывов, реальных фотографий и понятной структуры — посетитель сомневается и уходит.",
        },
        {
          title: "Слабый мобильный или медленный",
          text: "Больше половины посетителей заходят со смартфона. Если сайт грузится медленно или выглядит неудобно — они уходят.",
        },
        {
          title: "Невидим для Google и ИИ-поиска",
          text: "Без чистой структуры SEO, Local SEO и GEO/AIO вас нет ни в локальном поиске, ни в ответах ИИ.",
        },
      ],
    },
    deliverables: {
      title: "Что вы получите бесплатно",
      cards: [
        { title: "Первое впечатление", text: "Понимает ли новый посетитель за 5 секунд, что вы предлагаете?" },
        { title: "Структура и CTA", text: "Ведёт ли страница логично к заявке — или теряет посетителей по пути?" },
        { title: "Мобильная версия", text: "Отображение, удобство и скорость на смартфоне." },
        { title: "SEO и Local SEO", text: "Основы видимости в Google и локальном поиске." },
        { title: "Доверие и конверсия", text: "Кейсы, отзывы, контактные пути и убедительность." },
        { title: "Список приоритетов", text: "3–5 конкретных улучшений — по эффекту, а не по трудоёмкости." },
      ],
      note: "Это не автоматический отчёт. Я вручную смотрю ваш сайт или страницу и даю понятные рекомендации простым языком.",
    },
    forWhom: {
      title: "Кому подойдёт бесплатный аудит",
      items: [
        "Салоны красоты и мастера",
        "Строительные фирмы и Handwerker",
        "Рестораны, кафе и отели",
        "Локальные услуги",
        "Freiberufler и малый бизнес",
        "Бизнесы, которые хотят больше заявок из Google и соцсетей",
      ],
    },
    process: {
      title: "Как проходит аудит",
      steps: [
        { title: "Вы отправляете ссылку", text: "Сайт, Instagram, Facebook или Google-профиль — что есть." },
        { title: "Я проверяю вручную", text: "Структуру, доверие, мобильную версию, SEO-базу и пути к заявке." },
        { title: "Вы получаете рекомендации", text: "3–5 конкретных пунктов, понятно и по приоритету." },
        { title: "По желанию — следующие шаги", text: "Обсуждаем, как SaaleWeb может помочь с сайтом, SEO или улучшением текущей страницы." },
      ],
    },
    trust: {
      title: "SaaleWeb уже работает с локальными проектами в Германии",
      text: "Beauty, рестораны, строительство, Handwerk и услуги.",
      projects: [
        { name: "Salon Elen", label: "Beauty · permanent-halle.de" },
        { name: "Neue Liebe", label: "Гастрономия · neueliebe-nebra.de" },
        { name: "SorgfaltBau", label: "Строительство · sorgfaltbau.de" },
        { name: "Waldschlösschen", label: "Гастрономия и события" },
        { name: "Glaserei Schubert", label: "Handwerk" },
      ],
      linkLabel: "Смотреть все проекты",
    },
    form: {
      title: "Получить бесплатный аудит",
      subtitle: "Займёт минуту. Вы получите личный ответ, а не автоматический отчёт.",
      labels: {
        name: "Имя",
        company: "Бизнес / ниша",
        website: "Сайт, Instagram или Google-профиль",
        email: "Email",
        phone: "Телефон / WhatsApp / Telegram",
        message: "Что нужно проверить?",
      },
      submit: "Отправить на бесплатный аудит",
      sending: "Отправляю…",
      successTitle: "Спасибо!",
      successText: "Я получил вашу заявку и свяжусь с вами после проверки.",
      error: "Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь со мной напрямую.",
      privacyNote: "Данные используются только для ответа на заявку — без рассылок и передачи третьим лицам.",
    },
    faqTitle: "Частые вопросы о бесплатном аудите",
    faq: [
      {
        q: "Аудит действительно бесплатный?",
        a: "Да, полностью — без скрытых условий и обязательств. Это моя первая демонстрация работы: вы видите, как я думаю, до того как что-либо заказывать.",
      },
      {
        q: "Что можно отправить на проверку?",
        a: "Сайт, страницу Instagram или Facebook, либо ваш Google-профиль. Можно и комбинацию — я смотрю то, что важнее всего для ваших клиентов.",
      },
      {
        q: "Подходит ли аудит, если у меня ещё нет сайта?",
        a: "Да. Тогда я проверю вашу текущую страницу (Instagram или Google-профиль) и покажу, что сайт должен делать для вашего бизнеса — с реалистичным ориентиром бюджета.",
      },
      {
        q: "Сколько рекомендаций я получу?",
        a: "3–5 конкретных пунктов по степени эффекта. Сознательно не список на 40 страниц: вы получаете то, что окупится в первую очередь, — понятным языком.",
      },
      {
        q: "Вы сразу продаёте сайт после аудита?",
        a: "Нет. Рекомендации вы получаете без встречных условий и можете внедрить их сами или с другим подрядчиком. Если захотите поддержку — обсудим, решение остаётся за вами.",
      },
    ],
    final: {
      title: "Отправьте сайт или страницу — я бесплатно покажу, что мешает получать больше заявок.",
      button: "Получить бесплатный аудит",
    },
  },
};

export function getAuditLandingCopy(locale: AppLocale): AuditLandingCopy {
  return COPY[locale];
}
