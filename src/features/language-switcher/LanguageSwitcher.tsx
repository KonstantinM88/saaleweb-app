"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";
import { useLocaleSlugs } from "./LocaleSlugsContext";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const localeSlugs = useLocaleSlugs();
  const [isPending, startTransition] = useTransition();

  type ReplaceHref = Parameters<typeof router.replace>[0];

  function fallbackHrefForCurrentPage(): ReplaceHref {
    if (pathname.startsWith("/leistungen")) return "/leistungen" as ReplaceHref;
    if (pathname.startsWith("/branchen")) return "/branchen" as ReplaceHref;
    if (pathname.startsWith("/projekte")) return "/projekte" as ReplaceHref;
    if (pathname.startsWith("/blog")) return "/blog" as ReplaceHref;
    return "/" as ReplaceHref;
  }

  function change(next: string) {
    if (next === locale) return;
    startTransition(() => {
      // Detail pages publish a per-locale slug map (slugs differ by language).
      if (localeSlugs) {
        const targetSlug = localeSlugs[next];
        if (targetSlug) {
          router.replace(
            { pathname, params: { ...params, slug: targetSlug } } as unknown as ReplaceHref,
            { locale: next },
          );
        } else {
          // No translation in the target language — fall back gracefully.
          router.replace(fallbackHrefForCurrentPage(), { locale: next });
        }
        return;
      }
      // Default: keep the current route and params (slugs identical across locales).
      router.replace(
        { pathname, params } as unknown as ReplaceHref,
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
