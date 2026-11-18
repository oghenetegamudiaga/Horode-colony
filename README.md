# Horode Proof

> A quiet, document-first web proofreading workspace built for brand designers at Horode Design Studio.

---

## Overview

Horode Proof allows designers to upload exported social media slides (carousels, single posts) and flag typos, grammar errors, inconsistencies, and leftover text, then suggests fixes.

**Milestone M0 (Foundations)** implements the core architecture:
- Next.js (App Router) + TypeScript + Tailwind CSS
- Notion-style quiet app shell with collapsible sidebar (260px) and command palette (`Ctrl+K` / `Cmd+K`)
- Design tokens with Dark mode default, Light mode, and System preference follow (persisted)
- Strict icon policy: zero icon libraries, only 4 inline SVG glyphs (sidebar toggle, chevron, ellipsis, close)
- Isolated PostgreSQL schema (`horode_proof`) and private Supabase storage bucket (`horode-proof-slides`)
- Validated environment module (Zod) with fail-fast startup protection
- Strict security headers (CSP, frame options, no-sniff, referrer policy)
- GitHub Actions CI workflow (lint, typecheck, build, security audit)

---

## Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router) with React 18 & TypeScript
- **Styling:** Tailwind CSS with CSS design tokens
- **Primitives:** Radix UI dialog / cmdk command palette
- **Icons:** Strict zero-library policy. 4 inline SVGs only (`SidebarToggleGlyph`, `ChevronGlyph`, `EllipsisGlyph`, `CloseGlyph`)
- **Database & Storage:** Supabase (PostgreSQL `horode_proof` schema & private `horode-proof-slides` bucket)
- **Validation:** Zod

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+
- npm (or npm.cmd on Windows)

### 1. Clone & Install
```bash
git clone https://github.com/oghenetegamudiaga/Horode-colony.git
cd Horode-colony
git checkout feat/m0-foundations
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required variables:
```env
# Application Identity
NEXT_PUBLIC_APP_NAME="Horode Proof"

# Supabase Shared Project Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-Only Privileged Key (Never exposed to client)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Default Retention
DEFAULT_RETENTION_DAYS=30
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application shell.

---

## Shared Supabase Project Setup (Manual Steps)

Because Horode Proof shares an existing Supabase project hosting another app, it is completely isolated in the `horode_proof` schema and `horode-proof-slides` bucket.

### Step 1: Pre-Flight Inspection (Read-Only)
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run the script located in `supabase/inspect_shared_project.sql`.
3. Confirm:
   - Schema `horode_proof` does not already exist.
   - Bucket `horode-proof-slides` does not already exist.
   - No conflicting objects exist.

### Step 2: Apply Migration
1. In the Supabase **SQL Editor**, open and execute `supabase/migrations/20261118000001_create_horode_proof_schema.sql`.
2. This creates:
   - Schema `horode_proof`
   - Tables: `workspaces`, `clients`, `dictionary_terms`, `ignore_rules`, `checks`, `slides`, `issues`, `usage_log`
   - Initial seed workspace: `'Horode Design Studio'`
   - Row-Level Security enabled on all tables with default-deny (0 policies)
   - Permissions revoked from `anon` and `authenticated`; granted exclusively to `service_role`
   - Future default privileges locked down to `service_role` only
   - Private storage bucket `horode-proof-slides` with `public = false`

### Step 3: Verify Bucket Privacy
1. Go to **Storage** -> **Buckets** in your Supabase dashboard.
2. Confirm `horode-proof-slides` is listed as **Private** (Public toggle disabled).

### Step 4: Verify Data API Schema Exposure (If using PostgREST)
1. In Supabase Dashboard -> **Project Settings** -> **API**.
2. Under **Exposed schemas**, add `horode_proof` alongside any existing schemas if direct PostgREST querying is desired.
3. *Note:* Because `anon` and `authenticated` roles have all privileges revoked on `horode_proof`, exposing the schema via PostgREST remains completely secure and returns 401/403 for client-side queries.

### Rollback
If you ever need to completely remove Horode Proof from the shared database without touching the other application, run `supabase/rollback/drop_horode_proof.sql` in the SQL Editor.

---

## Deployment to Vercel

1. Push your branch or merge `feat/m0-foundations` into `main`.
2. Import the repository in [Vercel](https://vercel.com).
3. Configure Environment Variables in the Vercel Project Settings:
   - `NEXT_PUBLIC_APP_NAME`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEFAULT_RETENTION_DAYS`
4. Deploy!

---

## Operational Endpoints & Security

- `GET /api/health`: Returns `{ "status": "ok" }`. Validates connectivity to the isolated `horode_proof` schema without leaking any connection details, paths, or environment variables.
- Strict CSP headers configured in `next.config.mjs` with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- Server-only modules protected via `import 'server-only'` and runtime environment isolation.
