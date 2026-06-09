import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";

type Item = { title: string; desc: string };
const icons = ["⌘", "↗", "⌖", "✦", "⟳", "⚡", "☁", "⛭", "◎"];

export function Services() {
  const t = useTranslations("Services");
  const items = t.raw("items") as Item[];

  return (
    <section id="services" className="bg-surface py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[clamp(16px,1.6vw,19px)] text-muted">
            {t("lead")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <article
              key={i}
              className="rounded-[18px] border border-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-card"
            >
              <div className="mb-[18px] grid h-[46px] w-[46px] place-items-center rounded-[13px] bg-brand-soft text-brand-purple">
                {icons[i]}
              </div>
              <h3 className="mb-2 text-lg font-bold text-dark">{item.title}</h3>
              <p className="text-[14.5px] text-muted">{item.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-purple">
                {t("more")} →
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
