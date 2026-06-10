"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareButtons({
  url,
  title,
  shareLabel,
  copyLabel,
  copiedLabel,
}: {
  url: string;
  title: string;
  shareLabel: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const x = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const btn =
    "inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-[13px] font-semibold text-ink transition hover:border-brand-purple hover:text-brand-purple";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[13px] font-medium text-muted">{shareLabel}</span>
      <a href={x} target="_blank" rel="noopener noreferrer" className={btn}>
        X
      </a>
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className={btn}>
        LinkedIn
      </a>
      <button type="button" onClick={copy} className={btn}>
        {copied ? <Check size={14} /> : <Link2 size={14} />}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
