-- 2026-05-01: include each winning ticket's picks in `public_winners()` so
-- /resultados can show *what* the winners predicted, not just the ticket id
-- and score. Picks are non-PII (just contestant ids + ranks); results are
-- already published when this is shown, so there is no strategy leak.
--
-- Run via Supabase SQL editor (or `supabase db push` if migrations are wired up).
--
-- Postgres refuses `create or replace` when the return-table shape changes,
-- so the existing function is dropped first. Permission grants must be
-- re-applied below since drop wipes them.

drop function if exists public.public_winners();

create function public.public_winners()
returns table (ticket_id text, score int, prize_share int, picks jsonb)
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
    select t.id, t.picks,
      coalesce(sum(
        case when (t_pick->>'contestantId') in (select contestant_id from actual_ids)
        then 1 else 0 end
      ), 0)::int as score
    from public.tickets t
    cross join lateral jsonb_array_elements(t.picks) as t_pick
    where t.status = 'confirmed' and exists (select 1 from actual_ids)
    group by t.id, t.picks
  ),
  top_scored as (
    select * from scored where score > 0 and score = (select max(score) from scored)
  )
  select ts.id, ts.score,
    ((select prize_pool from pool) / greatest((select count(*) from top_scored), 1))::int,
    ts.picks
  from top_scored ts;
$$;

-- Re-apply permission grants (drop wiped them).
revoke all on function public.public_winners() from public;
grant execute on function public.public_winners() to anon, authenticated;
