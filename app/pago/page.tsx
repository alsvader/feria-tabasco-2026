import { Stepper } from "@/components/ui/Stepper";
import { PaymentClient } from "@/components/payment/PaymentClient";
import { Wordmark } from "@/components/ui/Wordmark";
import { getContestants } from "@/lib/data/contestants-server";

export const metadata = { title: "Pago" };

export default async function PagoPage() {
  const contestants = await getContestants();
  return (
    <main className="min-h-[100dvh] bg-gradient-hero">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between gap-6">
          <Wordmark size="sm" />
          <Stepper current={3} />
          <span className="text-xs text-text-muted hidden sm:inline">
            Paso 3 de 3
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24 grid place-items-center">
        <PaymentClient contestants={contestants} />
      </section>
    </main>
  );
}
