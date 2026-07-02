"use client";

import { useTransition } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/shared/lib/cn";
import { useLocaleSlugs } from "./LocaleSlugsContext";

type Locale = (typeof routing.locales)[number];

const LANGUAGE_META: Record<Locale, { label: string; flag: string }> = {
  de: { label: "Deutsch", flag: "/flags/de.svg" },
  en: { label: "English", flag: "/flags/en.svg" },
  ru: { label: "Русский", flag: "/flags/ru.svg" },
};

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

  function change(next: Locale) {
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
      className="flex items-center gap-1 rounded-full border border-line/80 bg-white/85 p-1 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-opacity data-[pending=true]:opacity-70"
      role="group"
      aria-label="Language"
      data-pending={isPending}
    >
      {routing.locales.map((l) => {
        const isActive = l === locale;
        const meta = LANGUAGE_META[l];

        return (
          <button
            key={l}
            type="button"
            onClick={() => change(l)}
            aria-label={`Switch language to ${meta.label}`}
            aria-current={isActive ? "true" : undefined}
            aria-pressed={isActive}
            title={meta.label}
            className={cn(
              "group relative grid size-8 place-items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/40 focus-visible:ring-offset-2",
              isActive
                ? "bg-white shadow-[0_8px_22px_rgba(139,92,246,0.22)] ring-1 ring-brand-purple/25"
                : "hover:bg-white hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)]",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-br from-brand-pink/15 to-brand-purple/15 opacity-0 transition-opacity",
                isActive && "opacity-100",
              )}
            />
            <span className="relative grid size-6 place-items-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105">
              <Image
                src={meta.flag}
                alt=""
                width={24}
                height={24}
                unoptimized
                className="size-6"
              />
            </span>
            <span className="sr-only">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
