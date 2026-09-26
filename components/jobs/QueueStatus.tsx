// components/jobs/QueueStatus.tsx

'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardPanel, CardTitle } from '@/components/ui/card';

interface QueueStatus {
  isRunning: boolean;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  total?: number;
}

export function QueueStatus() {
  const [status, setStatus] = useState<QueueStatus>({
    isRunning: false,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    total: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/jobs/status')
        .then(res => res.json())
        .then(setStatus)
        .catch(console.error);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const progress = (status.total && status.total > 0) ? (status.completed / status.total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle render={<h2 />}>Queue Status</CardTitle>
      </CardHeader>
      <CardPanel>
      {status.isRunning ? (
        <div className="flex flex-col gap-2">
          <div className="text-sm">Processing job {status.processing + 1}/{status.total || 0}</div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {status.pending === 0 ? 'No jobs queued' : `${status.pending} jobs pending`}
        </p>
      )}
      </CardPanel>
    </Card>
  );
}
