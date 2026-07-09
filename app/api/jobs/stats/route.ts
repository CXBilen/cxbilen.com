// app/api/jobs/stats/route.ts

import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/jobs/queue';

export async function GET() {
  try {
    const queue = getQueue();

    return NextResponse.json(queue.stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
