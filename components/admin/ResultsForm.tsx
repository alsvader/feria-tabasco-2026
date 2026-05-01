"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Lock, Save, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/format";
import type { Contestant } from "@/lib/data/contestants";
import type { Rank, RankedPick } from "@/lib/raffle/types";

const RANKS: Rank[] = [1, 2, 3, 4, 5];

export function ResultsForm({
  contestants,
  initialPicks,
  publishedAt,
  updatedAt
}: {
  contestants: Contestant[];
  initialPicks: RankedPick[] | null;
  publishedAt: string | null;
  updatedAt: string | null;
}) {
  const router = useRouter();
  const isPublished = !!publishedAt;
  const byId = new Map(contestants.map((c) => [c.id, c]));

  const [picks, setPicks] = useState<Record<Rank, string | null>>(() => {
    const initial: Record<Rank, string | null> = { 1: null, 2: null, 3: null, 4: null, 5: null };
    if (initialPicks) {
      for (const p of initialPicks) initial[p.rank] = p.contestantId;
    }
    return initial;
  });
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(updatedAt);

  const setRank = (rank: Rank, contestantId: string) => {
    setPicks((prev) => {
      const next = { ...prev };
      for (const r of RANKS) {
        if (next[r] === contestantId) next[r] = null;
      }
      next[rank] = contestantId || null;
      return next;
    });
  };

  const allSet = RANKS.every((r) => picks[r]);
  const ranked: RankedPick[] = RANKS.filter((r) => picks[r]).map((r) => ({
    rank: r,
    contestantId: picks[r] as string
  }));

  const handleSave = async () => {
    if (!allSet || saving) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/results", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ picks: ranked })
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "No pudimos guardar.");
        return;
      }
      setSavedAt(new Date().toISOString());
    } catch {
      setError("Error de red.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!allSet || publishing || !savedAt) return;
    if (
      !confirm(
        "Una vez publicados, los resultados no podrán editarse desde aquí. ¿Continuar?"
      )
    ) {
      return;
    }
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/results/publish", {
        method: "POST"
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "No pudimos publicar.");
        return;
      }
      router.refresh();
    } catch {
      setError("Error de red.");
    } finally {
      setPublishing(false);
    }
  };

  if (isPublished) {
    return (
      <Card className="space-y-6">
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm">
          <Lock size={16} strokeWidth={2} className="mt-0.5 text-emerald-300" />
          <div>
            <p className="font-medium text-emerald-200">
              Resultados publicados
            </p>
            <p className="mt-0.5 text-text-secondary text-xs">
              Publicado el {formatDate(publishedAt!)}. Para revisar cambios,
              ejecuta en SQL: <code className="text-text-primary">update contest_results set published_at = null where id = 1</code>.
            </p>
          </div>
        </div>
        <ol className="space-y-3">
          {RANKS.map((r) => {
            const id = picks[r];
            const c = id ? byId.get(id) : null;
            if (!c) return null;
            return (
              <li
                key={r}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-surface/70 px-4 py-3"
              >
                <span className="font-heading text-2xl text-gradient-gold tabular-nums w-10 text-center">
                  {r}
                </span>
                <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-primary/40">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-[11px] text-text-muted truncate">
                    {c.ciudad}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm"
        >
          <AlertCircle size={16} className="mt-0.5 text-accent shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ol className="space-y-3">
        {RANKS.map((r) => (
          <li
            key={r}
            className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-surface/70 px-4 py-3"
          >
            <span className="font-heading text-2xl text-gradient-gold tabular-nums w-10 text-center">
              {r}
            </span>
            <select
              aria-label={`Lugar ${r}`}
              value={picks[r] ?? ""}
              onChange={(e) => setRank(r, e.target.value)}
              className="flex-1 h-11 rounded-xl border border-white/10 bg-surface-2/60 px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">— Seleccionar candidata —</option>
              {contestants.map((c) => {
                const usedAt = RANKS.find((rr) => rr !== r && picks[rr] === c.id);
                return (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.ciudad}
                    {usedAt ? ` (lugar ${usedAt})` : ""}
                  </option>
                );
              })}
            </select>
          </li>
        ))}
      </ol>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-text-muted">
          {savedAt ? `Borrador guardado · ${formatDate(savedAt)}` : "Sin guardar"}
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleSave}
            disabled={!allSet || saving}
          >
            <Save size={14} strokeWidth={2} />
            {saving ? "Guardando…" : "Guardar borrador"}
          </Button>
          <Button
            variant="gold"
            size="md"
            onClick={handlePublish}
            disabled={!allSet || publishing || !savedAt}
          >
            <Sparkles size={14} strokeWidth={2} />
            {publishing ? "Publicando…" : "Publicar resultados"}
            {!publishing && <Check size={14} strokeWidth={2} />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
