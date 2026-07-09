// app/api/jobs/queue/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getQueue, clearQueue } from '@/lib/jobs/queue';

export async function GET() {
  try {
    const queue = getQueue();
    return NextResponse.json(queue);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get queue' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearQueue();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear queue' }, { status: 500 });
  }
}
