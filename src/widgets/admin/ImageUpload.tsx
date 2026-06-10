"use client";

import { useRef, useState } from "react";
import { adminInput } from "./ui";

export function ImageUpload({
  name,
  defaultValue = "",
  hint,
  maxWidth = 1600,
}: {
  name: string;
  defaultValue?: string;
  hint?: string;
  maxWidth?: number;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("maxWidth", String(maxWidth));
      const res = await fetch("/admin/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload fehlgeschlagen.");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mt-1 space-y-2">
      <div className="flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-16 w-16 rounded-lg border border-line object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-line text-[11px] text-muted">
            —
          </div>
        )}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPick}
            disabled={busy}
            className="block text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-purple"
          />
          {hint && <p className="mt-1 text-xs text-muted">Empfohlen: {hint} — wird zu WebP konvertiert.</p>}
          {busy && <p className="mt-1 text-xs text-brand-purple">Wird hochgeladen…</p>}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        type="text"
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://… oder Datei hochladen"
        className={adminInput}
      />
    </div>
  );
}
