import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { ProcessTimeline } from "./ProcessTimeline";

type Step = { title: string; desc: string };

export function Process() {
  const t = useTranslations("Process");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="process" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
        <ProcessTimeline steps={steps} />
      </Container>
    </section>
  );
}
