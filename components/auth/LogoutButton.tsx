"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.push("/");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors disabled:opacity-50"
    >
      <LogOut size={14} strokeWidth={2} />
      {pending ? "Cerrando…" : "Cerrar sesión"}
    </button>
  );
}
