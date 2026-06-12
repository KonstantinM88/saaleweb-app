import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <Reveal className="mx-auto mb-10 max-w-[680px] text-center md:mb-14">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-bold tracking-tight text-dark">
        {title}
      </h2>
      {lead && (
        <p className="mx-auto mt-4 max-w-[620px] text-[clamp(16px,1.6vw,19px)] text-muted">
          {lead}
        </p>
      )}
    </Reveal>
  );
}
