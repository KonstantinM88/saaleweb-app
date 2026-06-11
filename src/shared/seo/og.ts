import { siteConfig } from "@/shared/config/site";

/** Absolute URL to the dynamic OG image for a page. */
export function ogImageUrl(input: { title: string; eyebrow?: string }): string {
  const params = new URLSearchParams({ title: input.title });
  if (input.eyebrow) params.set("eyebrow", input.eyebrow);
  return `${siteConfig.url}/api/og?${params.toString()}`;
}
