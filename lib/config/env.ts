import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('Horode Proof'),
});

const serverSchema = z.object({
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  DEFAULT_RETENTION_DAYS: z.coerce.number().int().positive().default(30),
});

export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

let cachedServerEnv: ServerEnv | null = null;
let cachedClientEnv: ClientEnv | null = null;

export function getClientEnv(): ClientEnv {
  if (cachedClientEnv) return cachedClientEnv;

  const result = clientSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  });

  if (!result.success) {
    console.error('Invalid client environment configuration:', result.error.format());
    throw new Error('Invalid client environment configuration');
  }

  cachedClientEnv = result.data;
  return cachedClientEnv;
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: Attempted to access server environment variables from the client.');
  }

  if (cachedServerEnv) return cachedServerEnv;

  const result = serverSchema.safeParse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DEFAULT_RETENTION_DAYS: process.env.DEFAULT_RETENTION_DAYS ?? 30,
  });

  if (!result.success) {
    const issues = result.error.issues.map((i) => ` - ${i.path.join('.')}: ${i.message}`).join('\n');
    console.error(`Invalid server environment configuration:\n${issues}`);
    throw new Error(`Server environment configuration failed fast:\n${issues}`);
  }

  cachedServerEnv = result.data;
  return cachedServerEnv;
}
