// components/jobs/ActivityFeed.tsx

'use client';

import { useEffect, useState } from 'react';

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
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

      {logs.length === 0 ? (
        <p className="text-muted-foreground">No recent activity</p>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="text-sm">
              <span className={`font-${log.level === 'error' ? 'bold text-red-600' : 'semibold'}`}>
                {log.level === 'info' ? '✅' : log.level === 'error' ? '❌' : '⚠️'}
              </span>
              <span className="ml-2">{log.message}</span>
              <span className="ml-2 text-muted-foreground">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
