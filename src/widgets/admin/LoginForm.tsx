"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login, type LoginState } from "@/features/auth/actions";

const field =
  "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-purple";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [showPassword, setShowPassword] = useState(false);
  const passwordType = showPassword ? "text" : "password";
  const passwordLabel = showPassword ? "Passwort verbergen" : "Passwort anzeigen";

  return (
    <form action={action} className="mt-5 space-y-4">
      <label className="block text-sm font-medium text-ink">
        E-Mail
        <input type="email" name="email" required autoComplete="username" className={field} />
      </label>
      <div className="block text-sm font-medium text-ink">
        <label htmlFor="admin-password">Passwort</label>
        <div className="relative mt-1">
          <input
            id="admin-password"
            type={passwordType}
            name="password"
            required
            autoComplete="current-password"
            className={`${field} mt-0 pr-12`}
          />
          <button
            type="button"
            aria-label={passwordLabel}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-brand-soft hover:text-brand-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
          </button>
        </div>
      </div>
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
