create or replace function match_chunks(
  query_embedding vector(1536),
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
security invoker
as $$
  select
    dc.id,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  where dc.org_id = current_org_id()
    and dc.embedding is not null
    and 1 - (dc.embedding <=> query_embedding) >= min_similarity
  order by dc.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

grant execute on function match_chunks(vector(1536), int, float) to authenticated;
