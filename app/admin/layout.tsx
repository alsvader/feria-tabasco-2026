import { redirect } from "next/navigation";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { requireAdmin, AdminGateError } from "@/lib/auth/admin";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminGateError) {
      redirect(err.reason === "unauthenticated" ? "/login?redirectTo=/admin/tickets" : "/");
    }
    throw err;
  }

  return (
    <main className="min-h-[100dvh]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between gap-6">
          <Link href="/admin/tickets" className="flex items-center gap-3">
            <Wordmark size="sm" />
            <span className="hidden sm:inline text-xs uppercase tracking-[0.22em] text-gold/80">
              Admin
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/admin/tickets"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Confirmaciones
            </Link>
            <Link
              href="/admin/results"
              className="px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              Resultados
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 lg:px-10 py-12 md:py-16">
        {children}
      </section>
    </main>
  );
}
