"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

type Mode = "login" | "signup";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError(null);

    if (mode === "signup" && password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setPending(true);
    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "No pudimos completar la operación.");
        setPending(false);
        return;
      }
      // Full reload: a soft push+refresh races with middleware redirecting /login → /.
      window.location.assign(redirectTo);
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
      setPending(false);
    }
  };

  return (
    <Card className="space-y-6">
      <div className="grid grid-cols-2 rounded-2xl bg-surface-2/60 p-1 text-sm">
        <TabButton
          active={mode === "login"}
          onClick={() => {
            setMode("login");
            setError(null);
          }}
        >
          Iniciar sesión
        </TabButton>
        <TabButton
          active={mode === "signup"}
          onClick={() => {
            setMode("signup");
            setError(null);
          }}
        >
          Crear cuenta
        </TabButton>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          label="Correo"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
        />
        <Input
          name="password"
          type="password"
          label="Contraseña"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
        />
        {mode === "signup" && (
          <Input
            name="confirm"
            type="password"
            label="Confirmar contraseña"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••"
          />
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-text-primary"
          >
            <AlertCircle
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-accent"
            />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={pending}
        >
          {pending
            ? "Procesando…"
            : mode === "login"
              ? "Iniciar sesión"
              : "Crear cuenta"}
          {!pending && <ArrowRight size={16} strokeWidth={2} />}
        </Button>
      </form>
    </Card>
  );
}

function TabButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 rounded-xl text-sm font-medium transition-all duration-200",
        active
          ? "bg-gradient-brand text-white shadow-glow-soft"
          : "text-text-secondary hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}
