import { getTranslations, getLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type Solution = { title: string; desc: string };
type TechNote = { title: string; text: string; chips: string[] };

const icons = ["↗", "⌖", "⚙", "∞"];
const solutionSlugs: Record<AppLocale, string[]> = {
  de: [
    "website-entwicklung",
    "seo-optimierung",
    "ki-integration",
    "wartung",
  ],
  en: [
    "web-development",
    "seo-optimization",
    "ai-integration",
    "maintenance",
  ],
  ru: [
    "razrabotka-sajtov",
    "seo-optimizaciya",
    "integraciya-ii",
    "podderzhka",
  ],
};

export async function Services() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations({ locale, namespace: "Services" });
  const techNote = t.raw("techNote") as TechNote;
  const items = (t.raw("solutions") as Solution[]).map((item, i) => ({
    ...item,
    slug: solutionSlugs[locale][i],
    icon: icons[i % icons.length],
  }));

  return (
    <section id="services" className="bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <p className="mx-auto -mt-3 mb-8 max-w-2xl text-center text-[14px] font-semibold text-muted">
          {t("trustLine")}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.slug} delay={(i % 3) * 90} className="h-full">
              <Link
                href={{ pathname: "/leistungen/[slug]", params: { slug: item.slug } }}
                aria-label={`${t("more")}: ${item.title}`}
                className="group block h-full rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-4"
              >
                <article className="card-border-glow h-full rounded-[18px] border border-line bg-white p-7 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-card">
                  <div className="mb-[18px] grid h-[46px] w-[46px] place-items-center overflow-hidden rounded-[13px] bg-brand-soft text-brand-purple transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-dark transition-colors group-hover:text-brand-purple">
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] text-muted">{item.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-purple">
                    {t("more")}{" "}
                    <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-8">
          <div className="rounded-[22px] border border-brand-purple/[0.15] bg-white p-5 shadow-[0_22px_70px_-52px_rgba(139,92,246,0.58)] md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <h3 className="text-xl font-extrabold tracking-tight text-dark">{techNote.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{techNote.text}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {techNote.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-bold text-ink"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
