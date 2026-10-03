import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";

type ProjectFocus = { slug: string; result: string };

export async function getProjectFocusBySlug(locale: AppLocale) {
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  const projects = t.raw("projects") as ProjectFocus[];
  return new Map(projects.map(({ slug, result }) => [slug, result]));
}
