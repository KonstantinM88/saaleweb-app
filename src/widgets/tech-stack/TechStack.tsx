import { useTranslations } from "next-intl";
import { Zap, TrendingUp, Lock, Layers } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { CodeWindow } from "./CodeWindow";

type Benefit = { title: string; desc: string };
const icons = [Zap, TrendingUp, Lock, Layers];

export function TechStack() {
  const t = useTranslations("TechStack");
  const benefits = t.raw("benefits") as Benefit[];
  const stack = t.raw("stack") as string[];

  return (
    <section className="py-16 md:py-24">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
            {t("title")}
          </h2>
          <p className="mb-7 mt-4 max-w-[560px] text-[clamp(16px,1.6vw,19px)] text-muted">
            {t("lead")}
          </p>
          <div className="flex flex-wrap gap-3">
            {stack.map((s) => (
              <div
                key={s}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-[18px] py-3 text-[15px] font-semibold transition-colors hover:border-brand-purple"
              >
                <i className="h-2 w-2 rounded-sm bg-brand" />
                {s}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-brand-purple/15 bg-brand-soft/60 p-5">
            <h3 className="text-base font-extrabold text-dark">{t("noteTitle")}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{t("noteText")}</p>
          </div>
          <div className="mt-8">
            <CodeWindow />
          </div>
        </Reveal>

        <div className="grid gap-[18px]">
          {benefits.map((b, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={i} delay={i * 70}>
                <div className="flex gap-4">
                  <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-purple">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="mb-0.5 text-base font-bold text-dark">{b.title}</h3>
                    <p className="text-sm text-muted">{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
