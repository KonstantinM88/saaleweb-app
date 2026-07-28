"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import type { HotelLandingContent, PremiumLocale } from "./types";

type Props = {
  copy: HotelLandingContent["calculator"];
  locale: PremiumLocale;
  ctaHref: string;
};

const numberLocale: Record<PremiumLocale, string> = {
  de: "de-DE",
  en: "en-GB",
  ru: "ru-RU",
};

const defaults = {
  rate: 140,
  bookings: 60,
  commission: 15,
  shift: 10,
};

const rangeThumbSizePx = 22;

/**
 * Delta 34 — the signature element of the hotel landing page.
 *
 * Deliberately arithmetic only: it multiplies the visitor's own assumptions and
 * shows the order of magnitude of their portal commission. It makes no claim
 * about what a website would achieve — the disclaimer stays visible next to the
 * result rather than being hidden behind a tooltip.
 */
export function CommissionCalculator({ copy, locale, ctaHref }: Props) {
  const [rate, setRate] = useState(defaults.rate);
  const [bookings, setBookings] = useState(defaults.bookings);
  const [commission, setCommission] = useState(defaults.commission);
  const [shift, setShift] = useState(defaults.shift);

  const id = useId();
  const formatMoney = useMemo(() => {
    const formatter = new Intl.NumberFormat(numberLocale[locale], {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });

    // A German thousands dot such as "15.120 €" is correct but can look like
    // a decimal separator. Preserve the locale's currency position while
    // using one unambiguous narrow no-break space for grouped thousands.
    return (value: number) =>
      formatter
        .formatToParts(value)
        .map((part) => (part.type === "group" ? "\u202F" : part.value))
        .join("");
  }, [locale]);

  const commissionYear = rate * bookings * 12 * (commission / 100);
  const commissionMonth = commissionYear / 12;
  const shiftYear = commissionYear * (shift / 100);

  return (
    <div className="hotel-calc grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
      <div className="grid gap-6 rounded-[24px] border border-white/[0.10] bg-white/[0.04] p-6 md:p-7">
        <Slider
          id={`${id}-rate`}
          label={copy.rateLabel}
          value={rate}
          display={formatMoney(rate)}
          min={40}
          max={400}
          step={5}
          onChange={setRate}
        />
        <Slider
          id={`${id}-bookings`}
          label={copy.bookingsLabel}
          value={bookings}
          display={String(bookings)}
          min={5}
          max={400}
          step={5}
          onChange={setBookings}
        />
        <Slider
          id={`${id}-commission`}
          label={copy.commissionLabel}
          value={commission}
          display={`${commission} %`}
          min={5}
          max={30}
          step={1}
          onChange={setCommission}
        />
        <Slider
          id={`${id}-shift`}
          label={copy.shiftLabel}
          value={shift}
          display={`${shift} %`}
          min={0}
          max={50}
          step={1}
          onChange={setShift}
          accent
        />
      </div>

      <div className="grid content-start gap-4">
        <div
          aria-live="polite"
          className="rounded-[24px] border border-white/[0.10] bg-white/[0.04] p-6 md:p-7"
        >
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
            {copy.commissionResult}
          </p>
          <p className="hotel-figure mt-3 text-[clamp(34px,5vw,52px)] font-extrabold leading-none text-white">
            {formatMoney(commissionYear)}
          </p>
          <p className="mt-2 text-[13px] text-white/55">
            {copy.perYear} · {formatMoney(commissionMonth)} {copy.perMonth}
          </p>
          <p className="mt-3 rounded-xl border border-white/[0.08] bg-black/10 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-white/60">
            <span className="font-bold text-white/75">{copy.calculationLabel}:</span>{" "}
            {formatMoney(rate)} × {bookings} {copy.perMonth} × 12 × {commission} %
          </p>
          <p className="mt-4 border-t border-white/[0.08] pt-4 text-[13.5px] leading-relaxed text-white/65">
            {copy.commissionHint}
          </p>
        </div>

        <div className="hotel-brass-card rounded-[24px] p-6 md:p-7">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#3A2A08]/70">
            {copy.shiftResult}
          </p>
          <p className="hotel-figure mt-3 text-[clamp(30px,4.4vw,44px)] font-extrabold leading-none text-[#241906]">
            {formatMoney(shiftYear)}
          </p>
          <p className="mt-2 text-[13px] font-medium text-[#3A2A08]/75">{copy.perYear}</p>
          <p className="mt-3 rounded-xl border border-[#241906]/[0.12] bg-white/20 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-[#3A2A08]/75">
            <span className="font-bold text-[#241906]/85">{copy.calculationLabel}:</span>{" "}
            {formatMoney(commissionYear)} × {shift} % = {formatMoney(shiftYear)}
          </p>
          <p className="mt-4 border-t border-[#241906]/[0.14] pt-4 text-[13.5px] leading-relaxed text-[#3A2A08]/85">
            {copy.shiftHint}
          </p>
          <a
            href={ctaHref}
            className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#241906] px-5 py-3 text-[14.5px] font-semibold text-[#F5E6C8] transition-transform hover:-translate-y-0.5"
          >
            {copy.cta}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>

        <p className="text-[12.5px] leading-relaxed text-white/45">{copy.disclaimer}</p>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  accent = false,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  accent?: boolean;
}) {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  // A native range thumb travels across the track width minus its own width.
  // Compensate for that geometry so the gradient boundary meets the exact
  // centre of the 22 px thumb at every value, including both endpoints.
  const fillOffsetPx = rangeThumbSizePx * (0.5 - percent / 100);
  const fillPosition = `calc(${percent}% + ${fillOffsetPx.toFixed(2)}px)`;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14px] font-medium leading-snug text-white/75">
          {label}
        </label>
        <output
          htmlFor={id}
          className={`hotel-figure text-[19px] font-extrabold ${accent ? "text-[#E8C071]" : "text-white"}`}
        >
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`hotel-range mt-3 w-full ${accent ? "hotel-range--accent" : ""}`}
        style={{ "--fill": fillPosition } as CSSProperties}
      />
    </div>
  );
}
