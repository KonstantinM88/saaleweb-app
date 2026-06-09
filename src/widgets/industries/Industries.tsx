import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type Item = { name: string; desc: string };
const emojis = ["🏨", "🍽️", "💇", "🏗️", "🔧", "🩺", "🏠", "⚖️"];

export function Industries() {
  const t = useTranslations("Industries");
  const items = t.raw("items") as Item[];

  return (
    <section id="industries" className="bg-surface py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="group h-full rounded-2xl border border-line bg-white p-5 text-center transition-all hover:-translate-y-1 hover:bg-dark">
                <span className="mb-3 block text-2xl">{emojis[i]}</span>
                <h3 className="mb-1 text-[15.5px] font-bold text-dark transition-colors group-hover:text-white">
                  {item.name}
                </h3>
                <p className="text-[12.5px] text-muted transition-colors group-hover:text-gray-300">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
