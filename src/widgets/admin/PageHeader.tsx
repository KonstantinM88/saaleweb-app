"use client";

import Link from "next/link";
import { useAdminLocale } from "@/features/admin/AdminLocaleProvider";
import { adminBtn } from "./ui";

export function PageHeader({
  title,
  subtitle,
  actionHref,
  actionLabel,
}: {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  const { t } = useAdminLocale();

  return (
    <div className="mb-7 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="break-words text-2xl font-bold tracking-tight text-dark">{t(title)}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm text-muted">{t(subtitle)}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link href={actionHref} className={`${adminBtn} w-full text-center sm:w-auto`}>
          {t(actionLabel)}
        </Link>
      )}
    </div>
  );
}
