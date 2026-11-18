-- ==============================================================================
-- Migration: 20261118000001_create_horode_proof_schema.sql
-- Description: Isolated schema, tables, RLS lockdown, and private storage bucket
--              for Horode Proof on shared Supabase project.
-- Safety: ONLY creates objects within schema 'horode_proof' and storage bucket
--         'horode-proof-slides'. Zero DROP, TRUNCATE, or ALTER on outside objects.
-- ==============================================================================

-- 1. Create isolated schema
CREATE SCHEMA IF NOT EXISTS horode_proof;

-- 2. Create tables inside horode_proof
CREATE TABLE IF NOT EXISTS horode_proof.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS horode_proof.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES horode_proof.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    default_strictness TEXT NOT NULL DEFAULT 'standard' CHECK (default_strictness IN ('relaxed', 'standard', 'strict')),
    language_variant TEXT NOT NULL DEFAULT 'en-GB',
    tone_note TEXT,
    retention_days INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS horode_proof.dictionary_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES horode_proof.clients(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS horode_proof.ignore_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES horode_proof.clients(id) ON DELETE CASCADE,
    original TEXT NOT NULL,
    rule_type TEXT NOT NULL DEFAULT 'exact',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS horode_proof.checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES horode_proof.clients(id) ON DELETE CASCADE,
    strictness TEXT NOT NULL DEFAULT 'standard' CHECK (strictness IN ('relaxed', 'standard', 'strict')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    slide_count INTEGER NOT NULL DEFAULT 0,
    issue_count INTEGER NOT NULL DEFAULT 0,
    cost_estimate NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS horode_proof.slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL REFERENCES horode_proof.checks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    slide_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS horode_proof.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slide_id UUID NOT NULL REFERENCES horode_proof.slides(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    original TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    reason TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
    bbox JSONB,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'ignored')),
    scope TEXT NOT NULL DEFAULT 'slide' CHECK (scope IN ('slide', 'cross_slide')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS horode_proof.usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL REFERENCES horode_proof.checks(id) ON DELETE CASCADE,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    cost_estimate NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Seed Horode Design Studio workspace (single row)
INSERT INTO horode_proof.workspaces (name)
SELECT 'Horode Design Studio'
WHERE NOT EXISTS (
    SELECT 1 FROM horode_proof.workspaces WHERE name = 'Horode Design Studio'
);

-- 4. Enable Row Level Security (RLS) on all horode_proof tables (deny-by-default, no public policies)
ALTER TABLE horode_proof.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE horode_proof.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE horode_proof.dictionary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE horode_proof.ignore_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE horode_proof.checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE horode_proof.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE horode_proof.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE horode_proof.usage_log ENABLE ROW LEVEL SECURITY;

-- 5. Strict Permission Lockdown
-- Revoke all access from anon and authenticated roles
REVOKE ALL ON SCHEMA horode_proof FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA horode_proof FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA horode_proof FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL ROUTINES IN SCHEMA horode_proof FROM PUBLIC, anon, authenticated;

-- Grant usage and permissions to service_role ONLY
GRANT USAGE ON SCHEMA horode_proof TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA horode_proof TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA horode_proof TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA horode_proof TO service_role;

-- Ensure future objects inside horode_proof do not grant access to anon or authenticated
ALTER DEFAULT PRIVILEGES IN SCHEMA horode_proof REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA horode_proof REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA horode_proof REVOKE ALL ON ROUTINES FROM PUBLIC, anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA horode_proof GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA horode_proof GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA horode_proof GRANT ALL ON ROUTINES TO service_role;

-- 6. Create dedicated private storage bucket (horode-proof-slides)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'horode-proof-slides',
    'horode-proof-slides',
    false,
    52428800, -- 50 MB
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = false;
