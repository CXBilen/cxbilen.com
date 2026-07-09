// app/tools/jobs/page.tsx

import { StatsCards } from '@/components/jobs/StatsCards';
import { QueueStatus } from '@/components/jobs/QueueStatus';
import { ActivityFeed } from '@/components/jobs/ActivityFeed';

export default function JobsDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Job Application Dashboard</h1>
        <p className="text-muted-foreground">
          Automate job applications to hiddenjobs.dev listings
        </p>
      </div>

      <div className="grid gap-6">
        <StatsCards />
        <QueueStatus />
        <ActivityFeed />
      </div>
    </div>
  );
}
