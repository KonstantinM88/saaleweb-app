import { routing } from "@/i18n/routing";

export function getContactHref(locale: string) {
  if (locale === "en") return "/en/contact";
  if (locale === "ru") return "/ru/kontakty";
  return routing.defaultLocale === "de" ? "/kontakt" : `/${routing.defaultLocale}/kontakt`;
}
