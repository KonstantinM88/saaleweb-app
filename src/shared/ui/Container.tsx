import { cn } from "@/shared/lib/cn";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-container px-6", className)}>
      {children}
    </div>
  );
}
