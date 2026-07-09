// components/jobs/StatsCards.tsx

'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    failed: 0,
    skipped: 0
  });

  useEffect(() => {
    fetch('/api/jobs/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="border rounded-lg p-4">
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-sm text-muted-foreground">Total</div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        <div className="text-sm text-muted-foreground">Completed</div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
        <div className="text-sm text-muted-foreground">Failed</div>
      </div>
      <div className="border rounded-lg p-4">
        <div className="text-2xl font-bold text-yellow-600">{stats.skipped}</div>
        <div className="text-sm text-muted-foreground">Skipped</div>
      </div>
    </div>
  );
}
