// app/api/jobs/status/route.ts

import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/jobs/queue';

export async function GET() {
  try {
    const queue = getQueue();

    return NextResponse.json({
      isRunning: false, // In real implementation, track worker state
      pending: queue.pending.length,
      processing: queue.processing.length,
      completed: queue.completed.length,
      failed: queue.failed.length,
      stats: queue.stats
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}
