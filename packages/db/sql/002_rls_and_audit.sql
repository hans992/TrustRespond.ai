alter table organizations enable row level security;
alter table users enable row level security;
alter table documents enable row level security;
alter table document_chunks enable row level security;
alter table questionnaires enable row level security;
alter table questionnaire_questions enable row level security;
alter table trust_center_pages enable row level security;
alter table trust_center_documents enable row level security;
alter table audit_logs enable row level security;

create policy org_isolation_organizations on organizations using (id = (auth.jwt() ->> 'org_id')::uuid);
create policy org_isolation_users on users using (org_id = (auth.jwt() ->> 'org_id')::uuid);
create policy org_isolation_documents on documents using (org_id = (auth.jwt() ->> 'org_id')::uuid);
create policy org_isolation_document_chunks on document_chunks using (org_id = (auth.jwt() ->> 'org_id')::uuid);
create policy org_isolation_questionnaires on questionnaires using (org_id = (auth.jwt() ->> 'org_id')::uuid);
create policy org_isolation_questionnaire_questions on questionnaire_questions using (org_id = (auth.jwt() ->> 'org_id')::uuid);
create policy org_isolation_trust_center_pages on trust_center_pages using (org_id = (auth.jwt() ->> 'org_id')::uuid);
create policy org_isolation_trust_center_documents on trust_center_documents using (org_id = (auth.jwt() ->> 'org_id')::uuid);
create policy org_isolation_audit_logs on audit_logs using (org_id = (auth.jwt() ->> 'org_id')::uuid);

create or replace function block_audit_mutations()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_logs is append-only';
end;
$$;

create trigger audit_logs_no_update_delete
before update or delete on audit_logs
for each row
execute function block_audit_mutations();
