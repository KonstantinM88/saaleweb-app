import { createElement } from "react";
import { industryIcon } from "./industryMeta";

/** Renders the industry icon by slug/name via createElement (no render-scoped component binding). */
export function IndustryGlyph({
  slug,
  name,
  size = 24,
  className,
}: {
  slug: string;
  name: string;
  size?: number;
  className?: string;
}) {
  return createElement(industryIcon(slug, name), { size, "aria-hidden": true, className });
}
