import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";

const projects = [
  { name: "Salon Elen", mark: "SE" },
  { name: "Neue Liebe", mark: "NL" },
  { name: "Waldschlösschen", mark: "WS" },
  { name: "SorgfaltBau", mark: "SB" },
  { name: "Glaserei Schubert", mark: "GS" },
];

function Row({ hidden }: { hidden?: boolean }) {
  // Each track repeats the list 3× so it is always wider than the viewport.
  const items = [...projects, ...projects, ...projects];
  return (
    <div className="marquee-track" aria-hidden={hidden}>
      {items.map((p, i) => (
        <div
          key={`${p.name}-${i}`}
          className="group flex shrink-0 items-center gap-3 rounded-2xl border border-line bg-white/90 px-5 py-3 font-semibold text-gray-700 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-purple/30 hover:shadow-[0_22px_52px_-34px_rgba(139,92,246,0.55)]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft font-mono text-[11px] font-extrabold text-brand-purple transition-all duration-300 group-hover:bg-brand group-hover:text-white">
            {p.mark}
          </span>
          {p.name}
        </div>
      ))}
    </div>
  );
}

export function Trust() {
  const t = useTranslations("Trust");
  return (
    <section className="pb-6 pt-2 md:pb-8">
      <Container>
        <p className="mb-5 text-center font-mono text-[13px] font-bold uppercase tracking-[0.11em] text-brand-purple">
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
