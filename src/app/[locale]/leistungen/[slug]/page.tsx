import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname, Link } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { Reveal } from "@/shared/ui/Reveal";
import { Magnetic } from "@/shared/ui/Magnetic";
import { JsonLd } from "@/shared/seo/JsonLd";
import { serviceSchema, breadcrumbSchema, faqPageSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { getContactHref } from "@/shared/lib/contactHref";
import { LocaleSlugsProvider } from "@/features/language-switcher/LocaleSlugsContext";
import { FaqAccordion } from "@/widgets/faq/FaqAccordion";
import { serviceContent } from "@/widgets/service-detail/serviceContent";
import { Phase4LandingPage } from "@/widgets/seo-landing/Phase4LandingPage";
import {
  getSeoServicePage,
  getSeoServiceSlugMapByLocalizedSlug,
  getSeoServiceStaticParams,
} from "@/widgets/seo-landing/phase4Content";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const staticParams = getSeoServiceStaticParams();
  try {
    const rows = (await prisma.serviceTranslation.findMany({
      where: { service: { published: true } },
      select: { locale: true, slug: true },
    })) as { locale: string; slug: string }[];
    const params = [...rows.map((r) => ({ locale: r.locale, slug: r.slug })), ...staticParams];
    const seen = new Set<string>();
    return params.filter((p) => {
      const key = `${p.locale}:${p.slug}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  } catch {
    return staticParams;
  }
}

async function getServiceData(locale: AppLocale, slug: string) {
  try {
    const tr = await prisma.serviceTranslation.findFirst({
      where: { locale, slug },
      include: { service: { include: { translations: true } } },
    });
    if (!tr) return null;
    const languages: Record<string, string> = {};
    const slugs: Record<string, string> = {};
    for (const sib of tr.service.translations) {
      languages[sib.locale] = getPathname({
        locale: sib.locale as AppLocale,
        href: { pathname: "/leistungen/[slug]", params: { slug: sib.slug } },
      });
      slugs[sib.locale] = sib.slug;
    }
    return {
      name: tr.name as string,
      excerpt: (tr.excerpt as string | null) ?? null,
      content: (tr.content as string | null) ?? null,
      coverImage: tr.service.coverImage as string | null,
      languages,
      slugs,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const seoPage = getSeoServicePage(slug, locale);
  const seoSlugMap = getSeoServiceSlugMapByLocalizedSlug(locale, slug);
  if (seoPage && seoSlugMap) {
    const path = getPathname({ locale, href: { pathname: "/leistungen/[slug]", params: { slug } } });
    const languages = Object.fromEntries(
      routing.locales.map((l) => [
        l,
        getPathname({
          locale: l,
          href: { pathname: "/leistungen/[slug]", params: { slug: seoSlugMap[l] } },
        }),
      ]),
    );
    return buildMetadata({
      path: `/leistungen/${seoSlugMap.de}`,
      canonical: path,
      locale,
      title: seoPage.metaTitle,
      description: seoPage.metaDescription,
      eyebrow: seoPage.eyebrow,
      languages,
    });
  }
  const data = await getServiceData(locale, slug);
  if (!data) return {};
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const c = serviceContent(data.slugs.de ?? slug, locale);
  return buildMetadata({
    path: `/leistungen/${data.slugs.de ?? slug}`,
    locale,
    title: `${data.name} — ${tp("servicesLabel")} | SaaleWeb`,
    description: data.excerpt ?? c.tagline,
    eyebrow: data.name,
    image: data.coverImage ?? undefined,
    languages: data.languages,
  });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const seoPage = getSeoServicePage(slug, locale);
  const seoSlugMap = getSeoServiceSlugMapByLocalizedSlug(locale, slug);
  if (seoPage && seoSlugMap) {
    const tp = await getTranslations({ locale, namespace: "Pages" });
    const path = getPathname({ locale, href: { pathname: "/leistungen/[slug]", params: { slug } } });
    const servicesPath = getPathname({ locale, href: "/leistungen" });

    return (
      <Phase4LandingPage
        page={seoPage}
        locale={locale}
        path={path}
        parent={{ name: tp("servicesLabel"), href: "/leistungen", path: servicesPath }}
        schemaKind="service"
        localeSlugs={seoSlugMap}
      />
    );
  }

  const data = await getServiceData(locale, slug);
  if (!data) notFound();

  const tp = await getTranslations({ locale, namespace: "Pages" });
  const t = await getTranslations({ locale, namespace: "ServicesPage" });
  const td = await getTranslations({ locale, namespace: "ServicesPage.detail" });
  const c = serviceContent(data.slugs.de ?? slug, locale);

  const path = getPathname({ locale, href: { pathname: "/leistungen/[slug]", params: { slug } } });
  const servicesPath = getPathname({ locale, href: "/leistungen" });
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const contactHref = getContactHref(locale);
  const pricingHref = getPathname({ locale, href: "/preise" });

  const ctaButton = (
    <Magnetic>
      <a
        href={contactHref}
        className="btn-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] transition-all hover:-translate-y-0.5"
      >
        {td("ctaButton")}
        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
      </a>
    </Magnetic>
  );

  return (
    <LocaleSlugsProvider slugs={data.slugs}>
      <Navbar />
      <JsonLd
        data={[
          serviceSchema({ name: data.name, description: data.excerpt ?? c.tagline, path, locale }),
          breadcrumbSchema([
            { name: tp("home"), path: homePath },
            { name: tp("servicesLabel"), path: servicesPath },
            { name: data.name, path },
          ]),
          faqPageSchema(c.faq),
        ]}
      />

      <main>
        <Breadcrumbs
          items={[
            { name: tp("home"), href: "/" },
            { name: tp("servicesLabel"), href: "/leistungen" },
            { name: data.name },
          ]}
        />

        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden pb-10 pt-6 md:pb-14 md:pt-10">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 340px at 85% 0%, rgba(139,92,246,0.10), transparent 60%), radial-gradient(520px 320px at 5% 6%, rgba(255,79,163,0.08), transparent 58%)",
              }}
            />
          </div>
          <Container>
            <div className="hero-stagger max-w-3xl">
              <span className="eyebrow">{td("detailEyebrow")}</span>
              <h1 className="mt-4 text-[clamp(30px,5vw,54px)] font-bold leading-[1.08] tracking-tight text-dark">
                {data.name}
              </h1>
              <p className="mt-5 max-w-2xl text-[clamp(17px,1.8vw,21px)] text-muted">
                {data.excerpt || c.tagline}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                {ctaButton}
                <Magnetic>
                  <a
                    href={pricingHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-[15px] font-semibold text-dark transition-all hover:border-brand-purple hover:text-brand-purple"
                  >
                    {t("heroCta2")}
                  </a>
                </Magnetic>
              </div>
            </div>

            {data.coverImage && (
              <Reveal delay={100}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.coverImage}
                  alt={data.name}
                  className="mt-10 aspect-[16/8] w-full rounded-[20px] border border-line object-cover"
                />
              </Reveal>
            )}
          </Container>
        </section>

        {/* ---------------- PROBLEM → SOLUTION ---------------- */}
        <section className="py-14 md:py-20">
          <Container>
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <Reveal className="h-full">
                <div className="h-full rounded-[20px] border border-line bg-surface p-7 md:p-9">
                  <h2 className="text-[clamp(20px,2.4vw,26px)] font-bold text-dark">{c.problemTitle}</h2>
                  <p className="mt-4 text-[16px] leading-relaxed text-muted">{c.problem}</p>
                </div>
              </Reveal>
              <Reveal delay={90} className="h-full">
                <div className="relative h-full overflow-hidden rounded-[20px] bg-dark p-7 md:p-9">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(360px 200px at 90% 0%, rgba(255,79,163,0.25), transparent 60%)",
                    }}
                  />
                  <div className="relative">
                    <h2 className="text-[clamp(20px,2.4vw,26px)] font-bold text-white">{c.solutionTitle}</h2>
                    <p className="mt-4 text-[16px] leading-relaxed text-gray-300">{c.solution}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ---------------- WHAT'S INCLUDED ---------------- */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[680px] text-center md:mb-14">
              <span className="eyebrow">{c.includesTitle}</span>
              <h2 className="mt-4 text-[clamp(26px,3.6vw,40px)] font-bold tracking-tight text-dark">
                {c.includesTitle}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {c.includes.map((inc, i) => (
                <Reveal key={i} delay={(i % 2) * 80} className="h-full">
                  <div className="card-border-glow flex h-full gap-4 rounded-[18px] border border-line bg-white p-6">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-purple">
                      <Check size={22} aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-[16.5px] font-bold text-dark">{inc.title}</h3>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{inc.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------------- OUTCOMES + SIDEBAR CTA + DB CONTENT ---------------- */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <Reveal>
                  <span className="eyebrow">{c.outcomesTitle}</span>
                  <h2 className="mt-4 text-[clamp(24px,3.2vw,38px)] font-bold tracking-tight text-dark">
                    {c.outcomesTitle}
                  </h2>
                  <ul className="mt-6 grid gap-3">
                    {c.outcomes.map((o, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-success/10 text-success">
                          <Check size={15} aria-hidden />
                        </span>
                        <span className="text-[15.5px] font-medium text-ink">{o}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {data.content && (
                  <Reveal className="mt-10">
                    <h3 className="text-[clamp(20px,2.4vw,26px)] font-bold tracking-tight text-dark">
                      {td("detailsTitle")}
                    </h3>
                    <div className="markdown mt-4 max-w-none whitespace-pre-line text-[16px] leading-relaxed text-ink">
                      {data.content}
                    </div>
                  </Reveal>
                )}
              </div>

              {/* sticky CTA card */}
              <div>
                <Reveal delay={80}>
                  <div className="sticky top-24 overflow-hidden rounded-[22px] border border-line bg-white p-7 shadow-card">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
                      <Sparkles size={22} aria-hidden />
                    </div>
                    <h3 className="text-[20px] font-bold text-dark">{td("sidebarTitle")}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{td("sidebarText")}</p>
                    <div className="mt-5">{ctaButton}</div>
                    <ul className="mt-5 grid gap-2.5 border-t border-line pt-5">
                      {[t("trust4Label"), t("trust2Label"), t("trust3Label")].map((x) => (
                        <li key={x} className="flex items-center gap-2 text-[14px] text-ink">
                          <Check size={15} className="text-success" aria-hidden />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[680px] text-center md:mb-14">
              <span className="eyebrow">{td("faqTitle")}</span>
              <h2 className="mt-4 text-[clamp(26px,3.6vw,40px)] font-bold tracking-tight text-dark">
                {td("faqTitle")}
              </h2>
            </Reveal>
            <FaqAccordion items={c.faq} />
          </Container>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="py-16 md:py-20">
          <Container>
            <Reveal>
              <div className="relative overflow-hidden rounded-[24px] bg-dark p-8 text-center sm:p-12 md:rounded-[28px] md:p-14">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(600px 320px at 50% 0%, rgba(255,79,163,0.28), transparent 60%), radial-gradient(500px 300px at 85% 100%, rgba(139,92,246,0.26), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <h2 className="text-[clamp(24px,3.2vw,40px)] font-bold tracking-tight text-white">
                    {td("ctaTitle")}
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-[16px] text-gray-400">{td("ctaText")}</p>
                  <div className="mt-7 flex justify-center">{ctaButton}</div>
                  <div className="mt-6">
                    <Link
                      href="/leistungen"
                      className="inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-400 transition-colors hover:text-white"
                    >
                      <ArrowLeft size={15} aria-hidden />
                      {td("backToServices")}
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </LocaleSlugsProvider>
  );
}
