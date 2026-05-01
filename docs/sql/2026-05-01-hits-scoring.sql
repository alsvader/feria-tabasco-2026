-- 2026-05-01: switch ticket scoring from exact-position match to order-agnostic hit count.
--
-- Each pick now scores 1 if its contestant appears anywhere in the official top 5,
-- 0 otherwise. Order in `actual_picks` is informational only. Maximum ticket score = 5.
--
-- Run via Supabase SQL editor (or `supabase db push` if migrations are wired up).
-- The function bodies are also kept in sync in docs/results-and-winners-plan.md.

create or replace function public.public_winners()
returns table (ticket_id text, score int, prize_share int)
language sql security definer set search_path = public as $$
  with actual_ids as (
    select pick->>'contestantId' as contestant_id
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
        case when (t_pick->>'contestantId') in (select contestant_id from actual_ids)
        then 1 else 0 end
      ), 0)::int as score
    from public.tickets t
    cross join lateral jsonb_array_elements(t.picks) as t_pick
    where t.status = 'confirmed' and exists (select 1 from actual_ids)
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
  with actual_ids as (
    select pick->>'contestantId' as contestant_id
    from public.contest_results,
         lateral jsonb_array_elements(actual_picks) as pick
    where id = 1 and published_at is not null
  )
  select t.id,
    coalesce(sum(
      case when (t_pick->>'contestantId') in (select contestant_id from actual_ids)
      then 1 else 0 end
    ), 0)::int as score
  from public.tickets t
  cross join lateral jsonb_array_elements(t.picks) as t_pick
  where t.user_id = auth.uid()
    and t.status = 'confirmed'
    and exists (select 1 from actual_ids)
  group by t.id;
$$;

-- Permission grants are unchanged from the original definition; re-running
-- `create or replace` preserves them. Re-grant explicitly only if perms drift.
