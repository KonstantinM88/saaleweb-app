import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { CountUp } from "@/shared/ui/CountUp";

type Stat = { value: string; label: string };

export function Founder() {
  const t = useTranslations("Founder");
  const stats = t.raw("stats") as Stat[];

  return (
    <section className="bg-surface py-24">
      <Container>
        <Reveal>
          <div className="grid items-center gap-11 rounded-3xl border border-line bg-white p-8 shadow-card md:grid-cols-[280px_1fr] md:p-11">
            <div className="relative mx-auto grid aspect-square w-full max-w-[260px] place-items-center overflow-hidden rounded-[20px] bg-brand">
              <span className="text-6xl font-extrabold text-white/90">KM</span>
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.3), transparent 55%)",
                }}
              />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.1em] text-brand-purple">
                {t("role")}
              </div>
              <h3 className="mb-3.5 mt-2 text-2xl font-bold text-dark">Konstantin Mykhailov</h3>
              <p className="mb-5 max-w-[560px] text-[15.5px] text-muted">{t("bio")}</p>
              <div className="flex flex-wrap gap-9">
                {stats.map((s, i) => (
                  <div key={i}>
                    <b className="block text-2xl text-dark">
                      <CountUp value={s.value} />
                    </b>
                    <span className="text-[13px] text-muted">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
