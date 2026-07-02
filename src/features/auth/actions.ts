"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSessionToken } from "./jwt";
import { setSessionCookie, clearSessionCookie } from "./session";

export type LoginState = { error?: string };

function normalizeAdminPasswordHash(value: string): string {
  const trimmed = value.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  return unquoted.replaceAll("\\$", "$");
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminHash = normalizeAdminPasswordHash(process.env.ADMIN_PASSWORD_HASH ?? "");

  if (!adminEmail || !adminHash) {
    return { error: "Admin-Zugang ist nicht konfiguriert (ADMIN_EMAIL / ADMIN_PASSWORD_HASH)." };
  }

  const emailOk = email === adminEmail;
  // Always run a compare to reduce timing differences.
  const passwordOk = await bcrypt.compare(password, adminHash);

  if (!emailOk || !passwordOk) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  const token = await createSessionToken({ email: adminEmail, role: "ADMIN" });
  await setSessionCookie(token);
  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/admin/login");
}
