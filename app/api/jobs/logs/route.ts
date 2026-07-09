// app/api/jobs/logs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getLogger } from '@/lib/jobs/logger';

export async function GET(request: NextRequest) {
  try {
    const logger = getLogger();
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';
    const level = searchParams.get('level') || undefined;

    const logs = logger.getLogs({ level: level as any });

    if (format === 'csv') {
      const csv = await logger.exportLogs('csv');
      return new NextResponse(csv, {
        headers: { 'Content-Type': 'text/csv' }
      });
    }

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get logs' }, { status: 500 });
  }
}
