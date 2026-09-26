// components/jobs/StatsCards.tsx

'use client';

import { useEffect, useState } from 'react';
import { Card, CardPanel } from '@/components/ui/card';

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardPanel className="flex flex-col gap-1">
          <div className="text-2xl font-semibold tabular-nums">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </CardPanel>
      </Card>
      <Card>
        <CardPanel className="flex flex-col gap-1">
          <div className="text-2xl font-semibold tabular-nums text-success-foreground">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </CardPanel>
      </Card>
      <Card>
        <CardPanel className="flex flex-col gap-1">
          <div className="text-2xl font-semibold tabular-nums text-destructive-foreground">{stats.failed}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </CardPanel>
      </Card>
      <Card>
        <CardPanel className="flex flex-col gap-1">
          <div className="text-2xl font-semibold tabular-nums text-warning-foreground">{stats.skipped}</div>
          <div className="text-sm text-muted-foreground">Skipped</div>
        </CardPanel>
      </Card>
    </div>
  );
}
