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

## CI and local checks

From the repo root:

- `npm run lint` — ESLint in workspaces that define a `lint` script (currently `apps/web`).
- `npm run typecheck` — TypeScript across workspaces.
- `npm run test` — Vitest unit tests.
- `npm run build -w @trustrespond/web` — production build for the Next app. Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (use your Supabase project values or the same placeholders as in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for compile-only verification).

GitHub Actions on push/PR runs install, lint, typecheck, unit tests, and the web build with CI-only public Supabase placeholders (not for production).

## E2E (Playwright)

The golden-path test lives under `apps/web/tests/e2e`. It starts `next dev`, loads env from the repo / `apps/web` `.env` files (see `apps/web/playwright.env.cjs`), and needs a real Supabase-backed user.

Run locally:

```bash
npm run test:e2e -w @trustrespond/web
```

CI does not run E2E on every PR (it needs live credentials and quota). Use the **E2E** workflow in GitHub Actions (`workflow_dispatch`) and configure these **repository secrets**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `E2E_USER_EMAIL`, `E2E_USER_PASSWORD`.

## AI Provider

- The RAG pipeline is configured for Google Gemini by default.
- Recommended defaults are:
  - Generation: `gemini-2.5-pro`
  - Embeddings: `text-embedding-004`

## Included Blueprint Features

- Multi-tenant schema foundation with RLS and append-only audit logs
- Knowledge ingestion and chunking primitives
- Questionnaire generation/review workflow primitives
- Trust center public route foundation
- Billing quota reservation service foundation
- Marketing landing page aligned to blueprint messaging
