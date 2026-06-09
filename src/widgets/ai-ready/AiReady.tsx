import { useTranslations } from "next-intl";
import { FileCode2, Network, Braces, Quote } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";

type Feature = { title: string; desc: string };
const engines = ["ChatGPT", "Gemini", "Claude", "Perplexity", "Google AI Overview"];
const icons = [FileCode2, Network, Braces, Quote];

export function AiReady() {
  const t = useTranslations("AiReady");
  const features = t.raw("features") as Feature[];

  return (
    <section className="py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-dark p-10 md:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 300px at 85% 15%, rgba(255,79,163,0.22), transparent 60%), radial-gradient(500px 280px at 10% 90%, rgba(139,92,246,0.22), transparent 60%)",
              }}
            />
            <div className="relative grid items-center gap-11 md:grid-cols-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-brand-pink">
                  {t("eyebrow")}
                </span>
                <h2 className="mt-3 text-[clamp(26px,3.5vw,42px)] font-bold tracking-tight text-white">
                  {t("title")}
                </h2>
                <p className="mt-4 max-w-md text-[clamp(16px,1.6vw,18px)] text-gray-400">
                  {t("lead")}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {engines.map((e) => (
                    <div
                      key={e}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white"
                    >
                      <span className="h-2 w-2 rounded-full bg-brand-pink" />
                      {e}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {features.map((f, i) => {
                  const Icon = icons[i];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.05] px-[18px] py-4"
                    >
                      <Icon size={22} className="shrink-0 text-brand-pink" />
                      <div>
                        <b className="block text-[15px] text-white">{f.title}</b>
                        <span className="text-[13px] text-gray-400">{f.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
