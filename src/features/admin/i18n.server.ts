import "server-only";

import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, normalizeAdminLocale, type AdminLocale } from "./i18n";

export async function getAdminLocale(): Promise<AdminLocale> {
  const cookieStore = await cookies();
  return normalizeAdminLocale(cookieStore.get(ADMIN_LOCALE_COOKIE)?.value);
}
