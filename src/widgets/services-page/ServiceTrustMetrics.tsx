"use client";

import type { CSSProperties, PointerEvent } from "react";
import { Gauge, Languages, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { CountUp } from "@/shared/ui/CountUp";

export type ServiceTrustMetric = {
  value: string;
  label: string;
};

const icons: LucideIcon[] = [Gauge, Zap, Languages, ShieldCheck];
const progress = ["100%", "94%", "78%", "100%"];

type MetricStyle = CSSProperties & {
  "--metric-delay": string;
  "--metric-progress": string;
};

function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  card.style.setProperty("--metric-x", `${(x * 100).toFixed(1)}%`);
  card.style.setProperty("--metric-y", `${(y * 100).toFixed(1)}%`);
  card.style.setProperty("--metric-rotate-x", `${((0.5 - y) * 7).toFixed(2)}deg`);
  card.style.setProperty("--metric-rotate-y", `${((x - 0.5) * 8).toFixed(2)}deg`);
  card.dataset.active = "true";
}

function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  card.style.setProperty("--metric-x", "50%");
  card.style.setProperty("--metric-y", "50%");
  card.style.setProperty("--metric-rotate-x", "0deg");
  card.style.setProperty("--metric-rotate-y", "0deg");
  delete card.dataset.active;
}

export function ServiceTrustMetrics({ items }: { items: ServiceTrustMetric[] }) {
  return (
    <div className="service-trust-shell">
      <div aria-hidden className="service-trust-aura service-trust-aura-left" />
      <div aria-hidden className="service-trust-aura service-trust-aura-right" />
      <div aria-hidden className="service-trust-grid" />

      <dl className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = icons[index] ?? ShieldCheck;
          const style: MetricStyle = {
            "--metric-delay": `${index * 110}ms`,
            "--metric-progress": progress[index] ?? "86%",
          };

          return (
            <div
              key={item.label}
              className="service-trust-card"
              style={style}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <div className="service-trust-card-glow" aria-hidden />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <span className="service-trust-icon">
                    <Icon size={19} strokeWidth={2.1} aria-hidden />
                  </span>
                  <span className="service-trust-signal" aria-hidden>
                    <span />
                  </span>
                </div>

                <dt className="mt-4 whitespace-nowrap text-[clamp(22px,6.4vw,32px)] font-extrabold leading-none tracking-[-0.045em] text-dark sm:mt-5">
                  <CountUp value={item.value} duration={1050 + index * 100} />
                </dt>
                <dd className="mt-2 text-[11px] font-medium leading-tight text-muted sm:text-[13px]">
                  {item.label}
                </dd>

                <span className="service-trust-track mt-auto" aria-hidden>
                  <span />
                </span>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
