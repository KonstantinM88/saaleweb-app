import "server-only";

/**
 * Stores an image and returns its public URL.
 * - Production: Vercel Blob (requires BLOB_READ_WRITE_TOKEN).
 * - Local dev (no token): writes to /public/uploads (served at /uploads/...).
 */
export async function storeImage(data: Buffer, filename: string): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`uploads/${filename}`, data, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), data);
  return `/uploads/${filename}`;
}
