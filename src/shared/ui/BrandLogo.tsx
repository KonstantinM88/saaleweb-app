import { BrandWord } from "./BrandText";
import { cn } from "@/shared/lib/cn";

type BrandLogoVariant = "horizontal" | "icon";
type BrandLogoSize = "sm" | "md" | "lg";
type BrandLogoTone = "light" | "dark" | "mono";

const markSizes: Record<BrandLogoSize, string> = {
  sm: "h-8 w-8 rounded-[11px]",
  md: "h-10 w-10 rounded-[14px]",
  lg: "h-14 w-14 rounded-[18px]",
};

const wordSizes: Record<BrandLogoSize, string> = {
  sm: "text-[18px]",
  md: "text-[22px]",
  lg: "text-[30px]",
};

const toneClasses: Record<BrandLogoTone, string> = {
  light: "brand-mark-gradient text-white",
  dark: "brand-mark-gradient text-white",
  mono: "bg-dark text-white shadow-[0_12px_28px_-18px_rgba(17,24,39,0.7)]",
};

export function BrandLogo({
  variant = "horizontal",
  size = "md",
  tone = "light",
  animated = false,
  className,
  wordClassName,
}: {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  tone?: BrandLogoTone;
  animated?: boolean;
  className?: string;
  wordClassName?: string;
}) {
  return (
    <span
      className={cn(
        "brand-logo inline-flex items-center gap-3.5 align-middle",
        variant === "icon" && "gap-0",
        className,
      )}
    >
      <span
        className={cn(
          "brand-logo-mark relative grid shrink-0 place-items-center overflow-hidden transition-all duration-300",
          markSizes[size],
          toneClasses[tone],
          animated && "brand-logo-intro",
        )}
        aria-hidden="true"
      >
        <BrandMonogram />
      </span>
      {variant === "horizontal" ? (
        <BrandWord
          className={cn(
            "font-extrabold leading-none tracking-tight text-dark",
            tone === "dark" && "text-white",
            wordSizes[size],
            wordClassName,
          )}
        />
      ) : null}
    </span>
  );
}

export function BrandMonogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="SaaleWeb"
      className={cn("h-full w-full", className)}
    >
      <path
        d="M42.8 16.6C37.3 10.8 24.8 12.2 20.9 20.4C15.3 32 44.4 27.8 42.5 40.4C40.8 51.9 25 53.2 17.4 44.1"
        fill="none"
        stroke="rgba(17,24,39,0.22)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="9.4"
        transform="translate(1.2 1.5)"
      />
      <path
        d="M42.8 16.6C37.3 10.8 24.8 12.2 20.9 20.4C15.3 32 44.4 27.8 42.5 40.4C40.8 51.9 25 53.2 17.4 44.1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8.2"
      />
      <path
        d="M39.5 15.1C33.5 12.4 24.6 14.8 21.4 21.1"
        fill="none"
        stroke="rgba(255,255,255,0.58)"
        strokeLinecap="round"
        strokeWidth="2.1"
      />
      <circle cx="43" cy="16.4" r="3.1" fill="currentColor" />
      <circle cx="17.5" cy="44.2" r="2.5" fill="currentColor" opacity="0.72" />
    </svg>
  );
}
