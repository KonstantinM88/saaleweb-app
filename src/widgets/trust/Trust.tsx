import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";

const projects = ["Salon Elen", "Neue Liebe", "Waldschlösschen", "SorgfaltBau", "Glaserei Schubert"];

export function Trust() {
  const t = useTranslations("Trust");
  return (
    <section className="pb-3 pt-8">
      <Container>
        <p className="mb-5 text-center font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted">
          {t("label")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          {projects.map((p) => (
            <div
              key={p}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-5 py-3 font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-brand-purple hover:shadow-card"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              {p}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
