import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { LoginForm } from "@/app/login/LoginForm";

export const metadata = { title: "Iniciar sesión" };

export default function LoginPage({
  searchParams
}: {
  searchParams: { redirectTo?: string };
}) {
  const rawRedirect = searchParams.redirectTo ?? "/seleccion";
  const redirectTo = rawRedirect.startsWith("/") ? rawRedirect : "/seleccion";

  return (
    <main className="min-h-[100dvh] bg-gradient-hero">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between gap-6">
          <Link href="/">
            <Wordmark size="sm" />
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-md px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
            Acceso
          </p>
          <h1 className="mt-3 font-heading text-4xl tracking-tight">
            Tu predicción te espera.
          </h1>
          <p className="mt-3 text-text-secondary leading-relaxed">
            Inicia sesión o crea una cuenta para elegir tus 5 favoritas.
          </p>
        </div>

        <div className="mt-10">
          <LoginForm redirectTo={redirectTo} />
        </div>
      </section>
    </main>
  );
}
