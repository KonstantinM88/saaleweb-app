import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";

const projects = ["Salon Elen", "Neue Liebe", "Waldschlösschen", "SorgfaltBau", "Glaserei Schubert"];

function Row({ hidden }: { hidden?: boolean }) {
  // Each track repeats the list 3× so it is always wider than the viewport.
  const items = [...projects, ...projects, ...projects];
  return (
    <div className="marquee-track" aria-hidden={hidden}>
      {items.map((p, i) => (
        <div
          key={`${p}-${i}`}
          className="flex shrink-0 items-center gap-2.5 rounded-xl border border-line bg-white px-5 py-3 font-semibold text-gray-700 transition-colors hover:border-brand-purple"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          {p}
        </div>
      ))}
    </div>
  );
}

export function Trust() {
  const t = useTranslations("Trust");
  return (
    <section className="pb-3 pt-8">
      <Container>
        <p className="mb-5 text-center font-mono text-[13px] font-medium uppercase tracking-[0.06em] text-muted">
          {t("label")}
        </p>
      </Container>
      <div className="marquee">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
