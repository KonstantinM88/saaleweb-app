import { NextResponse } from "next/server";
import sharp from "sharp";
import { getSession } from "@/features/auth/session";
import { storeImage } from "@/features/admin/upload/storage";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Datei zu groß (max. 8 MB)." }, { status: 400 });
  }

  const maxWidth = Number(form.get("maxWidth") ?? 1600) || 1600;
  const buffer = Buffer.from(await file.arrayBuffer());

  let webp: Buffer;
  try {
    webp = await sharp(buffer)
      .rotate() // respect EXIF orientation
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: "Bild konnte nicht verarbeitet werden." }, { status: 400 });
  }

  const filename = `${Date.now()}-${slugify(file.name)}.webp`;
  try {
    const url = await storeImage(webp, filename);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }
}
