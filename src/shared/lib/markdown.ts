import GithubSlugger from "github-slugger";

export type TocItem = { id: string; text: string; depth: 2 | 3 };

/** Extracts h2/h3 headings and slugs them the same way rehype-slug does. */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inCode = false;

  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const depth = match[1].length as 2 | 3;
      const text = match[2].trim();
      items.push({ id: slugger.slug(text), text, depth });
    }
  }
  return items;
}

export function readingTimeMinutes(markdown: string): number {
  const words = markdown
    .replace(/[#>*`_~]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
