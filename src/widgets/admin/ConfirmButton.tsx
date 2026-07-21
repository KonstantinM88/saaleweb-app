"use client";

import { useAdminLocale } from "@/features/admin/AdminLocaleProvider";

export function ConfirmButton({
  children,
  message,
  className,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  const { t } = useAdminLocale();
  const label = typeof children === "string" ? t(children) : children;

  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(t(message))) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
