import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { BrandText } from "@/shared/ui/BrandText";

/**
 * Visible answers to recurring commercial questions. They remain part of the
 * rendered document in semantic details elements without requiring JavaScript.
 *
 * `embedded` renders the block inside another section (the homepage FAQ) with
 * an h3 heading instead of its own section and h2.
 */

export type DirectAnswer = {
  q: string;
  a: string;
  href?: string;
  linkLabel?: string;
};

export async function DirectAnswers({
  namespace = "DirectAnswers",
  embedded = false,
}: {
  namespace?: string;
  embedded?: boolean;
}) {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace });
  const items = t.raw("items") as DirectAnswer[];
  if (!items?.length) return null;

  const list = (
    <>
      <div className={embedded ? "mx-auto grid max-w-[780px] gap-3" : "grid gap-3"}>
        {items.map((item, index) => (
          <div key={index}>
            <details
              className="direct-answer group min-w-0 rounded-2xl border border-line bg-white p-5 transition-colors open:border-brand-purple md:p-6"
              open={!embedded && index === 0}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 wrap-break-word text-[16.5px] font-bold leading-snug text-dark focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple">
                <span className="min-w-0"><BrandText text={item.q} /></span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-[20px] leading-none text-brand-purple transition-transform group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl wrap-break-word text-[15.5px] leading-relaxed text-muted">
                <BrandText text={item.a} />
              </p>
              {item.href && item.linkLabel && (
                <Link
                  href={item.href}
                  className="mt-3 inline-flex items-center gap-1.5 wrap-break-word text-[14px] font-extrabold text-[#6D28D9] underline-offset-4 hover:underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6D28D9]"
                >
                  {item.linkLabel}
                  <ArrowUpRight size={15} aria-hidden />
                </Link>
              )}
            </details>
          </div>
        ))}
      </div>

      <p
        className={
          embedded
            ? "mx-auto mt-5 max-w-[780px] wrap-break-word text-[13px] leading-relaxed text-muted"
            : "mt-6 max-w-3xl wrap-break-word text-[13.5px] leading-relaxed text-muted"
        }
      >
        {t("note")}
      </p>
    </>
  );

  if (embedded) {
    return (
      <div id="direct-answers" className="mt-14 scroll-mt-24">
        <div className="mx-auto mb-6 max-w-[780px]">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h3 className="mt-3 text-[clamp(22px,2.6vw,30px)] font-bold tracking-tight text-dark">
            {t("title")}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{t("lead")}</p>
        </div>
        {list}
      </div>
    );
  }

  return (
    <section id="direct-answers" className="border-y border-line bg-surface py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        {list}
      </Container>
    </section>
  );
}
