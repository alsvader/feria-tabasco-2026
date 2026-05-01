-- 2026-05-01: expose every confirmed ticket's score + picks (not just winners)
-- so /resultados can show "the rest of the boletos" once results are published.
-- Contains no PII (only ticket id, score, contestant ids); safe for anon.
--
-- Run via Supabase SQL editor.

create or replace function public.public_ticket_results()
returns table (ticket_id text, score int, picks jsonb)
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
    ), 0)::int as score,
    t.picks
  from public.tickets t
  cross join lateral jsonb_array_elements(t.picks) as t_pick
  where t.status = 'confirmed' and exists (select 1 from actual_ids)
  group by t.id, t.picks;
$$;

revoke all on function public.public_ticket_results() from public;
grant execute on function public.public_ticket_results() to anon, authenticated;
