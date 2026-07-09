// app/tools/jobs/page.tsx

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
        {/* Stats cards placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-muted-foreground">Skipped</div>
          </div>
        </div>

        {/* Queue status placeholder */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Queue Status</h2>
          <p className="text-muted-foreground">No jobs queued</p>
        </div>

        {/* Controls placeholder */}
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Start Queue
          </button>
          <button className="px-4 py-2 border rounded-md">
            Clear Queue
          </button>
          <button className="px-4 py-2 border rounded-md">
            Export Results
          </button>
        </div>
      </div>
    </div>
  );
}
