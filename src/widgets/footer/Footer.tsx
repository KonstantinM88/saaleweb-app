import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
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
            <div className="flex items-center gap-2.5 text-[19px] font-bold tracking-tight text-dark">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-brand text-[15px] font-extrabold text-white">
                S
              </span>
              <span>
                Saale
                <span className="bg-brand bg-clip-text text-transparent">Web</span>
              </span>
            </div>
            <p className="mt-4 max-w-[280px] text-[14.5px] text-muted">{t("tagline")}</p>
          </div>

          <FooterCol title={t("services")}>
            {services.map((s, i) => (
              <a key={i} href="#services">{s.title}</a>
            ))}
          </FooterCol>

          <FooterCol title={t("locations")}>
            {siteConfig.locations.map((l) => (
              <a key={l} href="#">{l}</a>
            ))}
          </FooterCol>

          <FooterCol title={t("company")}>
            <Link href="/projekte">{tn("projects")}</Link>
            <Link href="/preise">{tn("pricing")}</Link>
            <a href="#faq">{tn("faq")}</a>
            <a href="#contact">{t("contact")}</a>
          </FooterCol>
        </div>

        <div className="flex flex-wrap justify-between gap-3.5 border-t border-line pt-6 text-[13.5px] text-muted">
          <div>© {new Date().getFullYear()} SaaleWeb · {siteConfig.founder}</div>
          <div>{t("legal")}</div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 font-mono text-[13px] uppercase tracking-[0.08em] text-dark">{title}</h4>
      <div className="grid gap-2.5 text-[14.5px] text-muted [&>a]:transition-colors [&>a:hover]:text-brand-pink">
        {children}
      </div>
    </div>
  );
}
