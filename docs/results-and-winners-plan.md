# Results + Winners

## Context

Phase 2 made tickets persistent and operator-confirmable. The remaining gap was the climax of the product: declaring a winner. Without a way to enter the actual top 5 and compute who won, the app is a poll, not a raffle.

This phase adds an admin form to enter the official top 5, scores every confirmed ticket against it, picks winners by highest score, and renders a public `/resultados` page plus per-ticket scores on the user's dashboard.

### Decisions

1. **Scoring rule**: exact-position match. Each pick scores `6 − rank` if the predicted contestant is at exactly that rank in the actual top 5; otherwise 0. Maximum ticket score is `5+4+3+2+1 = 15`.
2. **Tie-breaking**: pool split evenly among all top-tied tickets via integer division (`pool / count(winners)`). Floor leftover (e.g. $30 / 7 = $4 each, $2 unaccounted) is operator-handled.
3. **Edit policy**: results are draft-editable until publish. Once published, they lock — to revise, the operator must run `update contest_results set published_at = null where id = 1` directly in SQL. This avoids a one-click "unpublish" that could be misused after results are public.
4. **Result reveal**: `/resultados` is always reachable; pre-publish it shows a "Próximamente" teaser, post-publish it shows the actual top 5 + winning tickets with their prize share.

### Hard constraint (carried)

The browser must never call Supabase directly. All Supabase access goes through Next.js server code.

---

## Architecture

**Result entry**: `/admin/results` is a server-component admin page that loads the current draft via the service-role client (RLS blocks anon reads of `contest_results`). The form lets the operator pick 5 contestants in order via dropdowns. Save → `PUT /api/admin/results` (validates + upserts a draft). Publish → `POST /api/admin/results/publish` (sets `published_at`). The PUT path errors if results are already published, so accidental edits to a public top-5 are caught at the API layer in addition to the UI lock.

**Public read path**: `/resultados`, `/dashboard`, and any other public-facing reader call `SECURITY DEFINER` Postgres functions. The functions hide unpublished state behind a `published_at IS NOT NULL` filter and return only what each surface needs:

- `public_results()` → `{picks, published_at}` jsonb, or null if not published.
- `public_winners()` → `(ticket_id, score, prize_share)[]`. Only returns rows when results are published; only includes tickets with `score > 0 AND score = max(score)`.
- `my_ticket_scores()` → `(ticket_id, score)[]` for `auth.uid()`'s confirmed tickets, against the published actual picks.

**Why `SECURITY DEFINER` for `my_ticket_scores`**: the function reads `contest_results`, which has no SELECT policy. `SECURITY DEFINER` lets the function read past RLS while `auth.uid()` still resolves to the JWT caller's id (Supabase pattern), so users only ever see scores for their own tickets.

**Why winner determination is computed live, not persisted**: actual_picks are immutable post-publish (UI + API both lock); confirmed tickets are immutable under RLS. So the score function is deterministic. Persisting a separate `winners` table would create a synchronization burden with no benefit. If perf ever matters, wrap the helpers with `unstable_cache` and `revalidateTag('results')` on publish.

---

## Database

```sql
create table public.contest_results (
  id            int primary key default 1,
  actual_picks  jsonb not null,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint contest_results_singleton check (id = 1),
  constraint contest_results_picks_len check (jsonb_array_length(actual_picks) = 5)
);

alter table public.contest_results enable row level security;
-- No public policies. All reads go through the SECURITY DEFINER RPCs below,
-- so unpublished drafts never leak.

create or replace function public.public_results()
returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object('picks', actual_picks, 'published_at', published_at)
  from public.contest_results
  where id = 1 and published_at is not null;
$$;

create or replace function public.public_winners()
returns table (ticket_id text, score int, prize_share int)
language sql security definer set search_path = public as $$
  with actual as (
    select (pick->>'rank')::int as rank,
           pick->>'contestantId' as contestant_id
    from public.contest_results,
         lateral jsonb_array_elements(actual_picks) as pick
    where id = 1 and published_at is not null
  ),
  pool as (
    select count(*)::int * 30 as prize_pool
    from public.tickets where status = 'confirmed'
  ),
  scored as (
    select t.id,
      coalesce(sum(
        case when (t_pick->>'contestantId') = a.contestant_id
        then 6 - a.rank else 0 end
      ), 0)::int as score
    from public.tickets t
    cross join lateral jsonb_array_elements(t.picks) as t_pick
    left join actual a on a.rank = (t_pick->>'rank')::int
    where t.status = 'confirmed' and exists (select 1 from actual)
    group by t.id
  ),
  top_scored as (
    select * from scored where score > 0 and score = (select max(score) from scored)
  )
  select ts.id, ts.score,
    ((select prize_pool from pool) / greatest((select count(*) from top_scored), 1))::int
  from top_scored ts;
$$;

create or replace function public.my_ticket_scores()
returns table (ticket_id text, score int)
language sql security definer set search_path = public as $$
  with actual as (
    select (pick->>'rank')::int as rank,
           pick->>'contestantId' as contestant_id
    from public.contest_results,
         lateral jsonb_array_elements(actual_picks) as pick
    where id = 1 and published_at is not null
  )
  select t.id,
    coalesce(sum(
      case when (t_pick->>'contestantId') = a.contestant_id
      then 6 - a.rank else 0 end
    ), 0)::int as score
  from public.tickets t
  cross join lateral jsonb_array_elements(t.picks) as t_pick
  left join actual a on a.rank = (t_pick->>'rank')::int
  where t.user_id = auth.uid()
    and t.status = 'confirmed'
    and exists (select 1 from actual)
  group by t.id;
$$;

revoke all on function public.public_results()    from public;
revoke all on function public.public_winners()    from public;
revoke all on function public.my_ticket_scores()  from public;
grant execute on function public.public_results()    to anon, authenticated;
grant execute on function public.public_winners()    to anon, authenticated;
grant execute on function public.my_ticket_scores()  to authenticated;
```

The `where score > 0` clause in `public_winners()` matters: if the actual top 5 happens to be 5 contestants nobody picked, every confirmed ticket scores 0 — no one should be a "winner of nothing." In that case `public_winners()` returns empty and the public page shows "Esta vez nadie acertó suficiente para llevarse la bolsa."

---

## Files created

### Shared
- Extended `lib/raffle/types.ts` with `PublishedResults`, `WinnerTicket`, `MyTicketScore`, `MAX_TICKET_SCORE`.

### Server data
- `lib/data/results-server.ts` — `getPublishedResults()`, `getPublicWinners()`, `getMyTicketScores()`. All wrapped in React `cache()`; all use the anon-keyed server client (RPCs are granted to `anon`/`authenticated`).
- `lib/data/admin-results-server.ts` — `getAdminResults()` using the service-role client (RLS blocks anon on `contest_results`).

### API routes
- `app/api/admin/results/route.ts` — `GET` (admin reads current draft) and `PUT` (admin saves draft; rejects with 409 if already published; validates picks via the existing `validatePicks` helper).
- `app/api/admin/results/publish/route.ts` — `POST` (admin publishes; rejects with 400 if draft is missing/incomplete, 409 if already published).

### Admin UI
- `app/admin/results/page.tsx` — server component; loads contestants + draft state in parallel.
- `components/admin/ResultsForm.tsx` — client component. Pre-publish: 5 dropdowns (one per rank), "Guardar borrador" + "Publicar resultados" buttons. Once published: locked read-only view with a hint about the SQL escape hatch.

### Public results
- `app/resultados/page.tsx` — server component. Pre-publish: teaser. Post-publish: 5-card top-5 grid (queen card glows gold) + "Ganadores" list with ticket id, score, and `prize_share` formatted as MXN.

---

## Files modified

- `components/dashboard/TicketCard.tsx` — accepts optional `score` and `isWinner`; renders a "Ganador" gold badge in place of the status badge when winning, plus a "Puntaje X / 15" line. Card gets a gold border + glow when a winner.
- `components/dashboard/DashboardClient.tsx` — accepts `scores: Map<string, number>` and `winnerTicketIds: Set<string>`; threads them into `<TicketCard />`.
- `app/dashboard/page.tsx` — fetches `getMyTicketScores()` and `getPublicWinners()` in parallel with the existing data and passes both into `DashboardClient`.
- `app/page.tsx` — adds "Resultados" links in the site header and footer.
- `app/dashboard/page.tsx`, `app/ranking/page.tsx` — add "Resultados" link in their nav.
- `app/admin/layout.tsx` — adds an internal admin nav with "Confirmaciones" and "Resultados" tabs alongside the LogoutButton.

`middleware.ts` was *not* changed — `/resultados` is intentionally public (not in `PROTECTED_PREFIXES`), so anyone can see results.

---

## Verification

1. SQL block runs cleanly. `select * from contest_results;` → 0 rows.
2. As admin, visit `/admin/results`. Pick 5 contestants in order. "Guardar borrador" → 200; reload, picks persist.
3. SQL probe: `select published_at from contest_results;` → null. `select public_results();` → null.
4. As any user, visit `/resultados` → teaser is shown.
5. Click "Publicar resultados", confirm modal. Page locks; SQL: `published_at` set.
6. `/resultados` now shows the top-5 grid + ganadores list.
7. `/dashboard` shows your ticket(s) with their score `X / 15`. Tickets at the top score get a gold "Ganador" badge and the card glows gold.
8. Synthetic-data probe (run during development) confirmed:
   - Unpublished → `public_results` null, `public_winners` empty.
   - Published, 1 perfect ticket out of N → that ticket is the lone winner, `prize_share = N * 30`.
   - Published, 2 perfect tickets → both are winners, each receives `2N * 30 / 2 = N * 30`.
   - Tickets with score 0 (no exact matches) are excluded from winners.
   - Tickets with non-max score (e.g. 6 from a partial match) are excluded.
9. After publish, attempting `PUT /api/admin/results` from any client → 409 `"Los resultados ya están publicados…"`.
10. `pnpm typecheck` clean.

---

## Risks / things to watch

- **Locked publish**: by design, no in-app unpublish. If the operator publishes wrong picks, they edit via SQL. This is a deliberate trade against accidental "unpublish-after-public" footguns. Reconsider if the operator workflow proves clumsy.
- **Integer-division remainder**: when `prize_pool / winner_count` doesn't divide evenly, the floor leaves a small remainder unaccounted (e.g. $2 on a $30/7 split). The operator handles this informally. If we ever need exact accounting, switch to fractional `numeric` or a per-winner remainder distribution policy.
- **`SECURITY DEFINER` permission grants**: the `revoke all` followed by explicit `grant execute to anon, authenticated` is essential. Don't skip those lines if the SQL is ever re-run. Postgres defaults to "executable by public," which would let unauthenticated callers reach functions that aren't intended for them.
- **Score-0 winners are intentionally excluded**: if `public_winners()` ever returned everyone with score 0, the prize-pool math would degrade ($X / N for arbitrarily large N). The `where score > 0` filter handles this. The downside: in the (vanishingly unlikely) scenario where no one scored above 0, no ticket wins anything — the pool is operationally rolled over or refunded. Document for the operator.
- **`contest_results` is a singleton**: enforced by `check (id = 1)` plus `default 1`. If we ever want multi-season results, replace the singleton with a `season_id` column and adjust the RPC `where` clauses.
- **Aggregations are uncached**: same caveat as Phase 2. Wrap in `unstable_cache` if `/resultados` traffic gets bursty post-publish.

---

## Out of scope

- Email/SMS notifications when results are published.
- Per-rank "near miss" credit (any-position match or distance-decay scoring).
- Operator unpublish UI (intentionally SQL-only).
- Ticket-purchase deadline enforcement (a separate phase).
- Public showcase of non-winning ticket scores ("you placed Nth out of M") — currently each user only sees their own score.
- Results history if the contest is re-run across seasons.
