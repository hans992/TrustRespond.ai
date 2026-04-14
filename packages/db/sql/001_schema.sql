create extension if not exists vector;

create type plan_tier as enum ('free', 'starter', 'pro', 'enterprise');
create type user_role as enum ('owner', 'admin', 'member');
create type doc_type as enum ('pdf', 'docx', 'xlsx', 'csv');
create type doc_status as enum ('processing', 'ready', 'error');
create type questionnaire_status as enum ('uploaded', 'processing', 'review', 'completed', 'exported');
create type confidence_level as enum ('high', 'medium', 'low');
create type review_status as enum ('pending', 'generated', 'approved', 'edited', 'rejected');
create type trust_category as enum ('soc2', 'iso27001', 'gdpr', 'pentest', 'insurance', 'custom');
create type trust_access as enum ('public', 'nda_required', 'request_only');

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  plan plan_tier not null default 'free',
  stripe_customer_id varchar(255),
  monthly_quota int not null default 1,
  quota_used int not null default 0,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  email varchar(320) not null unique,
  name varchar(255),
  role user_role not null default 'member',
  auth_provider varchar(64),
  last_signed_in timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  uploaded_by uuid references users(id),
  filename varchar(512) not null,
  file_type doc_type not null,
  s3_key varchar(1024),
  status doc_status not null default 'processing',
  page_count int default 0,
  created_at timestamptz not null default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  document_id uuid not null references documents(id),
  content text not null,
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  tsv tsvector,
  created_at timestamptz not null default now()
);

create table if not exists questionnaires (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  uploaded_by uuid references users(id),
  prospect_name varchar(255),
  filename varchar(512) not null,
  file_type doc_type not null,
  s3_key_original varchar(1024),
  s3_key_completed varchar(1024),
  status questionnaire_status not null default 'uploaded',
  total_questions int default 0,
  auto_answered int default 0,
  flagged_for_review int default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists questionnaire_questions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  questionnaire_id uuid not null references questionnaires(id),
  question_text text not null,
  answer_text text,
  confidence confidence_level,
  status review_status not null default 'pending',
  source_chunks jsonb not null default '[]'::jsonb,
  cell_reference varchar(32),
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists trust_center_pages (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  slug varchar(128) not null unique,
  title varchar(255) not null,
  description text,
  branding jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  nda_required boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists trust_center_documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  trust_center_id uuid not null references trust_center_pages(id),
  document_id uuid not null references documents(id),
  display_name varchar(255),
  category trust_category not null default 'custom',
  access_level trust_access not null default 'public',
  download_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  user_id uuid references users(id),
  action varchar(128) not null,
  resource_type varchar(64) not null,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_document_chunks_embedding on document_chunks using ivfflat (embedding vector_cosine_ops);
create index if not exists idx_document_chunks_tsv on document_chunks using gin (tsv);
