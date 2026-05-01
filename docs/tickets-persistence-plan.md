# Ticket Persistence + Operator Confirmation

## Context

Phase 1 moved auth and the contestants table to Supabase (see `supabase-integration-plan.md`). Tickets stayed local: a Zustand `tickets` array persisted to `localStorage` under `feria-tabasco-2026:v1`. That meant tickets evaporated when the browser cache cleared, weren't tied to a user, the "global" ranking and prize pool actually reflected one browser, and there was no way to know which tickets had been paid.

This phase moves tickets onto Supabase, scopes them per user via `auth.users.id`, introduces a `pending → confirmed` payment status, and turns the public ranking + prize pool into true cross-user aggregates of confirmed tickets only. The WhatsApp checkout flow stays — what changed is that the ticket is recorded in the DB *before* the WhatsApp link opens, and an operator confirms payment after the transfer clears.

### Decisions

1. **Confirmation workflow**: insert as `status='pending'` on `/pago`; operator confirms via an in-app `/admin/tickets` page gated by an `ADMIN_EMAILS` allowlist.
2. **Public numbers source**: ranking and prize pool count `confirmed` tickets only. Pending tickets show on the user's own dashboard with an "Esperando confirmación" badge but don't move public numbers.
3. **Existing localStorage**: discarded. Persist key bumped from `:v1` to `:v2`; no migration code.
4. **Prize pool formula**: `count(confirmed) * 30`. No seed baseline (`SEED_PRIZE_POOL` removed).

### Hard constraint (carried from Phase 1)

The browser must never call Supabase directly. All Supabase access goes through Next.js server code. No `NEXT_PUBLIC_*` env vars.

Protected routes now: `/seleccion`, `/revision`, `/pago`, `/dashboard`, **`/admin`**. Public: `/`, `/ranking`, `/login`.

---

## Architecture

**Write path**: `PaymentClient.handlePay()` → `POST /api/tickets`. The route validates the picks server-side against the live contestants list, generates a `BTL-XXXXXX` id, inserts under RLS as the authenticated user. Only on a 200 response does the client open the WhatsApp deep link with the **server-issued** id. If the insert fails, WhatsApp does not open and an inline error appears with a retry button — otherwise the operator would receive a WhatsApp message for a ticket that doesn't exist in the DB.

**Read paths (per-user)**: dashboard reads via `getMyTickets()` (server helper, RLS-scoped) and passes results down as props. Zustand no longer holds tickets.

**Read paths (public aggregations)**: ranking and prize pool read through two `SECURITY DEFINER` Postgres functions — `public_ranking()` and `public_prize_pool()`. They return aggregates only (no `user_id`, no per-row picks), so granting `execute` to `anon` doesn't expose PII. RLS on the underlying `tickets` table stays strict.

**Admin**: `/admin/tickets` lists pending tickets via the service-role client (joining emails from `auth.admin.listUsers`). "Confirmar pago" POSTs to `/api/admin/tickets/[id]/confirm`, which sets `status='confirmed'`, `confirmed_at`, and `confirmed_by` (audit). Email allowlist enforced via `requireAdmin()` in `lib/auth/admin.ts`. Middleware gates `/admin` to authenticated users; the email check happens at the route/page layer because middleware can't read `user.email` cheaply.

**Why `SECURITY DEFINER` over a relaxed RLS read policy or service-role aggregation**: a `status='confirmed'` public-read policy would expose `user_id` and `picks` of every confirmed ticket. Service-role from a server endpoint would bypass RLS entirely, which is a footgun if the helper is ever reused from the wrong context. The RPCs return only aggregates and minimize the privilege expansion.

**Why `picks jsonb` instead of a normalized `ticket_picks` table**: ranking RPC's `jsonb_array_elements` + `group by` is sub-millisecond at expected volumes. The `tickets_picks_len = 5` check + server-side validation cover integrity. Revisit only past ~100k confirmed tickets.

---

## Database

```sql
create table public.tickets (
  id            text primary key,                      -- "BTL-XXXXXX"
  user_id       uuid not null references auth.users(id) on delete cascade,
  picks         jsonb not null,                        -- [{contestantId, rank}] length 5
  total         int  not null,
  status        text not null default 'pending'
                check (status in ('pending', 'confirmed')),
  created_at    timestamptz not null default now(),
  confirmed_at  timestamptz,
  confirmed_by  uuid references auth.users(id),       -- audit
  constraint tickets_picks_len check (jsonb_array_length(picks) = 5)
);

create index tickets_user_id_created_at_idx on public.tickets (user_id, created_at desc);
create index tickets_status_confirmed_idx   on public.tickets (status) where status = 'confirmed';

alter table public.tickets enable row level security;

create policy "tickets_owner_select" on public.tickets
  for select using (auth.uid() = user_id);

create policy "tickets_owner_insert_pending" on public.tickets
  for insert with check (
    auth.uid() = user_id and status = 'pending' and confirmed_at is null
  );

-- No update/delete policies → blocked under RLS for everyone except service_role.
-- Confirmation goes through /api/admin/tickets/[id]/confirm using the admin client.

create or replace function public.public_prize_pool()
returns table (prize_pool int, ticket_count int)
language sql security definer set search_path = public as $$
  select count(*)::int * 30 as prize_pool,
         count(*)::int       as ticket_count
  from public.tickets where status = 'confirmed';
$$;

create or replace function public.public_ranking()
returns table (contestant_id text, score int)
language sql security definer set search_path = public as $$
  select pick->>'contestantId',
         sum(6 - (pick->>'rank')::int)::int
  from public.tickets t,
       lateral jsonb_array_elements(t.picks) as pick
  where t.status = 'confirmed'
  group by pick->>'contestantId'
  order by 2 desc;
$$;

revoke all on function public.public_prize_pool() from public;
revoke all on function public.public_ranking()    from public;
grant execute on function public.public_prize_pool() to anon, authenticated;
grant execute on function public.public_ranking()    to anon, authenticated;
```

`SECURITY DEFINER` runs the function as its owner; `revoke all` then explicit `grant execute` is required because Postgres defaults to executable-by-public.

Scoring weights: rank 1 → 5 pts, rank 2 → 4 pts, …, rank 5 → 1 pt (formula: `6 - rank`).

---

## Files created

### Shared (server-safe) modules
- `lib/raffle/types.ts` — `Rank`, `RankedPick`, `TicketStatus`, `Ticket` (with `status` and `confirmedAt`).
- `lib/raffle/constants.ts` — `TICKET_PRICE`, `TICKET_FEE`, `TICKET_TOTAL`. (`SEED_PRIZE_POOL` removed.)
- `lib/raffle/validate.ts` — `validatePicks(input, contestantIds)`: enforces array length 5, ranks form `{1..5}` exactly, `contestantId`s unique, all exist.

### Server data + auth helpers
- `lib/data/tickets-server.ts` — `getMyTickets()` (RLS-scoped, returns `[]` for anon), `getPrizePoolStats()` and `getPublicRanking()` (call the `SECURITY DEFINER` RPCs). All wrapped in React `cache()` for per-request memoization.
- `lib/data/admin-tickets-server.ts` — `listAdminTickets(status)` using the service-role client + `auth.admin.listUsers()` to attach emails.
- `lib/auth/admin.ts` — `ADMIN_EMAILS` parsed from env, `isAdmin(user)`, `requireAdmin()` (throws `AdminGateError` mapped by callers to 401/403/redirect).

### API routes
- `app/api/tickets/route.ts` — `POST`: auth check → 401, validate body → 400, generate `BTL-${shortId()}` and insert; on `23505` regenerate id once and retry. Returns `{ ticket }`.
- `app/api/admin/tickets/route.ts` — `GET ?status=…`: admin gate, delegates to `listAdminTickets()`.
- `app/api/admin/tickets/[id]/confirm/route.ts` — `POST`: admin gate, `update set status='confirmed', confirmed_at=now(), confirmed_by=admin.id where id=$1 and status='pending'`. Returns 409 `"Ya estaba confirmado."` if 0 rows affected.

### Admin UI
- `app/admin/layout.tsx` — server component, `requireAdmin()` then renders Wordmark + LogoutButton frame. Unauthenticated → `redirect('/login?redirectTo=/admin/tickets')`. Forbidden → `redirect('/')`.
- `app/admin/tickets/page.tsx` — server component, fetches pending tickets + contestants in parallel, renders `<AdminTicketsClient />`.
- `components/admin/AdminTicketsClient.tsx` — client component. Renders each pending ticket with the same `TicketCard` plus an email + "Confirmar pago" footer. Optimistically removes confirmed rows; surfaces server errors inline; treats 409 as success (already confirmed).

---

## Files modified

- `lib/store/raffle-store.ts` — removed `tickets`, `prizePool`, `purchaseTicket`. Bumped persist `name` to `feria-tabasco-2026:v2`. Re-exports types/constants from `lib/raffle/*` so existing import paths still resolve.
- `lib/config/whatsapp.ts` — `Ticket` import switched to `@/lib/raffle/types`.
- `components/payment/PaymentClient.tsx` — `handlePay` is async; replaces `purchaseTicket()` with `POST /api/tickets`; opens WhatsApp only on 200; new `submitting` and `error` phases with inline error and retry button; calls `router.refresh()` so a subsequent `/dashboard` navigation reads the new ticket.
- `components/dashboard/DashboardClient.tsx` — accepts `tickets` and `prizePool` as props, drops Zustand reads. "Probabilidad" stat now denominator-counts `confirmed` tickets only.
- `components/dashboard/TicketCard.tsx` — server-component-safe (no `"use client"`); renders status badge: green "Confirmado" or amber "Esperando confirmación".
- `components/ranking/RankingClient.tsx` — server-component-safe; accepts `ranking: RankingRow[]` prop; deleted the local `scorePicks()` (RPC owns it).
- `components/landing/PrizePoolCard.tsx` — server-component-safe; takes `prizePool` and `ticketCount` as props; reads value directly from RPC.
- `components/landing/Hero.tsx` — threads the two new props down to `PrizePoolCard`.
- `app/page.tsx` — async; awaits `getPrizePoolStats()` and passes to `<Hero />`.
- `app/dashboard/page.tsx` — awaits `getMyTickets()` and `getPrizePoolStats()` in parallel with contestants; passes both to `DashboardClient`.
- `app/ranking/page.tsx` — awaits `getPublicRanking()` in parallel with contestants; passes to `RankingClient`.
- `middleware.ts` — `PROTECTED_PREFIXES` includes `/admin`. Email-allowlist check stays in `requireAdmin()`.
- `.env.example` — added `ADMIN_EMAILS=` with documentation comment.

---

## Auth + admin model

Admin gating is by email allowlist (`ADMIN_EMAILS` env). Two admin entry points enforce it:

1. `requireAdmin()` is called from the admin layout (so the `/admin` page redirects non-admins) and from each admin API route (so direct fetches return 403). Defense in depth.
2. The admin client (`createAdminSupabase()`) uses the service-role key and is **only** invoked from `lib/data/admin-tickets-server.ts` and the confirm route. The service role bypasses RLS, so reuse from any other context would be a privilege escalation.

If non-confirm admin permissions are needed later, switch to a `user_roles` table; the allowlist scales poorly past one role.

---

## Verification

1. SQL block runs cleanly. `select count(*) from tickets;` → 0.
2. Log in. Pick 5 → `/pago` → "Pagar por WhatsApp". Network tab shows `POST /api/tickets` 200; the `BTL-XXXXXX` id in the response matches the WhatsApp `wa.me/...` deep link.
3. `/dashboard` → ticket listed with amber "Esperando confirmación" badge.
4. SQL probe: row exists with `status='pending'` and `user_id` matching.
5. Logged-in non-admin: `await fetch('/api/admin/tickets')` → 403; `/admin/tickets` direct visit redirects to `/`.
6. Public state pre-confirmation: `/` shows prize pool **$0** (no seed); `/ranking` empty teaser.
7. Add admin email to `ADMIN_EMAILS`, restart. Visit `/admin/tickets`, click "Confirmar pago": row disappears; SQL row now `status='confirmed', confirmed_at` set, `confirmed_by` matches admin id.
8. Reload `/`: prize pool **$30** with "1 en juego". `/ranking`: podium populates from confirmed picks. `/dashboard`: badge flips to green "Confirmado".
9. SQL probes:
   ```sql
   select * from public.public_prize_pool();   -- (30, 1)
   select * from public.public_ranking();      -- 5 rows summing to 15
   ```
10. Validation edge cases on `POST /api/tickets`: 4 picks, duplicate `contestantId`, fake `contestantId`, `rank: 7`, missing auth → all 400/401 with Spanish messages, no row inserted.
11. Two admin tabs racing on the same ticket → one 200, one 409 `"Ya estaba confirmado."`.
12. `pnpm typecheck` clean.
13. `pnpm build` then `grep -r 'supabase\.co' .next/static/chunks/` — no Supabase URLs in client bundles.
14. Clean browser profile → after one selection action, localStorage has only `feria-tabasco-2026:v2`.

The verification of the prize-pool formula was run via a synthetic-tickets probe (insert 1 confirmed → 30, insert another → 60, delete → 0). No seed baseline; only confirmed tickets count.

---

## Risks / things to watch

- **WhatsApp before DB**: if a ticket arrives via WhatsApp but doesn't appear in `/admin/tickets`, the operator should ignore it — that's the right failure mode (insert failed before the link opened).
- **Id collision retry-once**: `BTL-XXXXXX` is 6 chars over a 32-char alphabet (~10⁹ space). The retry-once path handles the negligible-probability collision; double-collisions return 500. We don't switch to UUID because it breaks the `BTL-XXXXXX` brand format.
- **Email allowlist**: simple by design. `confirmed_by` covers audit. If non-confirm admin actions are added, switch to a roles table.
- **Aggregations are uncached** at the Next layer. RPC-per-render is fine at expected volumes. If `/` traffic spikes, wrap `getPrizePoolStats()` and `getPublicRanking()` with `unstable_cache` and `revalidateTag('ranking')` from the confirm endpoint.
- **`SECURITY DEFINER` permissions**: the `revoke all` + scoped `grant execute` is essential. Don't drop those lines if the SQL ever gets re-run from scratch.

---

## Out of scope

- Cancellations / refunds (no `cancelled` status).
- Per-user RLS for any data other than tickets.
- Admin search/filter UI on `/admin/tickets`.
- A roles table; allowlist suffices until non-confirm admin actions are added.
