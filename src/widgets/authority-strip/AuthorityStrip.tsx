import { getLocale, getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";

export async function AuthorityStrip() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "AuthorityStrip" });
  const items = t.raw("items") as string[];

  return (
    <section className="bg-white py-8" aria-labelledby="authority-strip-title">
      <Container>
        <Reveal>
          <div className="rounded-[24px] border border-line bg-white/[0.88] p-5 shadow-[0_22px_70px_-54px_rgba(15,23,42,0.55)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2
                id="authority-strip-title"
                className="text-[15px] font-extrabold tracking-tight text-dark md:text-lg"
              >
                {t("title")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-purple/[0.15] bg-brand-soft px-3 py-1.5 text-[12px] font-bold text-[#6D28D9] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-purple/30 hover:bg-white"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
