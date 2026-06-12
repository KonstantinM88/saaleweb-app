import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "ghost" | "dark";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[15px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "btn-shine bg-brand text-white shadow-[0_8px_24px_-8px_rgba(255,79,163,0.55)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(139,92,246,0.6)]",
  ghost:
    "border border-line bg-white text-dark hover:border-brand-purple hover:text-brand-purple",
  dark: "btn-shine bg-dark text-white hover:-translate-y-0.5",
};

type Props = {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(base, variants[variant], className);
  const wrapperClassName = className?.includes("w-full") ? "block w-full" : undefined;

  if (href) {
    return (
      <Magnetic className={wrapperClassName}>
        <Link href={href} className={classes}>
          {children}
        </Link>
      </Magnetic>
    );
  }

  return (
    <Magnetic className={wrapperClassName}>
      <button className={classes} {...rest}>
        {children}
      </button>
    </Magnetic>
  );
}
