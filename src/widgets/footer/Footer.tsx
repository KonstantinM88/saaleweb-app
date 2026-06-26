import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { BrandText, BrandWord } from "@/shared/ui/BrandText";
import { BrandLogo } from "@/shared/ui/BrandLogo";
import { siteConfig } from "@/shared/config/site";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");
  const tn = useTranslations("Nav");
  const ts = useTranslations("Services");
  const services = (ts.raw("items") as { title: string }[]).slice(0, 4);

  return (
    <footer className="border-t border-line bg-surface pb-8 pt-14">
      <Container>
        <div className="mb-11 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="text-dark">
              <BrandLogo size="sm" />
            </div>
            <p className="mt-4 max-w-[280px] text-[14.5px] text-muted">
              <BrandText text={t("tagline")} />
            </p>
          </div>

          <FooterCol title={t("services")}>
            {services.map((s, i) => (
              <a key={i} href="#services">
                {s.title}
              </a>
            ))}
          </FooterCol>

          <FooterCol title={t("locations")}>
            {siteConfig.locations.map((l) => (
              <a key={l} href="#">
                {l}
              </a>
            ))}
          </FooterCol>

          <FooterCol title={t("company")}>
            <Link href="/projekte">{tn("projects")}</Link>
            <Link href="/preise">{tn("pricing")}</Link>
            <a href="#faq">{tn("faq")}</a>
            <Link href="/kontakt">{t("contact")}</Link>
          </FooterCol>
        </div>

        <div className="flex flex-wrap justify-between gap-3.5 border-t border-line pt-6 text-[13.5px] text-muted">
          <div>
            &copy; {new Date().getFullYear()} <BrandWord /> &middot; {siteConfig.founder}
          </div>
          <div>{t("legal")}</div>
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
