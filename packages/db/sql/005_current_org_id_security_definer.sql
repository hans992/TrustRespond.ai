-- Avoid RLS recursion: policies on `users` used `org_id = current_org_id()`, while
-- `current_org_id()` itself SELECTs `users`, which re-entered policies → 54001 / statement_too_complex.

create or replace function public.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.org_id
  from public.users u
  where u.id = auth.uid()
  limit 1;
$$;

grant execute on function public.current_org_id() to authenticated;
grant execute on function public.current_org_id() to service_role;
