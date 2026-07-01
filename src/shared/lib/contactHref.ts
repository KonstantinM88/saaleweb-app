import { getLocalizedHref } from "./localizedPath";

export function getContactHref(locale: string) {
  return getLocalizedHref(locale, "contact");
}
