// app/api/jobs/config/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/jobs/storage';
import type { JobsConfig } from '@/lib/jobs/types';

export async function GET() {
  try {
    const config = getConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error getting config:', error);
    return NextResponse.json(
      { error: 'Failed to get config' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Partial<JobsConfig>;

    // Validate required fields
    if (body.profile) {
      if (!body.profile.email || !body.profile.fullName) {
        return NextResponse.json(
          { error: 'Email and full name are required' },
          { status: 400 }
        );
      }
    }

    const currentConfig = getConfig();
    const updatedConfig = { ...currentConfig, ...body };

    saveConfig(updatedConfig);

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
