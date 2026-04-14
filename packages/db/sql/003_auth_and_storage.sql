alter table users
  alter column id drop default;

do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_name = 'users'
      and constraint_name = 'users_id_fkey_auth'
  ) then
    alter table users
      add constraint users_id_fkey_auth
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
end $$;

create or replace function current_org_id()
returns uuid
language sql
stable
as $$
  select u.org_id
  from users u
  where u.id = auth.uid()
  limit 1;
$$;

drop policy if exists org_isolation_organizations on organizations;
drop policy if exists org_isolation_users on users;
drop policy if exists org_isolation_documents on documents;
drop policy if exists org_isolation_document_chunks on document_chunks;
drop policy if exists org_isolation_questionnaires on questionnaires;
drop policy if exists org_isolation_questionnaire_questions on questionnaire_questions;
drop policy if exists org_isolation_trust_center_pages on trust_center_pages;
drop policy if exists org_isolation_trust_center_documents on trust_center_documents;
drop policy if exists org_isolation_audit_logs on audit_logs;

create policy organizations_select on organizations for select using (id = current_org_id());
create policy organizations_insert on organizations for insert with check (true);
create policy organizations_update on organizations for update using (id = current_org_id()) with check (id = current_org_id());

create policy users_select on users for select using (org_id = current_org_id());
create policy users_insert on users for insert with check (id = auth.uid() and org_id is not null);
create policy users_update on users for update using (id = auth.uid()) with check (org_id = current_org_id());

create policy documents_select on documents for select using (org_id = current_org_id());
create policy documents_insert on documents for insert with check (org_id = current_org_id());
create policy documents_update on documents for update using (org_id = current_org_id()) with check (org_id = current_org_id());
create policy documents_delete on documents for delete using (org_id = current_org_id());

create policy document_chunks_select on document_chunks for select using (org_id = current_org_id());
create policy document_chunks_insert on document_chunks for insert with check (org_id = current_org_id());
create policy document_chunks_update on document_chunks for update using (org_id = current_org_id()) with check (org_id = current_org_id());
create policy document_chunks_delete on document_chunks for delete using (org_id = current_org_id());

create policy questionnaires_select on questionnaires for select using (org_id = current_org_id());
create policy questionnaires_insert on questionnaires for insert with check (org_id = current_org_id());
create policy questionnaires_update on questionnaires for update using (org_id = current_org_id()) with check (org_id = current_org_id());
create policy questionnaires_delete on questionnaires for delete using (org_id = current_org_id());

create policy questionnaire_questions_select on questionnaire_questions for select using (org_id = current_org_id());
create policy questionnaire_questions_insert on questionnaire_questions for insert with check (org_id = current_org_id());
create policy questionnaire_questions_update on questionnaire_questions for update using (org_id = current_org_id()) with check (org_id = current_org_id());
create policy questionnaire_questions_delete on questionnaire_questions for delete using (org_id = current_org_id());

create policy trust_center_pages_select on trust_center_pages for select using (org_id = current_org_id() or is_published = true);
create policy trust_center_pages_insert on trust_center_pages for insert with check (org_id = current_org_id());
create policy trust_center_pages_update on trust_center_pages for update using (org_id = current_org_id()) with check (org_id = current_org_id());
create policy trust_center_pages_delete on trust_center_pages for delete using (org_id = current_org_id());

create policy trust_center_documents_select on trust_center_documents for select using (org_id = current_org_id());
create policy trust_center_documents_insert on trust_center_documents for insert with check (org_id = current_org_id());
create policy trust_center_documents_update on trust_center_documents for update using (org_id = current_org_id()) with check (org_id = current_org_id());
create policy trust_center_documents_delete on trust_center_documents for delete using (org_id = current_org_id());

create policy audit_logs_select on audit_logs for select using (org_id = current_org_id());
create policy audit_logs_insert on audit_logs for insert with check (org_id = current_org_id());

insert into storage.buckets (id, name, public)
values ('knowledge-base', 'knowledge-base', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('questionnaires', 'questionnaires', false)
on conflict (id) do nothing;

drop policy if exists "knowledge_base_org_read" on storage.objects;
drop policy if exists "knowledge_base_org_insert" on storage.objects;
drop policy if exists "knowledge_base_org_update" on storage.objects;
drop policy if exists "knowledge_base_org_delete" on storage.objects;
drop policy if exists "questionnaires_org_read" on storage.objects;
drop policy if exists "questionnaires_org_insert" on storage.objects;
drop policy if exists "questionnaires_org_update" on storage.objects;
drop policy if exists "questionnaires_org_delete" on storage.objects;

create policy "knowledge_base_org_read"
on storage.objects
for select
to authenticated
using (bucket_id = 'knowledge-base' and split_part(name, '/', 1) = current_org_id()::text);

create policy "knowledge_base_org_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'knowledge-base' and split_part(name, '/', 1) = current_org_id()::text);

create policy "knowledge_base_org_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'knowledge-base' and split_part(name, '/', 1) = current_org_id()::text)
with check (bucket_id = 'knowledge-base' and split_part(name, '/', 1) = current_org_id()::text);

create policy "knowledge_base_org_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'knowledge-base' and split_part(name, '/', 1) = current_org_id()::text);

create policy "questionnaires_org_read"
on storage.objects
for select
to authenticated
using (bucket_id = 'questionnaires' and split_part(name, '/', 1) = current_org_id()::text);

create policy "questionnaires_org_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'questionnaires' and split_part(name, '/', 1) = current_org_id()::text);

create policy "questionnaires_org_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'questionnaires' and split_part(name, '/', 1) = current_org_id()::text)
with check (bucket_id = 'questionnaires' and split_part(name, '/', 1) = current_org_id()::text);

create policy "questionnaires_org_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'questionnaires' and split_part(name, '/', 1) = current_org_id()::text);
