# TrustRespond Monorepo

Execution-ready monorepo for TrustRespond:
- `apps/web`: Next.js app (landing + app + public trust center routes)
- `apps/worker`: background worker scaffold for ingestion/generation jobs
- `packages/db`: schema SQL, RLS and quota service primitives
- `packages/ai`: questionnaire answer generation pipeline primitives
- `packages/parsers`: ingestion and questionnaire parsing primitives
- `packages/ui`: shared UI primitives
- `packages/config`: environment schema validation

## Quick Start

1. Copy `.env.example` to `.env` and fill values.
2. Run `npm install`.
3. Run `npm run dev`.

## Included Blueprint Features

- Multi-tenant schema foundation with RLS and append-only audit logs
- Knowledge ingestion and chunking primitives
- Questionnaire generation/review workflow primitives
- Trust center public route foundation
- Billing quota reservation service foundation
- Marketing landing page aligned to blueprint messaging
