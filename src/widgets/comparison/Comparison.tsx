import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type Row = { feature: string; us: string; them: string };

export function Comparison() {
  const t = useTranslations("Comparison");
  const rows = t.raw("rows") as Row[];

  return (
    <section className="bg-surface py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
        <Reveal>
          <div className="overflow-hidden rounded-[20px] border border-line bg-white shadow-card">
            <div className="grid grid-cols-[1.4fr_1fr_1fr]">
              <div className="bg-surface px-5 py-4 text-sm font-bold text-dark" />
              <div className="bg-brand px-5 py-4 text-sm font-bold text-white">SaaleWeb</div>
              <div className="bg-surface px-5 py-4 text-sm font-bold text-dark">{t("them")}</div>
            </div>
            {rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.4fr_1fr_1fr] text-[15px] ${
                  i < rows.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <div className="px-5 py-4 font-semibold text-ink">{row.feature}</div>
                <div className="flex items-center gap-2 border-l border-line bg-brand-pink/[0.04] px-5 py-4">
                  <span className="text-success">●</span>
                  <span className="font-medium text-ink">{row.us}</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-4 text-muted">
                  <span className="text-gray-400">○</span>
                  {row.them}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
