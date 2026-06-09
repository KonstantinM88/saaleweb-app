import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type Step = { title: string; desc: string };

export function Process() {
  const t = useTranslations("Process");
  const steps = t.raw("steps") as Step[];

  return (
    <section className="py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="relative">
                {i < steps.length - 1 && (
                  <span className="absolute left-[58px] top-[26px] hidden h-px w-[calc(100%-40px)] bg-gradient-to-r from-brand-pink/40 to-brand-purple/40 lg:block" />
                )}
                <div className="relative z-10 mb-5 grid h-[52px] w-[52px] place-items-center rounded-[15px] border border-line bg-white font-mono text-lg font-semibold text-brand-purple shadow-card">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mb-2 text-lg font-bold text-dark">{step.title}</h3>
                <p className="text-sm text-muted">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
