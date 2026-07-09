// app/api/jobs/scan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { scanHiddenJobs } from '@/lib/jobs/scanner';
import { addToQueue } from '@/lib/jobs/queue';
import { getConfig } from '@/lib/jobs/storage';

export async function POST(request: NextRequest) {
  try {
    const config = getConfig();
    const filters = config.filters;

    // Scan for jobs
    const jobs = await scanHiddenJobs(filters);

    // Add all to queue
    let addedCount = 0;
    for (const job of jobs) {
      addToQueue(job);
      addedCount++;
    }

    return NextResponse.json({
      success: true,
      added: addedCount,
      total: jobs.length
    });
  } catch (error) {
    console.error('Error scanning jobs:', error);
    return NextResponse.json(
      { error: 'Failed to scan jobs' },
      { status: 500 }
    );
  }
}
