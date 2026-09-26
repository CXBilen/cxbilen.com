// app/tools/jobs/page.tsx

import { StatsCards } from '@/components/jobs/StatsCards';
import { QueueStatus } from '@/components/jobs/QueueStatus';
import { ActivityFeed } from '@/components/jobs/ActivityFeed';

export default function JobsDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Job Application Dashboard</h1>
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
