"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addProjectMedia } from "@/features/admin/projects/media";

export function MediaUploader({ projectId }: { projectId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const up = new FormData();
      up.append("file", file);
      up.append("maxWidth", "1600");
      const res = await fetch("/admin/api/upload", { method: "POST", body: up });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload fehlgeschlagen.");

      const persist = new FormData();
      persist.append("url", data.url);
      if (data.width) persist.append("width", String(data.width));
      if (data.height) persist.append("height", String(data.height));
      const result = await addProjectMedia(projectId, persist);
      if (result?.error) throw new Error(result.error);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mt-2">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onPick}
        disabled={busy || pending}
        className="block text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-soft file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-purple"
      />
      <p className="mt-1 text-xs text-muted">
        Empfohlen: 1200×800 px — wird zu WebP konvertiert. Erstes Bild (kleinste Reihenfolge) = Cover.
      </p>
      {(busy || pending) && <p className="mt-1 text-xs text-brand-purple">Wird hochgeladen…</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
