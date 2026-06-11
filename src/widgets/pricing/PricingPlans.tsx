import { Check } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/cn";

export type PricingPlanView = {
  name: string;
  sub: string;
  price: string;
  features: string[];
  featured: boolean;
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
    <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
      {plans.map((pkg, i) => {
        const featured = pkg.featured;
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
            <div className="mt-5 text-[40px] font-extrabold tracking-tight">{pkg.price}</div>

            <ul className="my-5 flex-1 space-y-3">
              {pkg.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-[14.5px]">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" />
                  <span className={featured ? "text-gray-200" : "text-ink"}>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              href={contactHref}
              variant={featured ? "primary" : i === plans.length - 1 ? "dark" : "ghost"}
              className="w-full"
            >
              {buttonLabel}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
