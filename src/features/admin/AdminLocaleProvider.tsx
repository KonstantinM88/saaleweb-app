"use client";

import { createContext, useCallback, useContext, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ADMIN_LOCALE_COOKIE,
  type AdminLocale,
  translateAdminText,
} from "./i18n";

type AdminLocaleContextValue = {
  locale: AdminLocale;
  pending: boolean;
  setLocale: (locale: AdminLocale) => void;
  t: (value: string) => string;
};

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null);

export function AdminLocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: AdminLocale;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setLocale = useCallback(
    (locale: AdminLocale) => {
      document.cookie = `${ADMIN_LOCALE_COOKIE}=${locale}; path=/admin; max-age=31536000; SameSite=Lax`;
      startTransition(() => router.refresh());
    },
    [router],
  );

  const value = useMemo<AdminLocaleContextValue>(
    () => ({
      locale: initialLocale,
      pending,
      setLocale,
      t: (text) => translateAdminText(initialLocale, text),
    }),
    [initialLocale, pending, setLocale],
  );

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>;
}

export function useAdminLocale(): AdminLocaleContextValue {
  const context = useContext(AdminLocaleContext);
  if (!context) throw new Error("useAdminLocale must be used inside AdminLocaleProvider");
  return context;
}
