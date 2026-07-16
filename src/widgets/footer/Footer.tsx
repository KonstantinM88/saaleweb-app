import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { BrandText, BrandWord } from "@/shared/ui/BrandText";
import { BrandLogo } from "@/shared/ui/BrandLogo";
import { siteConfig } from "@/shared/config/site";
import { Link } from "@/i18n/navigation";
import { getHomeHref } from "@/shared/lib/localizedPath";
import { NewsletterForm } from "@/widgets/newsletter/NewsletterForm";

const locationLinks = [
  { label: "Halle (Saale)", slug: "halle" },
  { label: "Leipzig", slug: "leipzig" },
  { label: "Merseburg", slug: "merseburg" },
  { label: "Schkeuditz", slug: "schkeuditz" },
  { label: "Delitzsch", slug: "delitzsch" },
  { label: "Saalekreis", slug: "saalekreis" },
];

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("Footer");
  const tn = useTranslations("Nav");
  const ts = useTranslations("Services");
  const tnl = useTranslations("Newsletter");
  const services = (ts.raw("items") as { title: string }[]).slice(0, 4);

  return (
    <footer className="border-t border-line bg-surface pb-8 pt-14">
      <Container>
        <div className="mb-11 grid items-center gap-6 rounded-2xl border border-line bg-white px-6 py-7 md:grid-cols-[1.1fr_1fr] md:px-8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-dark md:text-xl">
              {tnl("title")}
            </h2>
            <p className="mt-2 max-w-md text-[14px] text-muted">{tnl("text")}</p>
          </div>
          <NewsletterForm variant="footer" />
        </div>

        <div className="mb-11 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="text-dark">
              <BrandLogo size="sm" />
            </div>
            <p className="mt-4 max-w-[280px] text-[14.5px] text-muted">
              <BrandText text={t("tagline")} />
            </p>
            <address className="mt-4 text-[13.5px] not-italic leading-relaxed text-muted">
              <a
                href={siteConfig.googleBusiness.placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${siteConfig.name}, ${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.locality} — Google Maps`}
                className="transition hover:text-dark"
              >
                <span className="font-bold text-dark">{siteConfig.name}</span>
                <br />
                {siteConfig.address.street}
                <br />
                {siteConfig.address.postalCode} {siteConfig.address.locality}
                <br />
                {siteConfig.address.country}
              </a>
              <a href={siteConfig.phone.href} className="mt-1.5 block transition hover:text-dark">
                {siteConfig.phone.display}
              </a>
              <a
                href={siteConfig.googleBusiness.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block font-semibold text-[#6D28D9] underline-offset-4 transition hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6D28D9]"
              >
                {t("route")}
              </a>
            </address>
          </div>

          <FooterCol title={t("services")}>
            {services.map((s, i) => (
              <Link key={i} href="/leistungen">
                {s.title}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title={t("locations")}>
            {locationLinks.map((location) => (
              <Link key={location.slug} href={{ pathname: "/standorte/[slug]", params: { slug: location.slug } }}>
                {location.label}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title={t("company")}>
            <Link href="/projekte">{tn("projects")}</Link>
            <Link href="/preise">{tn("pricing")}</Link>
            <Link
              href="/audit"
              className="btn-shine mt-1 inline-flex w-fit items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-[13.5px] font-extrabold !text-white shadow-[0_16px_34px_-22px_rgba(139,92,246,0.85)] transition hover:-translate-y-0.5 hover:!text-white"
            >
              {tn("audit")}
            </Link>
            <a href={`${getHomeHref(locale)}#faq`}>{tn("faq")}</a>
            <Link href="/kontakt">{t("contact")}</Link>
          </FooterCol>
        </div>

        <div className="flex flex-wrap justify-between gap-3.5 border-t border-line pt-6 text-[13.5px] text-muted">
          <div>
            &copy; {new Date().getFullYear()} <BrandWord /> &middot; {siteConfig.founder}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 [&>a]:transition-colors [&>a:hover]:text-brand-pink">
            <Link href="/impressum">{t("imprint")}</Link>
            <span aria-hidden>&middot;</span>
            <Link href="/datenschutz">{t("privacy")}</Link>
            <span aria-hidden>&middot;</span>
            <span>{t("madeIn")}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-[13px] uppercase tracking-[0.08em] text-dark">{title}</h3>
      <div className="grid gap-2.5 text-[14.5px] text-muted [&>a]:transition-colors [&>a:hover]:text-brand-pink">
        {children}
      </div>
    </div>
  );
}
