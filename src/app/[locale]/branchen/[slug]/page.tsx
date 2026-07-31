import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { Check, X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
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
import { industryContent } from "@/widgets/industry-detail/industryContent";
import { IndustryGlyph } from "@/widgets/industries-page/IndustryGlyph";
import { Phase4LandingPage } from "@/widgets/seo-landing/Phase4LandingPage";
import { HotelLandingPage } from "@/widgets/industry-premium/HotelLandingPage";
import { RestaurantLandingPage } from "@/widgets/industry-premium/RestaurantLandingPage";
import { ConstructionLandingPage } from "@/widgets/industry-premium/ConstructionLandingPage";
import { BeautyLandingPage } from "@/widgets/industry-premium/BeautyLandingPage";
import { getPremiumIndustry } from "@/widgets/industry-premium/registry";
import {
  getSeoIndustryPage,
  getSeoIndustrySlugMapByLocalizedSlug,
  getSeoIndustryStaticParams,
} from "@/widgets/seo-landing/phase4Content";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  const staticParams = getSeoIndustryStaticParams();
  try {
    const rows = (await prisma.industryTranslation.findMany({
      where: { industry: { published: true } },
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

async function getIndustryData(locale: AppLocale, slug: string) {
  try {
    const tr = await prisma.industryTranslation.findFirst({
      where: { locale, slug },
      include: { industry: { include: { translations: true } } },
    });
    if (!tr) return null;
    const languages: Record<string, string> = {};
    const slugs: Record<string, string> = {};
    for (const sib of tr.industry.translations) {
      languages[sib.locale] = getPathname({
        locale: sib.locale as AppLocale,
        href: { pathname: "/branchen/[slug]", params: { slug: sib.slug } },
      });
      slugs[sib.locale] = sib.slug;
    }
    return {
      name: tr.name as string,
      excerpt: (tr.excerpt as string | null) ?? null,
      content: (tr.content as string | null) ?? null,
      coverImage: tr.industry.coverImage as string | null,
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
  const seoPage = getSeoIndustryPage(slug, locale);
  const seoSlugMap = getSeoIndustrySlugMapByLocalizedSlug(locale, slug);
  if (seoSlugMap) {
    const path = getPathname({ locale, href: { pathname: "/branchen/[slug]", params: { slug } } });
    const languages = Object.fromEntries(
      routing.locales.map((l) => [
        l,
        getPathname({
          locale: l,
          href: { pathname: "/branchen/[slug]", params: { slug: seoSlugMap[l] } },
        }),
      ]),
    );

    const premium = getPremiumIndustry(seoSlugMap.de, locale);
    if (premium) {
      return buildMetadata({
        path: `/branchen/${seoSlugMap.de}`,
        canonical: path,
        locale,
        title: premium.content.metaTitle,
        description: premium.content.metaDescription,
        eyebrow: premium.content.eyebrow,
        languages,
      });
    }

    if (seoPage) {
      return buildMetadata({
        path: `/branchen/${seoSlugMap.de}`,
        canonical: path,
        locale,
        title: seoPage.metaTitle,
        description: seoPage.metaDescription,
        eyebrow: seoPage.eyebrow,
        languages,
      });
    }
  }
  const data = await getIndustryData(locale, slug);
  if (!data) return {};
  const tp = await getTranslations({ locale, namespace: "Pages" });
  const c = industryContent(data.slugs.de ?? slug, data.name, locale);
  return buildMetadata({
    path: `/branchen/${data.slugs.de ?? slug}`,
    locale,
    title: `${data.name} — ${tp("industriesLabel")} | SaaleWeb`,
    description: data.excerpt ?? c.tagline,
    eyebrow: data.name,
    image: data.coverImage ?? undefined,
    languages: data.languages,
  });
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const seoPage = getSeoIndustryPage(slug, locale);
  const seoSlugMap = getSeoIndustrySlugMapByLocalizedSlug(locale, slug);

  const premium = seoSlugMap ? getPremiumIndustry(seoSlugMap.de, locale) : null;
  if (premium && seoSlugMap) {
    const tp = await getTranslations({ locale, namespace: "Pages" });
    const path = getPathname({ locale, href: { pathname: "/branchen/[slug]", params: { slug } } });
    const industriesPath = getPathname({ locale, href: "/branchen" });

    const shared = {
      locale,
      path,
      parent: { name: tp("industriesLabel"), href: "/branchen" as const, path: industriesPath },
      homeLabel: tp("home"),
      localeSlugs: seoSlugMap,
    };

    if (premium.kind === "hotel") {
      return <HotelLandingPage content={premium.content} {...shared} />;
    }

    if (premium.kind === "restaurant") {
      return <RestaurantLandingPage content={premium.content} {...shared} />;
    }

    if (premium.kind === "construction") {
      return <ConstructionLandingPage content={premium.content} {...shared} />;
    }

    return <BeautyLandingPage content={premium.content} {...shared} />;
  }

  if (seoPage && seoSlugMap) {
    const tp = await getTranslations({ locale, namespace: "Pages" });
    const path = getPathname({ locale, href: { pathname: "/branchen/[slug]", params: { slug } } });
    const industriesPath = getPathname({ locale, href: "/branchen" });

    return (
      <Phase4LandingPage
        page={seoPage}
        locale={locale}
        path={path}
        parent={{ name: tp("industriesLabel"), href: "/branchen", path: industriesPath }}
        schemaKind="industry"
        localeSlugs={seoSlugMap}
      />
    );
  }

  const data = await getIndustryData(locale, slug);
  if (!data) notFound();

  const tp = await getTranslations({ locale, namespace: "Pages" });
  const td = await getTranslations({ locale, namespace: "IndustriesPage.detail" });
  const ti = await getTranslations({ locale, namespace: "IndustriesPage" });
  const canonicalSlug = data.slugs.de ?? slug;
  const c = industryContent(canonicalSlug, data.name, locale);

  const path = getPathname({ locale, href: { pathname: "/branchen/[slug]", params: { slug } } });
  const industriesPath = getPathname({ locale, href: "/branchen" });
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
            { name: tp("industriesLabel"), path: industriesPath },
            { name: data.name, path },
          ]),
          faqPageSchema(c.faq),
        ]}
      />

      <main>
        <Breadcrumbs
          items={[
            { name: tp("home"), href: "/" },
            { name: tp("industriesLabel"), href: "/branchen" },
            { name: data.name },
          ]}
        />

        {/* HERO */}
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
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-brand-purple backdrop-blur-sm">
                <IndustryGlyph slug={canonicalSlug} name={data.name} size={15} />
                {td("eyebrow")}
              </span>
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
                    {td("pricingCta")}
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

        {/* PAINS → SOLUTION */}
        <section className="py-14 md:py-20">
          <Container>
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              <Reveal className="h-full">
                <div className="h-full rounded-[20px] border border-line bg-surface p-7 md:p-9">
                  <h2 className="text-[clamp(20px,2.4vw,26px)] font-bold text-dark">{td("painsTitle")}</h2>
                  <ul className="mt-5 grid gap-3">
                    {c.pains.map((p, i) => (
                      <li key={i} className="flex items-start gap-3 text-[15.5px] text-muted">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-red-50 text-red-500">
                          <X size={13} aria-hidden />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={90} className="h-full">
                <div className="relative h-full overflow-hidden rounded-[20px] bg-dark p-7 md:p-9">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(360px 200px at 90% 0%, rgba(255,79,163,0.25), transparent 60%)" }}
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

        {/* FEATURES */}
        <section className="bg-surface py-16 md:py-24">
          <Container>
            <Reveal className="mx-auto mb-10 max-w-[680px] text-center md:mb-14">
              <span className="eyebrow">{c.featuresTitle}</span>
              <h2 className="mt-4 text-[clamp(26px,3.6vw,40px)] font-bold tracking-tight text-dark">
                {c.featuresTitle}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {c.features.map((f, i) => (
                <Reveal key={i} delay={(i % 2) * 80} className="h-full">
                  <div className="card-border-glow flex h-full gap-4 rounded-[18px] border border-line bg-white p-6">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-purple">
                      <Check size={22} aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-[16.5px] font-bold text-dark">{f.title}</h3>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* RESULTS + STICKY CTA + DB CONTENT */}
        <section className="py-16 md:py-24">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <Reveal>
                  <span className="eyebrow">{c.resultsTitle}</span>
                  <h2 className="mt-4 text-[clamp(24px,3.2vw,38px)] font-bold tracking-tight text-dark">
                    {c.resultsTitle}
                  </h2>
                  <ul className="mt-6 grid gap-3">
                    {c.results.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-success/10 text-success">
                          <Check size={15} aria-hidden />
                        </span>
                        <span className="text-[15.5px] font-medium text-ink">{r}</span>
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
                      {[ti("trust4Label"), ti("trust2Label"), ti("trust3Label")].map((x) => (
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

        {/* FAQ */}
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

        {/* FINAL CTA */}
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
                      href="/branchen"
                      className="inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-400 transition-colors hover:text-white"
                    >
                      <ArrowLeft size={15} aria-hidden />
                      {td("backToIndustries")}
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
