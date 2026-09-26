// components/jobs/ActivityFeed.tsx

'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import { Card, CardHeader, CardPanel, CardTitle } from '@/components/ui/card';

interface LogEntry {
  id: string;
  jobId: string;
  level: string;
  message: string;
  timestamp: string;
}

export function ActivityFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = () => {
      fetch('/api/jobs/logs')
        .then(res => res.json())
        .then((data) => setLogs(data.slice(0, 10)))
        .catch(console.error);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle render={<h2 />}>Recent Activity</CardTitle>
      </CardHeader>
      <CardPanel>
      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity</p>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map(log => (
            <div key={log.id} className="flex flex-wrap items-start gap-x-2 gap-y-1 text-sm">
              <span className="mt-0.5 shrink-0" aria-label={log.level}>
                {log.level === 'info' ? (
                  <CheckIcon className="size-4 text-success-foreground" />
                ) : log.level === 'error' ? (
                  <XIcon className="size-4 text-destructive-foreground" />
                ) : (
                  <TriangleAlertIcon className="size-4 text-warning-foreground" />
                )}
              </span>
              <span className="min-w-0 flex-1 break-words">{log.message}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
      </CardPanel>
    </Card>
  );
}
