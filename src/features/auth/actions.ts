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

  return unquoted.replace(/\s+/g, "").replace(/\\+\$/g, "$");
}

function authDiagnostics(adminEmail: string, adminHash: string) {
  return {
    hasAdminEmail: Boolean(adminEmail),
    hasAdminHash: Boolean(adminHash),
    hasAuthSecret: Boolean(process.env.AUTH_SECRET?.trim()),
    hashLength: adminHash.length,
    hashPrefix: adminHash.slice(0, 4),
    hashLooksBcrypt: /^\$2[aby]\$\d{2}\$/.test(adminHash),
    nodeEnv: process.env.NODE_ENV,
  };
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminHash = normalizeAdminPasswordHash(process.env.ADMIN_PASSWORD_HASH ?? "");
  const diagnostics = authDiagnostics(adminEmail, adminHash);

  if (!adminEmail || !adminHash) {
    console.error("[auth] Admin login skipped because auth env is incomplete.", diagnostics);
    return { error: "Admin-Zugang ist nicht konfiguriert (ADMIN_EMAIL / ADMIN_PASSWORD_HASH)." };
  }

  const emailOk = email === adminEmail;
  // Always run a compare to reduce timing differences.
  const passwordOk = await bcrypt.compare(password, adminHash);

  if (!emailOk || !passwordOk) {
    console.error("[auth] Admin login rejected.", {
      ...diagnostics,
      submittedEmailLength: email.length,
      emailOk,
      passwordOk,
    });
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  if (!process.env.AUTH_SECRET?.trim()) {
    console.error("[auth] Admin login accepted but AUTH_SECRET is missing.", diagnostics);
    return { error: "Admin-Zugang ist nicht konfiguriert (AUTH_SECRET)." };
  }

  try {
    const token = await createSessionToken({ email: adminEmail, role: "ADMIN" });
    await setSessionCookie(token);
    console.error("[auth] Admin login accepted.", diagnostics);
  } catch (error) {
    console.error("[auth] Admin login session failed.", {
      ...diagnostics,
      message: error instanceof Error ? error.message : "Unknown session error",
    });
    return { error: "Admin-Sitzung konnte nicht erstellt werden." };
  }

  redirect("/admin");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/admin/login");
}
