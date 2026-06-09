import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en", "ru"],
  defaultLocale: "de",
  // German lives at "/", English at "/en", Russian at "/ru"
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
