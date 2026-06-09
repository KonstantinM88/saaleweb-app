"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { cn } from "@/shared/lib/cn";

type QA = { q: string; a: string };

export function Faq() {
  const t = useTranslations("Faq");
  const items = t.raw("items") as QA[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-surface py-24">
      <Container>
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto grid max-w-[780px] gap-3">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} className="overflow-hidden rounded-[14px] border border-line bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-[22px] py-5 text-left text-base font-semibold text-dark"
                >
                  {item.q}
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-[7px] transition-all",
                      open ? "rotate-45 bg-brand text-white" : "bg-surface text-brand-purple",
                    )}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-[22px] pb-5 text-[15px] text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
