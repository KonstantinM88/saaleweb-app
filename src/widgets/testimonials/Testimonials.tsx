import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Container } from "@/shared/ui/Container";
import { Reveal } from "@/shared/ui/Reveal";
import { SectionHeader } from "@/shared/ui/SectionHeader";

type Item = { quote: string; name: string; company: string };

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const t = useTranslations("Testimonials");
  const items = t.raw("items") as Item[];

  return (
    <section className="py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={i} delay={i * 80}>
              <figure className="flex h-full flex-col rounded-[18px] border border-line bg-white p-6">
                <div className="mb-3.5 flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={15} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <blockquote className="mb-5 flex-1 text-[15px] text-ink">{item.quote}</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-brand text-[15px] font-bold text-white">
                    {initials(item.name)}
                  </span>
                  <span>
                    <b className="block text-[14.5px] text-dark">{item.name}</b>
                    <span className="text-[13px] text-muted">{item.company}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
