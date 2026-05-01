import { createServerSupabase } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdmin(user: User | null | undefined): boolean {
  const email = user?.email?.toLowerCase();
  return !!email && ADMIN_EMAILS.includes(email);
}

export class AdminGateError extends Error {
  constructor(public readonly reason: "unauthenticated" | "forbidden") {
    super(reason);
  }
}

export async function requireAdmin(): Promise<{ user: User }> {
  const supabase = createServerSupabase();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) throw new AdminGateError("unauthenticated");
  if (!isAdmin(user)) throw new AdminGateError("forbidden");
  return { user };
}
