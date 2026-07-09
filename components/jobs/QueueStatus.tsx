// components/jobs/QueueStatus.tsx

'use client';

import { useEffect, useState } from 'react';

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
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Queue Status</h2>

      {status.isRunning ? (
        <div>
          <div className="mb-2">Processing job {status.processing + 1}/{status.total || 0}</div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">
          {status.pending === 0 ? 'No jobs queued' : `${status.pending} jobs pending`}
        </p>
      )}
    </div>
  );
}
