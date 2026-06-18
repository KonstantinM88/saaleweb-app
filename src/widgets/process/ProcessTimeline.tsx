"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";

type Step = { title: string; desc: string };

type StepStyle = CSSProperties & {
  "--process-delay": string;
};

export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.22, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("process-timeline", active && "is-active")}>
      <div className="process-timeline-rail" aria-hidden>
        <span className="process-timeline-progress" />
      </div>

      <ol className="process-timeline-steps">
        {steps.map((step, index) => {
          const style: StepStyle = {
            "--process-delay": `${180 + index * 620}ms`,
          };

          return (
            <li key={step.title} className="process-step" style={style}>
              <div className="process-step-node" aria-hidden>
                <span className="process-step-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="process-step-status">✓</span>
              </div>
              <div className="process-step-copy">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
