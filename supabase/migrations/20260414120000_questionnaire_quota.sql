-- Run in Supabase SQL Editor or via supabase db push.
-- Atomic monthly questionnaire quota per organization (UTC YYYY-MM).

create table if not exists public.org_questionnaire_usage (
  org_id uuid not null references public.organizations (id) on delete cascade,
  year_month text not null,
  used_count integer not null default 0,
  constraint org_questionnaire_usage_pkey primary key (org_id, year_month),
  constraint org_questionnaire_usage_ym_format check (year_month ~ '^\d{4}-\d{2}$'),
  constraint used_count_non_negative check (used_count >= 0)
);

create index if not exists org_questionnaire_usage_org_idx on public.org_questionnaire_usage (org_id);

alter table public.org_questionnaire_usage enable row level security;

create or replace function public.reserve_questionnaire_quota (p_org_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_ym text := to_char(timezone('utc', now()), 'YYYY-MM');
  v_limit integer;
  v_used integer;
begin
  if auth.uid () is null then
    raise exception 'not authenticated';
  end if;

  if not exists (
    select 1
    from public.users u
    where
      u.id = auth.uid ()
      and u.org_id = p_org_id
  ) then
    raise exception 'not authorized';
  end if;

  select o.plan into v_plan
  from public.organizations o
  where
    o.id = p_org_id
  for update;

  if not found then
    raise exception 'organization not found';
  end if;

  v_limit := case v_plan
    when 'free' then 1
    when 'starter' then 10
    when 'pro' then null
    when 'enterprise' then null
    else 1
  end;

  insert into public.org_questionnaire_usage (org_id, year_month, used_count)
  values (p_org_id, v_ym, 0)
  on conflict (org_id, year_month) do nothing;

  select u.used_count into v_used
  from public.org_questionnaire_usage u
  where
    u.org_id = p_org_id
    and u.year_month = v_ym
  for update;

  if not found then
    v_used := 0;
  end if;

  if v_limit is not null and v_used >= v_limit then
    raise exception 'Monthly questionnaire quota exceeded';
  end if;

  update public.org_questionnaire_usage
  set
    used_count = used_count + 1
  where
    org_id = p_org_id
    and year_month = v_ym
  returning used_count into v_used;

  return jsonb_build_object(
    'used',
    v_used,
    'remaining',
    case
      when v_limit is null then null
      else v_limit - v_used
    end,
    'limit',
    to_jsonb(v_limit),
    'yearMonth',
    v_ym
  );
end;
$$;

create or replace function public.get_questionnaire_quota_status (p_org_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_ym text := to_char(timezone('utc', now()), 'YYYY-MM');
  v_limit integer;
  v_used integer := 0;
begin
  if auth.uid () is null then
    raise exception 'not authenticated';
  end if;

  if not exists (
    select 1
    from public.users u
    where
      u.id = auth.uid ()
      and u.org_id = p_org_id
  ) then
    raise exception 'not authorized';
  end if;

  select o.plan into v_plan
  from public.organizations o
  where
    o.id = p_org_id;

  if not found then
    raise exception 'organization not found';
  end if;

  v_limit := case v_plan
    when 'free' then 1
    when 'starter' then 10
    when 'pro' then null
    when 'enterprise' then null
    else 1
  end;

  select coalesce(
    (
      select u.used_count
      from public.org_questionnaire_usage u
      where
        u.org_id = p_org_id
        and u.year_month = v_ym
    ),
    0
  ) into v_used;

  return jsonb_build_object(
    'used',
    v_used,
    'remaining',
    case
      when v_limit is null then null
      else greatest(v_limit - v_used, 0)
    end,
    'limit',
    to_jsonb(v_limit),
    'yearMonth',
    v_ym
  );
end;
$$;

revoke all on function public.reserve_questionnaire_quota (uuid) from public;

revoke all on function public.get_questionnaire_quota_status (uuid) from public;

grant execute on function public.reserve_questionnaire_quota (uuid) to authenticated;

grant execute on function public.get_questionnaire_quota_status (uuid) to authenticated;
