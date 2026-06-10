"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function change(next: string) {
    startTransition(() => {
      // Preserve the current route (and its params) when switching locale.
      router.replace(
        { pathname, params } as unknown as Parameters<typeof router.replace>[0],
        { locale: next },
      );
    });
  }

  return (
    <div
      className="flex gap-0.5 rounded-[10px] border border-line bg-surface p-[3px]"
      role="group"
      aria-label="Language"
      data-pending={isPending}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => change(l)}
          aria-current={l === locale}
          className={cn(
            "rounded-[7px] px-2.5 py-[5px] font-mono text-xs font-medium uppercase tracking-wide transition-colors",
            l === locale ? "bg-white text-dark shadow-sm" : "text-muted hover:text-dark",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
