import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/cn";

type Pkg = {
  name: string;
  sub: string;
  price: string;
  features: string[];
};

export function Pricing() {
  const t = useTranslations("Pricing");
  const packages = t.raw("packages") as Pkg[];

  return (
    <section id="pricing" className="py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-[620px] text-[clamp(16px,1.6vw,19px)] text-muted">
            {t("lead")}
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {packages.map((pkg, i) => {
            const featured = i === 1;
            return (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col rounded-[22px] p-8 transition-all hover:-translate-y-1.5",
                  featured
                    ? "bg-dark text-white shadow-lift"
                    : "border border-line bg-white hover:shadow-lift",
                )}
              >
                {featured && (
                  <span className="absolute right-4 top-4 rounded-md bg-brand px-2.5 py-1 font-mono text-[11px] font-semibold text-white">
                    {t("popular")}
                  </span>
                )}
                <div className={cn("font-mono text-[13px] font-semibold uppercase tracking-[0.1em]", featured ? "text-brand-pink" : "text-brand-purple")}>
                  {pkg.name}
                </div>
                <div className={cn("mt-1.5 text-sm", featured ? "text-gray-300" : "text-muted")}>
                  {pkg.sub}
                </div>
                <div className="mt-5 text-[40px] font-extrabold tracking-tight">{pkg.price}</div>

                <ul className="my-5 flex-1 space-y-3">
                  {pkg.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-[14.5px]">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" />
                      <span className={featured ? "text-gray-200" : "text-ink"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button href="#contact" variant={featured ? "primary" : i === 2 ? "dark" : "ghost"} className="w-full">
                  {t("button")}
                </Button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
