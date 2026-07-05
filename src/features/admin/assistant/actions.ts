"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function revalidateAssistantAdmin() {
  revalidatePath("/admin/assistant");
}

export async function deleteAssistantConversation(id: string) {
  await prisma.assistantConversation.delete({ where: { id } });
  revalidateAssistantAdmin();
}

export async function blockAssistantIp(ipAddress: string, fd?: FormData) {
  const cleanIp = ipAddress.trim();
  if (!cleanIp) return;

  const reason = String(fd?.get("reason") ?? "Blocked from admin").trim().slice(0, 300);
  await prisma.blockedIp.upsert({
    where: { ipAddress: cleanIp },
    update: { reason: reason || "Blocked from admin" },
    create: { ipAddress: cleanIp, reason: reason || "Blocked from admin" },
  });
  revalidateAssistantAdmin();
}

export async function unblockAssistantIp(ipAddress: string) {
  const cleanIp = ipAddress.trim();
  if (!cleanIp) return;

  await prisma.blockedIp.deleteMany({ where: { ipAddress: cleanIp } });
  revalidateAssistantAdmin();
}
