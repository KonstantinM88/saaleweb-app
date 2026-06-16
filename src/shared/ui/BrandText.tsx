import { Fragment } from "react";
import { cn } from "@/shared/lib/cn";

export function BrandWord({ className }: { className?: string }) {
  return (
    <span className={cn("whitespace-nowrap", className)}>
      Saale
      <span className="bg-brand bg-clip-text text-transparent">Web</span>
    </span>
  );
}

export function BrandText({ text }: { text: string }) {
  const parts = text.split("SaaleWeb");

  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <BrandWord /> : null}
        </Fragment>
      ))}
    </>
  );
}
