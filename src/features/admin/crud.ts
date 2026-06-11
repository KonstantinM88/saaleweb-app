import { routing, type AppLocale } from "@/i18n/routing";
import { revalidatePath } from "next/cache";

export type CrudState = { error?: string };

export const LOCALES = routing.locales;

/** Revalidates the localized homepages so CMS edits surface on "/". */
export function revalidateHome() {
  for (const path of ["/", "/de", "/en", "/ru"]) {
    revalidatePath(path);
  }
}

export function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
export function strOrNull(fd: FormData, key: string): string | null {
  return str(fd, key) || null;
}
export function num(fd: FormData, key: string, fallback = 0): number {
  const v = str(fd, key);
  return v === "" ? fallback : Number(v) || fallback;
}
export function numOrNull(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  return v === "" ? null : Number(v) || null;
}
export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}

/** Reads `${field}_${locale}` values into translation rows. */
export function readTranslations(
  fd: FormData,
  fields: string[],
): Array<{ locale: AppLocale } & Record<string, string>> {
  return LOCALES.map((locale) => {
    const row: Record<string, string> = {};
    for (const f of fields) row[f] = String(fd.get(`${f}_${locale}`) ?? "").trim();
    return { locale, ...row };
  });
}

/** Builds GenericForm defaults.translations from DB translation rows. */
export function buildTranslationDefaults(
  rows: { locale: string; [k: string]: unknown }[],
  fields: string[],
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  for (const locale of LOCALES) {
    const row = rows.find((r) => r.locale === locale);
    out[locale] = Object.fromEntries(
      fields.map((f) => [f, row && row[f] != null ? String(row[f]) : ""]),
    );
  }
  return out;
}
