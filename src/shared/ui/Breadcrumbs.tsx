import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";

type Href = ComponentProps<typeof Link>["href"];
export type Crumb = { name: string; href?: Href };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <Container>
      <nav aria-label="Breadcrumb" className="pt-8">
        <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-2">
                {c.href && !last ? (
                  <Link href={c.href} className="transition-colors hover:text-brand-pink">
                    {c.name}
                  </Link>
                ) : (
                  <span className={last ? "font-medium text-ink" : undefined}>{c.name}</span>
                )}
                {!last && <span className="text-line">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
}
