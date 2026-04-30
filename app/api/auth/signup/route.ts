import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let payload: { email?: unknown; password?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Correo y contraseña son obligatorios." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 6 caracteres." },
      { status: 400 }
    );
  }

  const supabase = createServerSupabase();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json(
      { error: translateAuthError(error.message) },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("user already")) {
    return "Ese correo ya está registrado. Inicia sesión.";
  }
  if (m.includes("invalid email")) {
    return "El correo no es válido.";
  }
  if (m.includes("password")) {
    return "La contraseña no cumple los requisitos.";
  }
  return "No pudimos crear la cuenta. Inténtalo de nuevo.";
}
