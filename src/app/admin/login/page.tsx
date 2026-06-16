import { LoginForm } from "@/widgets/admin/LoginForm";
import { BrandWord } from "@/shared/ui/BrandText";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-brand text-[15px] font-extrabold text-white">
            S
          </span>
          <span className="text-lg font-bold text-dark">
            <BrandWord /> Admin
          </span>
        </div>
        <div className="rounded-2xl border border-line bg-white p-7 shadow-sm">
          <h1 className="text-lg font-bold text-dark">Anmelden</h1>
          <p className="mt-1 text-sm text-muted">Bitte mit Admin-Zugangsdaten anmelden.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
