import { Check } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Reveal } from "@/shared/ui/Reveal";
import { cn } from "@/shared/lib/cn";

export type PricingPlanView = {
  name: string;
  sub: string;
  price: string;
  features: string[];
  featured: boolean;
  examplesTitle?: string;
  examples?: string[];
};

export function PricingPlans({
  plans,
  popularLabel,
  buttonLabel,
  contactHref,
}: {
  plans: PricingPlanView[];
  popularLabel: string;
  buttonLabel: string;
  contactHref: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-stretch gap-5",
        plans.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3",
      )}
    >
      {plans.map((pkg, i) => {
        const featured = pkg.featured;
        const isQuotePrice = !/\d/.test(pkg.price);
        const card = (
          <div
            className={cn(
              "relative flex h-full min-w-0 flex-col rounded-[22px] p-6 transition-all duration-300 sm:p-8",
              featured
                ? "bg-dark text-white"
                : "card-border-glow border border-line bg-white hover:-translate-y-1.5 hover:shadow-lift",
            )}
          >
            {featured && (
              <span className="absolute right-4 top-4 rounded-md bg-brand px-2.5 py-1 font-mono text-[11px] font-semibold text-white">
                {popularLabel}
              </span>
            )}
            <div
              className={cn(
                "font-mono text-[13px] font-semibold uppercase tracking-[0.1em]",
                featured ? "text-brand-pink" : "text-brand-purple",
              )}
            >
              {pkg.name}
            </div>
            {pkg.sub && (
              <div className={cn("mt-1.5 text-sm", featured ? "text-gray-300" : "text-muted")}>
                {pkg.sub}
              </div>
            )}
            <div
              className={cn(
                "mt-5 max-w-full font-extrabold tracking-tight",
                isQuotePrice
                  ? "rounded-2xl border border-brand-purple/[0.14] bg-brand-soft px-4 py-3 text-[clamp(16px,4vw,20px)] leading-snug text-dark shadow-sm [overflow-wrap:anywhere] [text-wrap:balance] hyphens-auto"
                  : "text-[clamp(34px,8vw,40px)] leading-none",
                featured && isQuotePrice && "border-white/[0.14] bg-white/[0.08] text-white",
              )}
            >
              <span className="block min-w-0 max-w-full">{pkg.price}</span>
            </div>

            <ul className="my-5 flex-1 space-y-3">
              {pkg.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-[14.5px]">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  <span className={featured ? "text-gray-200" : "text-ink"}>{f}</span>
                </li>
              ))}
            </ul>

            {pkg.examples?.length ? (
              <div
                className={cn(
                  "mb-5 rounded-2xl border p-3.5",
                  featured
                    ? "border-white/[0.14] bg-white/[0.08]"
                    : "border-brand-purple/[0.14] bg-brand-soft",
                )}
              >
                {pkg.examplesTitle && (
                  <p
                    className={cn(
                      "text-[12px] font-extrabold uppercase tracking-[0.14em]",
                      featured ? "text-brand-pink" : "text-brand-purple",
                    )}
                  >
                    {pkg.examplesTitle}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {pkg.examples.map((item) => (
                    <span
                      key={item}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[12px] font-bold leading-tight",
                        featured
                          ? "border-white/[0.14] bg-white/[0.08] text-gray-100"
                          : "border-white bg-white/[0.85] text-dark shadow-sm",
                      )}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <Button
              href={contactHref}
              variant={featured ? "primary" : i === plans.length - 1 ? "dark" : "ghost"}
              className="w-full"
            >
              {buttonLabel}
            </Button>
          </div>
        );

        return (
          <Reveal key={i} delay={i * 100} className="h-full">
            {featured ? (
              <div className="glow-card h-full shadow-lift transition-transform duration-300 hover:-translate-y-1.5">
                {card}
              </div>
            ) : (
              card
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
