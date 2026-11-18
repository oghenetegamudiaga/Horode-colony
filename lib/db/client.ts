import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { getServerEnv } from '@/lib/config/env';

/**
 * Server-only Supabase admin client.
 * Uses the privileged service_role key to access the isolated 'horode_proof' schema.
 * Never import or invoke this on the client side.
 */
export function getServiceClient() {
  const env = getServerEnv();

  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    db: {
      schema: 'horode_proof',
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
