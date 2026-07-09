// app/api/jobs/list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { scanHiddenJobs } from '@/lib/jobs/scanner';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const categories = searchParams.get('categories')?.split(',') || undefined;
    const titles = searchParams.get('titles')?.split(',') || undefined;
    const salaryMin = searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined;
    const remoteOnly = searchParams.get('remoteOnly') === 'true';
    const excludeKeywords = searchParams.get('excludeKeywords')?.split(',') || undefined;

    const jobs = await scanHiddenJobs({
      categories,
      titles,
      salaryMin,
      remoteOnly,
      excludeKeywords
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error listing jobs:', error);
    return NextResponse.json(
      { error: 'Failed to list jobs' },
      { status: 500 }
    );
  }
}
