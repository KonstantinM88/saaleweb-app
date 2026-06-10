import Link from "next/link";
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
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-dark">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link href={actionHref} className={adminBtn}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
