-- Server-side vector search with service role: avoids `current_org_id()` recursion in JWT-backed `match_chunks`.
-- Only `service_role` may execute; org is supplied by trusted API code after auth (`getCurrentOrgContext`).
-- Required parameters first; defaults last (PostgreSQL rule 42P13). Supabase JS rpc() sends named JSON keys.

-- Remove invalid / older overloads if present (signature changed).
drop function if exists public.match_chunks_for_org(int, float, uuid, vector(1536));
drop function if exists public.match_chunks_for_org(vector(1536), int, float, uuid);

create or replace function match_chunks_for_org(
  query_embedding vector(1536),
  p_org_id uuid,
  match_count int default 5,
  min_similarity float default 0.2
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    dc.id,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  where dc.org_id = p_org_id
    and dc.embedding is not null
    and 1 - (dc.embedding <=> query_embedding) >= min_similarity
  order by dc.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

revoke all on function match_chunks_for_org(vector(1536), uuid, int, float) from public;
grant execute on function match_chunks_for_org(vector(1536), uuid, int, float) to service_role;
