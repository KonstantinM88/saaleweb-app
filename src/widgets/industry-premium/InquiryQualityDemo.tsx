"use client";

import { useId, useState } from "react";
import { ArrowRight, Camera, Check, Phone, X } from "lucide-react";
import type { ConstructionLandingContent } from "./types";

type Props = {
  copy: ConstructionLandingContent["inquiry"];
  ctaHref: string;
};

type Selection = Record<string, number>;

/**
 * Delta 36 — the signature element of the construction landing page.
 *
 * A working miniature of the structured inquiry form we build. The visitor
 * picks what a prospect would pick and watches the resulting inquiry assemble
 * itself next to the vague phone call it replaces. Nothing is claimed about
 * inquiry volume — the disclaimer stays visible under the result.
 */
export function InquiryQualityDemo({ copy, ctaHref }: Props) {
  const id = useId();
  const [selection, setSelection] = useState<Selection>(() =>
    Object.fromEntries(copy.groups.map((group) => [group.key, 0])),
  );
  const [photos, setPhotos] = useState(0);

  const valueFor = (key: string) => {
    const group = copy.groups.find((item) => item.key === key);
    if (!group) return "";
    return group.options[selection[key] ?? 0];
  };

  const rows = [
    { label: copy.fieldLabels.service, value: valueFor("service") },
    { label: copy.fieldLabels.object, value: valueFor("object") },
    { label: copy.fieldLabels.area, value: valueFor("area") },
    { label: copy.fieldLabels.timing, value: valueFor("timing") },
    { label: copy.fieldLabels.photos, value: copy.photosOptions[photos] },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
      {/* ── The form a prospect would fill in ─────────────────── */}
      <div className="bau-sheet rounded-[24px] p-6 md:p-7">
        <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#2D6CA3]">
          {copy.formTitle}
        </p>

        <div className="mt-6 grid gap-6">
          {copy.groups.map((group) => (
            <fieldset key={group.key} className="border-0 p-0">
              <legend className="mb-3 text-[14px] font-bold text-[#123A5E]">{group.label}</legend>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option, index) => {
                  const active = (selection[group.key] ?? 0) === index;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelection((prev) => ({ ...prev, [group.key]: index }))}
                      className={`bau-chip ${active ? "bau-chip--active" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <fieldset className="border-0 p-0">
            <legend className="mb-3 text-[14px] font-bold text-[#123A5E]">{copy.photosLabel}</legend>
            <div className="flex flex-wrap gap-2">
              {copy.photosOptions.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={photos === index}
                  onClick={() => setPhotos(index)}
                  className={`bau-chip ${photos === index ? "bau-chip--active" : ""}`}
                >
                  {index === 0 ? <Camera size={14} aria-hidden /> : null}
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <p className="mt-7 border-t border-[#2D6CA3]/15 pt-5 text-[13px] leading-relaxed text-[#40607F]">
          {copy.formHint}
        </p>
      </div>

      {/* ── The two possible outcomes ─────────────────────────── */}
      <div className="grid content-start gap-5">
        <article className="rounded-[24px] border border-[#123A5E]/12 bg-white/70 p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-[15.5px] font-extrabold text-[#123A5E]">
              <X size={16} className="text-[#B4453C]" aria-hidden />
              {copy.badTitle}
            </h3>
            <span className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#40607F]/70">
              <Phone size={12} aria-hidden />
              {copy.badSubtitle}
            </span>
          </div>

          <p className="mt-4 rounded-[16px] bg-[#123A5E]/[0.05] p-4 text-[15px] italic leading-relaxed text-[#40607F]">
            {copy.badMessage}
          </p>

          <ul className="mt-4 grid gap-2">
            {copy.badProblems.map((problem) => (
              <li key={problem} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[#40607F]">
                <X size={14} className="mt-1 shrink-0 text-[#B4453C]/70" aria-hidden />
                {problem}
              </li>
            ))}
          </ul>
        </article>

        <article aria-live="polite" className="bau-inquiry rounded-[24px] p-6 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-[15.5px] font-extrabold text-[#0C2E4E]">
              <Check size={16} className="text-[#2D6CA3]" aria-hidden />
              {copy.goodTitle}
            </h3>
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#2D6CA3]">
              {copy.goodSubtitle}
            </span>
          </div>

          <dl className="mt-5 grid gap-0">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-1 border-t border-[#2D6CA3]/15 py-3 sm:grid-cols-[128px_1fr] sm:gap-4"
              >
                <dt className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#2D6CA3]">
                  {row.label}
                </dt>
                <dd className="text-[14.5px] font-semibold leading-snug text-[#0C2E4E]">{row.value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 border-t border-[#2D6CA3]/15 pt-4 text-[13.5px] leading-relaxed text-[#40607F]">
            {copy.goodNote}
          </p>
        </article>

        <div className="rounded-[24px] border border-[#2D6CA3]/25 bg-[#2D6CA3]/[0.06] p-6 md:p-7">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#2D6CA3]">
            {copy.outcomeTitle}
          </p>
          <ul className="mt-4 grid gap-2.5">
            {copy.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2.5 text-[14.5px] leading-relaxed text-[#123A5E]">
                <Check size={16} className="mt-0.5 shrink-0 text-[#2D6CA3]" aria-hidden />
                {outcome}
              </li>
            ))}
          </ul>
          <a
            href={ctaHref}
            className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#123A5E] px-5 py-3 text-[14.5px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1B4E7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D6CA3] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {copy.cta}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
        </div>

        <p className="text-[12.5px] leading-relaxed text-[#40607F]/80" id={`${id}-disclaimer`}>
          {copy.disclaimer}
        </p>
      </div>
    </div>
  );
}
