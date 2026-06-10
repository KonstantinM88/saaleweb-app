"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { LEAD_STATUSES, type LeadStatusValue } from "./constants";

export async function updateLeadStatus(id: string, fd: FormData) {
  const status = String(fd.get("status") ?? "");
  if (!LEAD_STATUSES.includes(status as LeadStatusValue)) return;
  await prisma.lead.update({ where: { id }, data: { status: status as LeadStatusValue } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/admin/leads");
}
