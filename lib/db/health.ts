import 'server-only';
import { getServiceClient } from './client';

export interface HealthCheckResult {
  ok: boolean;
  schemaAccessible: boolean;
}

/**
 * Validates connection to the isolated horode_proof schema.
 * Returns boolean flags only. Leaks zero error messages, stacks, or connection details.
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  try {
    const supabase = getServiceClient();

    // Query workspaces table in horode_proof schema to confirm schema existence and permissions
    const { error } = await supabase
      .from('workspaces')
      .select('id')
      .limit(1);

    if (error) {
      return { ok: false, schemaAccessible: false };
    }

    return { ok: true, schemaAccessible: true };
  } catch {
    return { ok: false, schemaAccessible: false };
  }
}
