import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Check isolated schema connection without leaking any internal details or errors
  await checkDatabaseHealth();

  return NextResponse.json(
    { status: 'ok' },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
