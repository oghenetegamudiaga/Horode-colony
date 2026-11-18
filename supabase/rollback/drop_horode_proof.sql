-- ==============================================================================
-- Horode Proof: Safe Rollback Script
-- Location: /supabase/rollback/drop_horode_proof.sql
-- Description: Completely removes schema 'horode_proof' and the private
--              storage bucket 'horode-proof-slides'.
-- Safety: NEVER RUN AUTOMATICALLY. Explicit manual execution only.
--         Does NOT touch the public schema or any table/bucket outside horode_proof.
-- ==============================================================================

-- 1. Remove storage objects inside the horode-proof-slides bucket
DELETE FROM storage.objects
WHERE bucket_id = 'horode-proof-slides';

-- 2. Remove the horode-proof-slides storage bucket
DELETE FROM storage.buckets
WHERE id = 'horode-proof-slides';

-- 3. Drop the horode_proof schema and all its contained tables, sequences, routines
DROP SCHEMA IF EXISTS horode_proof CASCADE;
