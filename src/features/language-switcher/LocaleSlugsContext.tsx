"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Per-locale slug map for the current detail page, e.g.
 * { de: "website-entwicklung", en: "web-development", ru: "razrabotka-sajtov" }.
 *
 * Detail pages (services, industries, blog posts, blog categories) wrap their
 * content in <LocaleSlugsProvider>. The LanguageSwitcher reads the map and
 * navigates to the correct translated slug instead of reusing the current one.
 * Pages without a provider keep the default behavior (params are preserved),
 * which is correct for routes whose slugs are identical across locales.
 */
export type LocaleSlugMap = Record<string, string>;

const LocaleSlugsContext = createContext<LocaleSlugMap | null>(null);

export function LocaleSlugsProvider({
  slugs,
  children,
}: {
  slugs: LocaleSlugMap;
  children: ReactNode;
}) {
  return <LocaleSlugsContext.Provider value={slugs}>{children}</LocaleSlugsContext.Provider>;
}

export function useLocaleSlugs(): LocaleSlugMap | null {
  return useContext(LocaleSlugsContext);
}
