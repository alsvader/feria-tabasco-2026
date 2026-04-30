import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] grid place-items-center bg-gradient-hero px-6">
      <div className="text-center max-w-md">
        <p className="text-xs uppercase tracking-[0.22em] text-text-muted">
          Página no encontrada
        </p>
        <h1 className="mt-3 font-heading text-7xl md:text-8xl tracking-tight">
          <GradientText variant="gold">404</GradientText>
        </h1>
        <p className="mt-5 text-text-secondary leading-relaxed">
          Esta dirección no existe en la rifa. Vuelve al inicio para empezar tu
          predicción.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="md" variant="secondary">
            <Link href="/">
              <ArrowLeft size={14} strokeWidth={2} />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
