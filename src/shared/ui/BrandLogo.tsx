import Image from "next/image";
import brandIcon from "@/assets/brand/favicon.svg";
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
  light: "brand-mark-symbol",
  dark: "brand-mark-symbol",
  mono: "brand-mark-symbol",
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
    // Static import gives the frequently rendered mark a content-hashed,
    // immutable URL while preserving the same source artwork as the favicon.
    <Image
      src={brandIcon}
      alt=""
      aria-hidden="true"
      width={512}
      height={512}
      unoptimized
      className={cn("h-full w-full", className)}
    />
  );
}
