import { ArrowRight, Check, Compass, Gauge, Layers3, Link as LinkIcon, MapPin, Search, Sparkles } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs, type Crumb } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { BrandText } from "@/shared/ui/BrandText";
import { JsonLd } from "@/shared/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, localBusinessSchema, serviceSchema } from "@/shared/seo/schema";
import { getContactHref } from "@/shared/lib/contactHref";
import { getAuditHref, getHomeHref } from "@/shared/lib/localizedPath";
import { LocaleSlugsProvider } from "@/features/language-switcher/LocaleSlugsContext";
import type { Phase4Landing, Phase4Link, Phase4SlugMap } from "./phase4Content";

type SchemaKind = "service" | "industry" | "location";

type Props = {
  page: Phase4Landing;
  locale: AppLocale;
  path: string;
  parent?: {
    name: string;
    href?: Crumb["href"];
    path?: string;
  };
  schemaKind: SchemaKind;
  areaServed?: string;
  extraCards?: {
    title: string;
    cards: { title: string; text: string }[];
  };
  localeSlugs?: Phase4SlugMap;
};

const ui = {
  de: {
    home: "Start",
    primaryCta: "Kostenloses Erstgespräch",
    auditCta: "Website analysieren lassen",
    structure: "Struktur",
    flexibleTechnology: "Flexible Technologie",
    process: "Ablauf",
    industries: "Branchen",
    practice: "Praxis",
    aiTitle: "Für KI-Suche optimiert",
    aiText:
      "Unsere Inhalte werden so strukturiert, dass Suchmaschinen und moderne KI-Systeme Zusammenhänge besser erkennen können. Dazu gehören klare Abschnitte, FAQ, interne Links, eindeutige Begriffe und strukturierte Daten.",
    auditEyebrow: "Kostenlose Analyse",
    auditTitle: "Nicht sicher, wo Ihre aktuelle Website steht?",
    auditText:
      "Wir prüfen Performance, SEO, Nutzerführung und technische Basis. Danach wissen Sie klarer, welche nächsten Schritte sinnvoll sind.",
    auditButton: "Kostenlose Website-Analyse anfragen",
    faq: "FAQ",
    faqTitle: "Häufige Fragen",
    searchLabel: "Klare Sucharchitektur",
    visibility: "Sichtbarkeit",
    trust: "Vertrauen",
    inquiries: "Anfragen",
    questions: "Fragen",
    fast: "schnell",
    internal: "intern",
    learnMore: "Mehr erfahren",
    project: "Projekt",
  },
  en: {
    home: "Home",
    primaryCta: "Free first consultation",
    auditCta: "Request website audit",
    structure: "Structure",
    flexibleTechnology: "Flexible technology",
    process: "Process",
    industries: "Industries",
    practice: "Practice",
    aiTitle: "Optimized for AI search",
    aiText:
      "The content is structured so search engines and modern AI systems can understand the business, region, services and proof points more clearly. This includes clear sections, FAQ, internal links, precise entities and structured data.",
    auditEyebrow: "Free analysis",
    auditTitle: "Not sure where your current website stands?",
    auditText:
      "We review performance, SEO, user guidance and the technical foundation. After that you know which next steps are realistic and useful.",
    auditButton: "Request a free website analysis",
    faq: "FAQ",
    faqTitle: "Frequently asked questions",
    searchLabel: "Clear search architecture",
    visibility: "Visibility",
    trust: "Trust",
    inquiries: "Inquiries",
    questions: "questions",
    fast: "fast",
    internal: "internal",
    learnMore: "Learn more",
    project: "Project",
  },
  ru: {
    home: "Главная",
    primaryCta: "Бесплатная консультация",
    auditCta: "Проверить сайт",
    structure: "Структура",
    flexibleTechnology: "Гибкая технология",
    process: "Процесс",
    industries: "Отрасли",
    practice: "Практика",
    aiTitle: "Оптимизировано для ИИ-поиска",
    aiText:
      "Контент структурируется так, чтобы поисковые системы и современные ИИ-сервисы лучше понимали бизнес, регион, услуги и доказательства доверия. Для этого используются понятные разделы, FAQ, внутренние ссылки, точные сущности и структурированные данные.",
    auditEyebrow: "Бесплатный анализ",
    auditTitle: "Не уверены, насколько силён текущий сайт?",
    auditText:
      "Мы проверим скорость, SEO, путь пользователя и техническую основу. После этого будет понятно, какие следующие шаги действительно имеют смысл.",
    auditButton: "Запросить бесплатный анализ сайта",
    faq: "FAQ",
    faqTitle: "Частые вопросы",
    searchLabel: "Понятная поисковая архитектура",
    visibility: "Видимость",
    trust: "Доверие",
    inquiries: "Заявки",
    questions: "вопросов",
    fast: "быстро",
    internal: "внутри",
    learnMore: "Подробнее",
    project: "Проект",
  },
} satisfies Record<AppLocale, Record<string, string>>;

export function Phase4LandingPage({ page, locale, path, parent, schemaKind, areaServed, extraCards, localeSlugs }: Props) {
  const labels = ui[locale];
  const homePath = getHomeHref(locale);
  const contactHref = getContactHref(locale);
  const auditHref = getAuditHref(locale);
  const schema =
    schemaKind === "location"
      ? localBusinessSchema({ areaServed: areaServed ?? page.title })
      : serviceSchema({
          name: page.title,
          description: page.metaDescription,
          path,
          locale,
        });

  const breadcrumbItems = [
    { name: labels.home, path: homePath },
    ...(parent?.path ? [{ name: parent.name, path: parent.path }] : []),
    { name: page.title, path },
  ];

  const uiCrumbs: Crumb[] = [
    { name: labels.home, href: "/" },
    ...(parent ? [{ name: parent.name, href: parent.href }] : []),
    { name: page.title },
  ];

  const content = (
    <>
      <Navbar />
      <JsonLd data={[schema, breadcrumbSchema(breadcrumbItems), faqPageSchema(page.faq)]} />
      <main>
        <Breadcrumbs items={uiCrumbs} />

        <section className="relative overflow-hidden pb-14 pt-8 md:pb-20 md:pt-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,79,163,0.10),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(139,92,246,0.12),transparent_30%),linear-gradient(180deg,#fff_0%,#f7f8fb_100%)]" />
            <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-soft blur-3xl" />
          </div>
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="hero-stagger">
                <span className="eyebrow">{page.eyebrow}</span>
                <h1 className="mt-4 max-w-4xl text-[clamp(34px,5.4vw,64px)] font-extrabold leading-[1.04] tracking-tight text-dark">
                  {page.title}
                </h1>
                <div className="mt-6 grid max-w-2xl gap-4 text-[clamp(17px,1.8vw,20px)] leading-relaxed text-muted">
                  {page.lead.map((paragraph) => (
                    <p key={paragraph}>
                      <BrandText text={paragraph} />
                    </p>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Magnetic>
                    <a
                      href={contactHref}
                      className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(255,79,163,0.72)] transition-all hover:-translate-y-0.5"
                    >
                      {labels.primaryCta}
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a
                      href={auditHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-dark shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:text-brand-purple"
                    >
                      {labels.auditCta}
                    </a>
                  </Magnetic>
                </div>
              </div>

              <Reveal direction="zoom" delay={80}>
                <HeroInsightCard page={page} schemaKind={schemaKind} labels={labels} />
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container>
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <Reveal className="h-full">
                <div className="h-full rounded-[26px] border border-line bg-white p-6 shadow-card md:p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <Search size={21} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-[clamp(24px,3vw,34px)] font-extrabold tracking-tight text-dark">
                    {page.problemTitle}
                  </h2>
                  <ul className="mt-6 grid gap-3">
                    {page.problems.map((problem) => (
                      <li key={problem} className="flex gap-3 rounded-2xl bg-surface p-4 text-[15px] leading-relaxed text-ink">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-pink" />
                        <span>
                          <BrandText text={problem} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={90} className="h-full">
                <div className="relative h-full overflow-hidden rounded-[26px] bg-dark p-6 text-white shadow-[0_40px_90px_-64px_rgba(15,23,42,0.9)] md:p-8">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_0%,rgba(255,79,163,0.26),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(139,92,246,0.25),transparent_34%)]"
                  />
                  <div className="relative">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.10] text-brand-pink ring-1 ring-white/[0.14]">
                      <Sparkles size={21} aria-hidden />
                    </span>
                    <h2 className="mt-5 text-[clamp(24px,3vw,34px)] font-extrabold tracking-tight">
                      {page.solutionTitle}
                    </h2>
                    <div className="mt-5 grid gap-4 text-[16px] leading-relaxed text-gray-300">
                      {page.solution.map((paragraph) => (
                        <p key={paragraph}>
                          <BrandText text={paragraph} />
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <span className="eyebrow">{labels.structure}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
                {page.featuresTitle}
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {page.features.map((feature, index) => (
                <Reveal key={feature.title} delay={(index % 3) * 70} className="h-full">
                  <article className="card-border-glow h-full rounded-[22px] border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_-58px_rgba(139,92,246,0.78)]">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-purple">
                      <Check size={21} aria-hidden />
                    </div>
                    <h3 className="text-[17px] font-extrabold text-dark">{feature.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                      <BrandText text={feature.text} />
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {page.technologyTitle && page.technologyText && (
          <section className="py-16 md:py-24">
            <Container>
              <Reveal>
                <div className="grid gap-8 rounded-[28px] border border-line bg-white p-6 shadow-card md:p-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                  <div>
                    <span className="eyebrow">{labels.flexibleTechnology}</span>
                    <h2 className="mt-4 text-[clamp(26px,3.6vw,42px)] font-extrabold tracking-tight text-dark">
                      {page.technologyTitle}
                    </h2>
                  </div>
                  <div className="text-[16px] leading-relaxed text-ink">
                    <BrandText text={page.technologyText} />
                    <div className="mt-5 flex flex-wrap gap-2.5">
                      {["Next.js", "React", "WordPress", "Java", "Headless CMS", "Custom Solutions"].map((tech) => (
                        <span key={tech} className="rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] font-bold text-dark">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </Container>
          </section>
        )}

        {page.process?.length ? (
          <section className="bg-surface py-16 md:py-24">
            <Container>
              <Reveal className="mx-auto mb-10 max-w-3xl text-center">
                <span className="eyebrow">{labels.process}</span>
                <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
                  {page.processTitle}
                </h2>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-5">
                {page.process.map((step, index) => (
                  <Reveal key={step.title} delay={index * 65} className="h-full">
                    <article className="relative h-full rounded-[22px] border border-line bg-white p-5 shadow-sm">
                      <span className="mb-5 inline-grid h-11 w-11 place-items-center rounded-2xl bg-brand text-sm font-extrabold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-extrabold text-dark">{step.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">
                        <BrandText text={step.text} />
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {extraCards?.cards.length ? (
          <section className="py-16 md:py-24">
            <Container>
              <Reveal className="mx-auto mb-10 max-w-3xl text-center">
                <span className="eyebrow">{labels.industries}</span>
                <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
                  {extraCards.title}
                </h2>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {extraCards.cards.map((card, index) => (
                  <Reveal key={card.title} delay={(index % 4) * 60} className="h-full">
                    <article className="h-full rounded-[22px] border border-line bg-white p-6 shadow-sm">
                      <h3 className="font-extrabold text-dark">{card.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                        <BrandText text={card.text} />
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        {page.cases?.length ? (
          <section className="py-16 md:py-24">
            <Container>
              <Reveal className="mb-9 max-w-3xl">
                <span className="eyebrow">{labels.practice}</span>
                <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
                  {page.casesTitle}
                </h2>
              </Reveal>
              <LinkGrid links={page.cases} variant="case" labels={labels} />
            </Container>
          </section>
        ) : null}

        <section className="bg-surface py-16 md:py-24">
          <Container>
            <div className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <Reveal>
                <div className="rounded-[26px] border border-line bg-white p-6 shadow-card md:p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-purple">
                    <Compass size={21} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-[clamp(26px,3.6vw,40px)] font-extrabold tracking-tight text-dark">
                    {labels.aiTitle}
                  </h2>
                  <p className="mt-4 text-[16px] leading-relaxed text-ink">
                    {labels.aiText}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="rounded-[26px] border border-line bg-white p-6 shadow-card md:p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand-purple">
                    <LinkIcon size={21} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-[clamp(26px,3.6vw,40px)] font-extrabold tracking-tight text-dark">
                    {page.relatedTitle}
                  </h2>
                  <div className="mt-6">
                    <LinkGrid links={page.relatedLinks} compact labels={labels} />
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-[0_34px_100px_-68px_rgba(139,92,246,0.7)] md:p-9">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,79,163,0.12),transparent_32%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.12),transparent_34%)]"
                />
                <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <span className="eyebrow">{labels.auditEyebrow}</span>
                    <h2 className="mt-3 text-[clamp(24px,3.3vw,38px)] font-extrabold tracking-tight text-dark">
                      {labels.auditTitle}
                    </h2>
                    <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
                      {labels.auditText}
                    </p>
                  </div>
                  <a
                    href={auditHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(255,79,163,0.72)] transition-all hover:-translate-y-0.5"
                  >
                    {labels.auditButton}
                    <ArrowRight size={17} aria-hidden />
                  </a>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-3xl text-center">
              <span className="eyebrow">{labels.faq}</span>
              <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight text-dark">
                {labels.faqTitle}
              </h2>
            </Reveal>
            <div className="mx-auto grid max-w-4xl gap-4">
              {page.faq.map((item, index) => (
                <Reveal key={item.q} delay={(index % 3) * 60}>
                  <article className="rounded-[20px] border border-line bg-white p-5 md:p-6">
                    <h3 className="text-[17px] font-extrabold text-dark">{item.q}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      <BrandText text={item.a} />
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 md:py-20">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] bg-dark p-8 text-center md:p-14">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,79,163,0.30),transparent_36%),radial-gradient(circle_at_90%_100%,rgba(139,92,246,0.26),transparent_36%)]"
                />
                <div className="relative mx-auto max-w-3xl">
                  <h2 className="text-[clamp(26px,3.8vw,46px)] font-extrabold tracking-tight text-white">
                    {page.finalTitle}
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-gray-300">
                    <BrandText text={page.finalText} />
                  </p>
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href={contactHref}
                      className="btn-shine inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5"
                    >
                      {labels.primaryCta}
                      <ArrowRight size={17} aria-hidden />
                    </a>
                    <a
                      href={auditHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.08] px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/[0.3] hover:bg-white/[0.12]"
                    >
                      {labels.auditCta}
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );

  if (schemaKind === "location") return content;
  return <LocaleSlugsProvider slugs={localeSlugs ?? { [locale]: page.slug }}>{content}</LocaleSlugsProvider>;
}

function HeroInsightCard({
  page,
  schemaKind,
  labels,
}: {
  page: Phase4Landing;
  schemaKind: SchemaKind;
  labels: (typeof ui)[AppLocale];
}) {
  const Icon = schemaKind === "location" ? MapPin : schemaKind === "industry" ? Layers3 : Gauge;

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-white bg-white/[0.86] p-5 shadow-[0_34px_100px_-62px_rgba(139,92,246,0.75)] backdrop-blur md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,79,163,0.13),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.16),transparent_35%)]"
      />
      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </div>
          <span className="rounded-full border border-line bg-white px-3 py-1.5 font-mono text-xs text-muted">
            saaleweb.de
          </span>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[22px] border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
                <Icon size={23} aria-hidden />
              </span>
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-brand-purple">SEO / GEO / AIO</p>
                <p className="mt-1 text-[18px] font-extrabold text-dark">{labels.searchLabel}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2.5">
              {[labels.visibility, labels.trust, labels.inquiries].map((label, index) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs font-bold text-muted">
                    <span>{label}</span>
                    <span>{index === 0 ? "SEO" : index === 1 ? "UX" : "CRO"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${index === 0 ? 88 : index === 1 ? 82 : 78}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["FAQ", `${page.faq.length} ${labels.questions}`],
              ["Schema", "JSON-LD"],
              ["Mobile", labels.fast],
              ["Links", labels.internal],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-line bg-white/[0.82] p-4">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-brand-purple">{label}</p>
                <p className="mt-1 text-[16px] font-extrabold text-dark">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkGrid({
  links,
  compact = false,
  variant = "link",
  labels,
}: {
  links: Phase4Link[];
  compact?: boolean;
  variant?: "link" | "case";
  labels: (typeof ui)[AppLocale];
}) {
  return (
    <div className={compact ? "grid gap-3" : "grid gap-5 md:grid-cols-2"}>
      {links.map((link, index) => (
        <Reveal key={`${link.href}-${link.label}`} delay={(index % 2) * 70} className="h-full">
          <a
            href={link.href}
            className="group block h-full rounded-[20px] border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple/[0.3] hover:shadow-[0_22px_70px_-54px_rgba(139,92,246,0.74)] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand-purple">
                  {variant === "case" ? labels.project : labels.learnMore}
                </p>
                <h3 className="mt-2 text-[17px] font-extrabold text-dark">{link.label}</h3>
              </div>
              <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-purple transition-transform group-hover:translate-x-0.5">
                <ArrowRight size={16} aria-hidden />
              </span>
            </div>
            {link.description && (
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                <BrandText text={link.description} />
              </p>
            )}
          </a>
        </Reveal>
      ))}
    </div>
  );
}
