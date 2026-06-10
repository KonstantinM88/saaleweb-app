import { routing } from "@/i18n/routing";
import type { Locale } from "@/generated/prisma/enums";

export type CrudState = { error?: string };
type TranslationRow = { locale: Locale } & Record<string, string>;

export const LOCALES = routing.locales as readonly Locale[];

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
export function readTranslations(fd: FormData, fields: string[]): TranslationRow[] {
  return LOCALES.map((locale) => {
    const row: TranslationRow = { locale };
    for (const f of fields) row[f] = String(fd.get(`${f}_${locale}`) ?? "").trim();
    return row;
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
