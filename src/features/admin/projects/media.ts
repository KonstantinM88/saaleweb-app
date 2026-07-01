"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { str, num, type CrudState } from "@/features/admin/crud";

function revalidate(projectId: string) {
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/admin/projects");
  for (const p of ["/", "/en", "/ru"]) revalidatePath(p);
}

export async function addProjectMedia(projectId: string, fd: FormData): Promise<CrudState> {
  const url = str(fd, "url");
  if (!url) return { error: "Keine URL." };
  const last = (await prisma.media.findFirst({
    where: { projectId },
    orderBy: { order: "desc" },
    select: { order: true },
  })) as { order: number } | null;
  await prisma.media.create({
    data: {
      projectId,
      url,
      alt: str(fd, "alt") || null,
      width: num(fd, "width") || null,
      height: num(fd, "height") || null,
      order: (last?.order ?? -1) + 1,
    },
  });
  revalidate(projectId);
  return {};
}

export async function updateProjectMedia(mediaId: string, projectId: string, fd: FormData) {
  await prisma.media.update({
    where: { id: mediaId },
    data: { alt: str(fd, "alt") || null, order: num(fd, "order") },
  });
  revalidate(projectId);
}

export async function deleteProjectMedia(mediaId: string, projectId: string) {
  await prisma.media.delete({ where: { id: mediaId } });
  revalidate(projectId);
}
