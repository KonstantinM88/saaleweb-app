import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { CheckCircle2, MailX, AlertTriangle } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { Container } from "@/shared/ui/Container";
import { NewsletterForm } from "@/widgets/newsletter/NewsletterForm";

export const dynamic = "force-dynamic";

type Params = { locale: string };
type Search = { status?: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Newsletter" });
  return {
    title: t("pageTitle"),
    robots: { index: false, follow: true },
  };
}

export default async function NewsletterStatusPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const { status } = await searchParams;
  const t = await getTranslations({ locale, namespace: "Newsletter" });

  const known = status === "confirmed" || status === "unsubscribed" || status === "invalid";

  return (
    <>
      <Navbar />
      <main>
        <Container>
          <div className="mx-auto max-w-xl pb-24 pt-16 text-center md:pb-32 md:pt-24">
            {known ? (
              <>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface">
                  {status === "confirmed" ? (
                    <CheckCircle2 className="h-7 w-7 text-brand-purple" aria-hidden />
                  ) : status === "unsubscribed" ? (
                    <MailX className="h-7 w-7 text-muted" aria-hidden />
                  ) : (
                    <AlertTriangle className="h-7 w-7 text-brand-pink" aria-hidden />
                  )}
                </div>
                <h1 className="mt-6 text-2xl font-semibold tracking-tight text-dark md:text-3xl">
                  {t(`${status}Title`)}
                </h1>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
                  {t(`${status}Text`)}
                </p>
                {status === "invalid" ? (
                  <div className="mt-8 flex justify-center">
                    <NewsletterForm variant="banner" />
                  </div>
                ) : (
                  <div className="mt-8">
                    <Link
                      href="/"
                      className="inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple px-6 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      {t("backHome")}
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="font-mono text-[13px] uppercase tracking-[0.08em] text-brand-pink">
                  {t("eyebrow")}
                </p>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight text-dark md:text-3xl">
                  {t("title")}
                </h1>
                <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{t("text")}</p>
                <div className="mt-8 flex justify-center">
                  <NewsletterForm variant="banner" />
                </div>
              </>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
