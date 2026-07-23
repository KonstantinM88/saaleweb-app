"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { AiAssistantWidgetProps } from "./AiAssistantWidget";

const APPEAR_DELAY_MS = 8_000;

/**
 * The launcher is intentionally absent for the first eight seconds. Load the
 * full chat implementation only when it can become visible, keeping its
 * network, parsing and hydration cost outside the critical render path.
 */
export function DeferredAiAssistantWidget(props: AiAssistantWidgetProps) {
  const [Widget, setWidget] = useState<ComponentType<AiAssistantWidgetProps> | null>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      void import("./AiAssistantWidget").then((module) => {
        if (active) setWidget(() => module.AiAssistantWidget);
      });
    }, APPEAR_DELAY_MS);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, []);

  return Widget ? <Widget {...props} /> : null;
}
