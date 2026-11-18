-- ==============================================================================
-- Horode Proof: Read-Only Shared Supabase Project Pre-Flight Inspection
-- Purpose: Inspect existing schemas, tables, functions, triggers, and buckets
--          to confirm zero namespace collisions and verify isolation safety.
-- Safety: READ-ONLY. No DDL, no modifications, no deletes, no side effects.
-- ==============================================================================

-- 1. Check for schema collision
SELECT 
  schema_name,
  schema_owner
FROM information_schema.schemata
WHERE schema_name IN ('horode_proof', 'horode-proof', 'horodeproof');

-- 2. Check for storage bucket collision
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id IN ('horode-proof-slides', 'slides');

-- 3. Check for any existing tables with target names across all non-system schemas
SELECT 
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_name IN (
  'workspaces',
  'clients',
  'dictionary_terms',
  'ignore_rules',
  'checks',
  'slides',
  'issues',
  'usage_log'
)
AND table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

-- 4. Check RLS status on existing tables in the database (to understand project baseline)
SELECT 
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY schemaname, tablename;

-- 5. List all active schemas in the project
SELECT 
  schema_name,
  schema_owner
FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY schema_name;
