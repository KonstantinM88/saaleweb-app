import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { SectionHeader } from "@/shared/ui/SectionHeader";

/**
 * Visible answers to recurring commercial questions. They remain part of the
 * rendered document in semantic details elements without requiring JavaScript.
 */

export type DirectAnswer = {
  q: string;
  a: string;
  href?: string;
  linkLabel?: string;
};

export async function DirectAnswers({
  namespace = "DirectAnswers",
}: {
  namespace?: string;
}) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace });
  const items = t.raw("items") as DirectAnswer[];
  if (!items?.length) return null;

  return (
    <section id="direct-answers" className="border-y border-line bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

        <div className="grid gap-3">
          {items.map((item, index) => (
            <div key={index}>
              <details
                className="direct-answer group min-w-0 rounded-2xl border border-line bg-white p-5 transition-colors open:border-brand-purple md:p-6"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 break-words text-[16.5px] font-bold leading-snug text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple">
                  {item.q}
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-[20px] leading-none text-brand-purple transition-transform group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl break-words text-[15.5px] leading-relaxed text-muted">
                  {item.a}
                </p>
                {item.href && item.linkLabel && (
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex items-center gap-1.5 break-words text-[14px] font-extrabold text-brand-purple underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
                  >
                    {item.linkLabel}
                    <ArrowUpRight size={15} aria-hidden />
                  </Link>
                )}
              </details>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-3xl break-words text-[13.5px] leading-relaxed text-muted">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}
