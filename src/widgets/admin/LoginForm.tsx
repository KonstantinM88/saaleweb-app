"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/features/auth/actions";

const field =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-purple";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-5 space-y-4">
      <label className="block text-sm font-medium text-ink">
        E-Mail
        <input type="email" name="email" required autoComplete="username" className={field} />
      </label>
      <label className="block text-sm font-medium text-ink">
        Passwort
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={field}
        />
      </label>
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
      >
        {pending ? "…" : "Anmelden"}
      </button>
    </form>
  );
}
