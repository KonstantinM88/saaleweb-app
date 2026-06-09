import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { cn } from "@/shared/lib/cn";

type Item = { tag: string; title: string; desc: string; result: string; name: string };

const covers = [
  "bg-brand",
  "bg-gradient-to-br from-sky-500 to-brand-purple",
  "bg-gradient-to-br from-amber-500 to-brand-pink",
];

export function CaseStudies() {
  const t = useTranslations("CaseStudies");
  const items = t.raw("items") as Item[];

  return (
    <section id="cases" className="py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 80}>
              <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white transition-all hover:-translate-y-1.5 hover:border-transparent hover:shadow-lift">
                <div className={cn("relative h-[150px]", covers[i])}>
                  <span className="absolute bottom-3.5 left-4 text-xl font-bold tracking-tight text-white">
                    {item.name}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-[18px]">
                  <span className="mb-2.5 w-fit rounded-md bg-brand-soft px-2 py-1 font-mono text-[11px] font-semibold text-brand-purple">
                    {item.tag}
                  </span>
                  <h3 className="mb-1.5 text-lg font-bold text-dark">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-3.5">
                    <b className="text-[22px] text-success">{item.result}</b>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-purple">
                      {t("link")} <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
