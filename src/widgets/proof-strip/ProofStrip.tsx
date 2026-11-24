import { Clock, Languages, MapPin, ShieldCheck, MessageSquareQuote } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/shared/config/site";
import { Container } from "@/shared/ui/Container";

/**
 * Replaces the client-name marquee under the hero. Five verifiable facts in
 * one row: source-linked customer voices, response time, fixed-price model,
 * languages and the Halle base. Current rating/count belongs to the live summary.
 */
export async function ProofStrip() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "ProofStrip" });

  const items = [
    {
      icon: MessageSquareQuote,
      value: t("voices"),
      label: t("googleLink"),
      href: siteConfig.googleBusiness.placeUrl,
    },
    { icon: Clock, value: t("response"), label: t("responseSub") },
    { icon: ShieldCheck, value: t("price"), label: t("priceSub") },
    { icon: Languages, value: t("languages"), label: t("languagesSub") },
    { icon: MapPin, value: t("region"), label: t("regionSub") },
  ];

  return (
    <section aria-label={t("ariaLabel")} className="border-y border-line bg-white/70 py-5 backdrop-blur-xs md:py-6">
      <Container>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          {items.map(({ icon: Icon, value, label, href }) => {
            const body = (
              <>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-purple">
                  <Icon size={17} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-extrabold leading-tight text-dark">{value}</span>
                  <span className="block text-[12px] leading-snug text-muted">{label}</span>
                </span>
              </>
            );
            return (
              <li key={value} className="min-w-0">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl transition-colors hover:text-brand-purple"
                  >
                    {body}
                  </a>
                ) : (
                  <span className="flex items-center gap-3">{body}</span>
                )}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
