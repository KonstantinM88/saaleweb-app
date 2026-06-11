import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { prisma } from "@/lib/prisma";
import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { CtaBanner } from "@/shared/ui/CtaBanner";
import { JsonLd } from "@/shared/seo/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/shared/seo/schema";
import { buildMetadata } from "@/shared/seo/metadata";
import { LocaleSlugsProvider } from "@/features/language-switcher/LocaleSlugsContext";

type Params = { locale: string; slug: string };

export async function generateStaticParams() {
  try {
    const rows = (await prisma.industryTranslation.findMany({
      where: { industry: { published: true } },
      select: { locale: true, slug: true },
    })) as { locale: string; slug: string }[];
    return rows.map((r) => ({ locale: r.locale, slug: r.slug }));
  } catch {
    return [];
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
      languages,
      slugs,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const data = await getIndustryData(locale, slug);
  if (!data) return {};
  const tp = await getTranslations({ locale, namespace: "Pages" });
  return buildMetadata({
    path: `/branchen/${data.slugs.de ?? slug}`,
    locale,
    title: data.name,
    description: data.excerpt ?? undefined,
    eyebrow: tp("industriesLabel"),
    languages: data.languages,
  });
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const data = await getIndustryData(locale, slug);
  if (!data) notFound();

  const tp = await getTranslations({ locale, namespace: "Pages" });
  const path = getPathname({
    locale,
    href: { pathname: "/branchen/[slug]", params: { slug } },
  });
  const homePath = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return (
    <LocaleSlugsProvider slugs={data.slugs}>
      <Navbar />
      <JsonLd
        data={[
          serviceSchema({ name: data.name, description: data.excerpt ?? undefined, path, locale }),
          breadcrumbSchema([
            { name: tp("home"), path: homePath },
            { name: data.name, path },
          ]),
        ]}
      />
      <main>
        <Breadcrumbs
          items={[
            { name: tp("home"), href: "/" },
            { name: tp("industriesLabel") },
            { name: data.name },
          ]}
        />
        <article className="py-12">
          <Container className="max-w-3xl">
            <span className="eyebrow">{tp("industriesLabel")}</span>
            <h1 className="mt-4 text-[clamp(30px,5vw,52px)] font-bold leading-tight tracking-tight text-dark">
              {data.name}
            </h1>
            {data.excerpt && <p className="mt-5 text-xl text-muted">{data.excerpt}</p>}
            {data.content && (
              <div className="prose mt-8 max-w-none whitespace-pre-line text-[16px] leading-relaxed text-ink">
                {data.content}
              </div>
            )}
          </Container>
        </article>
        <CtaBanner />
      </main>
      <Footer />
    </LocaleSlugsProvider>
  );
}
