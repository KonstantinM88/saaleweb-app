"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import type { AppLocale } from "@/i18n/routing";
import { AiAssistantTrigger } from "./AiAssistantTrigger";
import type { AiAssistantWidgetLabels } from "./AiAssistantWidget";

const AiAssistantWidget = lazy(async () => ({
  default: (await import("./AiAssistantWidget")).AiAssistantWidget,
}));

const APPEAR_DELAY_MS = 8_000;
const LOGO_NUDGE_DELAY_MS = 30_000;

export function AiAssistantLauncher({
  locale,
  labels,
  contactHref,
}: {
  locale: AppLocale;
  labels: AiAssistantWidgetLabels;
  contactHref: string;
}) {
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const [logoNudge, setLogoNudge] = useState(false);
  const [pageScrolled, setPageScrolled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || activated) return;
    const timer = window.setTimeout(() => setLogoNudge(true), LOGO_NUDGE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [visible, activated]);

  useEffect(() => {
    if (!visible || activated) return;
    let frameId = 0;
    const updateScrollState = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => setPageScrolled(window.scrollY > 24));
    };
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.cancelAnimationFrame(frameId);
    };
  }, [visible, activated]);

  if (!visible) return null;

  if (activated) {
    return (
      <Suspense
        fallback={
          <div className="pointer-events-none fixed bottom-[calc(0.25rem+env(safe-area-inset-bottom))] left-1 right-1 z-40 flex flex-col items-stretch sm:bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:left-auto sm:right-5 sm:items-end md:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] md:right-7">
            <AiAssistantTrigger locale={locale} labels={labels} pageScrolled={pageScrolled} loading onOpen={() => {}} />
          </div>
        }
      >
        <AiAssistantWidget locale={locale} labels={labels} contactHref={contactHref} />
      </Suspense>
    );
  }

  return (
    <div className="pointer-events-none fixed bottom-[calc(0.25rem+env(safe-area-inset-bottom))] left-1 right-1 z-40 flex flex-col items-stretch sm:bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:left-auto sm:right-5 sm:items-end md:bottom-[calc(1.25rem+env(safe-area-inset-bottom))] md:right-7">
      <AiAssistantTrigger
        locale={locale}
        labels={labels}
        pageScrolled={pageScrolled}
        logoNudge={logoNudge}
        onPrepare={() => {
          void import("./AiAssistantWidget");
        }}
        onOpen={() => setActivated(true)}
      />
    </div>
  );
}
