# Automated Job Application Tool for hiddenjobs.dev - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an automated job application tool integrated into cxbilen.com that scans hiddenjobs.dev for remote tech jobs and automatically submits applications through external ATS systems (Greenhouse, Ashby, SmartRecruiters).

**Architecture:** Centralized Worker Queue pattern with Next.js API routes managing job queue, Playwright headful browser for ATS automation, and localStorage for all data persistence. Dashboard UI provides real-time monitoring and control.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.8, Playwright, Tailwind CSS 4, shadcn/ui, localStorage, Node.js 24 LTS

## Global Constraints

- Next.js 15.5.19 (current), React 19, TypeScript 5.8 (exact versions from package.json)
- No authentication system - localStorage only for data storage
- No database - all state in localStorage or in-memory
- Stealth mode required - headful browser (not headless), no paid CAPTCHA services
- Must handle 200+ applications per day with rate limiting
- All data must be masked in logs (email, phone, sensitive fields)
- Playwright Firefox required for browser automation
- CV storage: If >2MB, use Vercel Blob; if ≤2MB, base64 in localStorage
- Support Greenhouse, Ashby, SmartRecruiters as priority ATS systems
- All API routes must follow Next.js 15 App Router conventions

---

## File Structure

```
cxbilen.com/
├── app/
│   ├── tools/
│   │   └── jobs/
│   │       └── page.tsx                          # Main dashboard page
│   └── api/
│       └── jobs/
│           ├── list/
│           │   └── route.ts                       # Fetch jobs from hiddenjobs.dev
│           ├── scan/
│           │   └── route.ts                       # Trigger scan & queue jobs
│           ├── queue/
│           │   └── route.ts                       # Queue CRUD + controls
│           ├── config/
│           │   └── route.ts                       # Config management
│           ├── upload-cv/
│           │   └── route.ts                       # CV upload
│           ├── status/
│           │   └── route.ts                       # Worker status
│           ├── logs/
│           │   └── route.ts                       # Logs export
│           └── stats/
│               └── route.ts                       # Statistics
├── lib/
│   └── jobs/
│       ├── types.ts                              # TypeScript interfaces
│       ├── storage.ts                            # localStorage helpers
│       ├── logger.ts                              # Logging system
│       ├── scanner.ts                             # hiddenjobs.dev scraper
│       ├── queue.ts                               # Queue management
│       ├── worker.ts                              # Main worker process
│       ├── handlers/
│       │   ├── index.ts                           # ATS handler registry
│       │   ├── base.ts                            # Base ATS handler interface
│       │   ├── greenhouse.ts                      # Greenhouse ATS handler
│       │   ├── ashby.ts                            # Ashby ATS handler
│       │   ├── smartrecruiters.ts                 # SmartRecruiters handler
│       │   └── generic.ts                         # Generic fallback handler
│       ├── rate-limiter.ts                        # Rate limiting
│       ├── proxy-manager.ts                       # Proxy rotation
│       └── error-handler.ts                       # Error classification
└── components/
    └── jobs/
        ├── Dashboard.tsx                          # Main dashboard component
        ├── ConfigModal.tsx                         # Configuration modal
        ├── StatsCards.tsx                         # Stats display
        ├── QueueStatus.tsx                        # Queue progress bar
        ├── ActivityFeed.tsx                       # Recent activity
        └── ErrorDashboard.tsx                     # Error summary UI
```

---

## PHASE 1: Foundation (Week 1)

### Task 1.1: Create TypeScript types and interfaces

**Files:**
- Create: `lib/jobs/types.ts`

**Interfaces:**
- Produces: All type definitions used throughout the application

- [ ] **Step 1: Write the types file**

```typescript
// lib/jobs/types.ts

export type ATSType = 'greenhouse' | 'ashby' | 'smartrecruiters' | 'other';

export type ErrorType =
  | 'captcha'
  | 'rate_limit'
  | 'form_error'
  | 'timeout'
  | 'network'
  | 'validation'
  | 'ats_not_supported'
  | 'unknown';

export interface JobsConfig {
  cv: {
    url: string;
    filename: string;
    uploadedAt: string;
  };
  profile: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  filters: {
    categories: string[];
    titles: string[];
    salaryMin?: number;
    remoteOnly: boolean;
    excludeKeywords: string[];
  };
  proxyConfig?: {
    enabled: boolean;
    rotatingProxies?: string[];
    rotateEveryJobs?: number;
  };
}

export interface QueuedJob {
  id: string;
  hiddenJobsUrl: string;
  atsType: ATSType;
  atsUrl: string;
  company: string;
  title: string;
  salary?: string;
  postedAt: string;
  priority: number;
  addedAt: string;
}

export interface CompletedJob {
  jobId: string;
  status: 'submitted' | 'manual_review' | 'skipped';
  completedAt: string;
  atsApplicationId?: string;
  screenshot?: string;
  notes?: string;
}

export interface FailedJob {
  jobId: string;
  error: string;
  errorType: ErrorType;
  retried: boolean;
  failedAt: string;
}

export interface LogEntry {
  id: string;
  jobId: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface QueueStats {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  startedAt?: string;
}

export interface JobsQueue {
  pending: QueuedJob[];
  processing: QueuedJob[];
  completed: CompletedJob[];
  failed: FailedJob[];
  stats: QueueStats;
}

export interface ApplicationData {
  profile: JobsConfig['profile'];
  cv: JobsConfig['cv'];
  categories: string[];
  generateCoverLetter?: (company: string, title: string) => string;
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add lib/jobs/types.ts
git commit -m "feat(jobs): add TypeScript types and interfaces"
```

---

### Task 1.2: Implement localStorage storage helpers

**Files:**
- Create: `lib/jobs/storage.ts`
- Test: Create: `lib/jobs/storage.test.ts`

**Interfaces:**
- Consumes: Types from `lib/jobs/types.ts`
- Produces: `getConfig()`, `saveConfig()`, `getQueue()`, `saveQueue()`, `getLogs()`, `saveLogs()`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/storage.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { getConfig, saveConfig, getQueue, saveQueue } from './storage';

describe('localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getConfig', () => {
    it('returns default config when none exists', () => {
      const config = getConfig();
      expect(config).toBeDefined();
      expect(config.profile).toEqual({
        fullName: '',
        email: '',
        phone: '',
        location: ''
      });
    });
  });

  describe('saveConfig', () => {
    it('saves config to localStorage', () => {
      const config = {
        cv: { url: 'test.pdf', filename: 'test.pdf', uploadedAt: '2024-01-01' },
        profile: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          location: 'Remote'
        },
        filters: {
          categories: ['Backend'],
          titles: ['Software Engineer'],
          remoteOnly: true,
          excludeKeywords: []
        }
      };

      saveConfig(config);
      const retrieved = getConfig();

      expect(retrieved.profile.fullName).toBe('Test User');
      expect(retrieved.profile.email).toBe('test@example.com');
    });
  });

  describe('getQueue', () => {
    it('returns empty queue when none exists', () => {
      const queue = getQueue();
      expect(queue).toBeDefined();
      expect(queue.pending).toEqual([]);
      expect(queue.completed).toEqual([]);
    });
  });

  describe('saveQueue', () => {
    it('saves queue to localStorage', () => {
      const queue = {
        pending: [],
        processing: [],
        completed: [],
        failed: [],
        stats: { total: 0, completed: 0, failed: 0, skipped: 0 }
      };

      saveQueue(queue);
      const retrieved = getQueue();

      expect(retrieved.stats.total).toBe(0);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/storage.test.ts`
Expected: FAIL with "Cannot find module './storage'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/storage.ts

import type { JobsConfig, JobsQueue, LogEntry } from './types';

const CONFIG_KEY = 'jobs-config';
const QUEUE_KEY = 'jobs-queue';
const LOGS_KEY = 'jobs-logs';

const DEFAULT_CONFIG: JobsConfig = {
  cv: { url: '', filename: '', uploadedAt: '' },
  profile: {
    fullName: '',
    email: '',
    phone: '',
    location: ''
  },
  filters: {
    categories: [],
    titles: [],
    remoteOnly: true,
    excludeKeywords: []
  }
};

const DEFAULT_QUEUE: JobsQueue = {
  pending: [],
  processing: [],
  completed: [],
  failed: [],
  stats: {
    total: 0,
    completed: 0,
    failed: 0,
    skipped: 0
  }
};

export function getConfig(): JobsConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  const stored = localStorage.getItem(CONFIG_KEY);
  if (!stored) return DEFAULT_CONFIG;

  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: JobsConfig): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function getQueue(): JobsQueue {
  if (typeof window === 'undefined') return DEFAULT_QUEUE;

  const stored = localStorage.getItem(QUEUE_KEY);
  if (!stored) return DEFAULT_QUEUE;

  try {
    return { ...DEFAULT_QUEUE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_QUEUE;
  }
}

export function saveQueue(queue: JobsQueue): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getLogs(): LogEntry[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(LOGS_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return parsed.entries || [];
  } catch {
    return [];
  }
}

export function saveLogs(entries: LogEntry[]): void {
  if (typeof window === 'undefined') return;

  // Keep only last 1000 logs
  const trimmed = entries.slice(-1000);

  localStorage.setItem(LOGS_KEY, JSON.stringify({ entries: trimmed }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/storage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/jobs/storage.ts lib/jobs/storage.test.ts
git commit -m "feat(jobs): add localStorage storage helpers with tests"
```

---

### Task 1.3: Implement logging system

**Files:**
- Create: `lib/jobs/logger.ts`
- Test: Create: `lib/jobs/logger.test.ts`

**Interfaces:**
- Consumes: Types from `lib/jobs/types.ts`, `saveLogs()` from `lib/jobs/storage.ts`
- Produces: `JobLogger` class, `logInfo()`, `logWarn()`, `logError()`, `exportLogs()`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/logger.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { JobLogger } from './logger';
import type { LogEntry } from './types';

describe('JobLogger', () => {
  let logger: JobLogger;

  beforeEach(() => {
    localStorage.clear();
    logger = new JobLogger();
  });

  it('creates log entry with info level', () => {
    logger.info('job-1', 'Test message', { company: 'TestCorp' });

    const logs = logger.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('Test message');
    expect(logs[0].jobId).toBe('job-1');
  });

  it('masks sensitive data in logs', () => {
    logger.info('job-1', 'Processing application', {
      profile: {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890'
      }
    });

    const logs = logger.getLogs();
    expect(logs[0].metadata?.profile).toBeDefined();
    // Email should be masked
    expect(logs[0].metadata?.profile).not.toContain('test@example.com');
  });

  it('keeps only last 1000 logs', () => {
    for (let i = 0; i < 1100; i++) {
      logger.info(`job-${i}`, `Message ${i}`);
    }

    const logs = logger.getLogs();
    expect(logs.length).toBeLessThanOrEqual(1000);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/logger.test.ts`
Expected: FAIL with "Cannot find module './logger'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/logger.ts

import type { LogEntry } from './types';
import { saveLogs } from './storage';

export class JobLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private addLog(
    level: LogEntry['level'],
    jobId: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    const sanitizedMetadata = metadata ? this.sanitizeMetadata(metadata) : undefined;

    const log: LogEntry = {
      id: this.generateId(),
      jobId,
      level,
      timestamp: new Date().toISOString(),
      message,
      metadata: sanitizedMetadata
    };

    this.logs.push(log);

    // Keep only last maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Persist every 10 logs to avoid excessive localStorage writes
    if (this.logs.length % 10 === 0) {
      this.persist();
    }
  }

  info(jobId: string, message: string, metadata?: Record<string, unknown>): void {
    this.addLog('info', jobId, message, metadata);
  }

  warn(jobId: string, message: string, metadata?: Record<string, unknown>): void {
    this.addLog('warn', jobId, message, metadata);
  }

  error(jobId: string, message: string, metadata?: Record<string, unknown>): void {
    this.addLog('error', jobId, message, metadata);
  }

  getLogs(filters?: { level?: LogEntry['level']; jobId?: string }): LogEntry[] {
    let filtered = this.logs;

    if (filters?.level) {
      filtered = filtered.filter(log => log.level === filters.level);
    }

    if (filters?.jobId) {
      filtered = filtered.filter(log => log.jobId === filters.jobId);
    }

    return [...filtered].reverse(); // Most recent first
  }

  async exportLogs(format: 'json' | 'csv'): Promise<string> {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }

    // CSV format
    const headers = ['id', 'jobId', 'level', 'timestamp', 'message', 'context'];
    const rows = this.logs.map(log => [
      log.id,
      log.jobId,
      log.level,
      log.timestamp,
      `"${log.message}"`,
      `"${JSON.stringify(log.metadata || {})}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\\n');
  }

  persist(): void {
    saveLogs(this.logs);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...metadata };

    // Mask email addresses
    if (sanitized.profile) {
      const profile = sanitized.profile as Record<string, string>;
      if (profile.email) {
        const [name, domain] = profile.email.split('@');
        profile.email = `${name[0]}***@${domain}`;
      }
      if (profile.phone) {
        profile.phone = profile.phone.replace(/\\d(?=.{4})/g, '*');
      }
    }

    return sanitized;
  }
}

// Singleton instance
let loggerInstance: JobLogger | null = null;

export function getLogger(): JobLogger {
  if (!loggerInstance) {
    loggerInstance = new JobLogger();
  }
  return loggerInstance;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/logger.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/jobs/logger.ts lib/jobs/logger.test.ts
git commit -m "feat(jobs): add logging system with sanitization"
```

---

### Task 1.4: Create dashboard page structure

**Files:**
- Create: `app/tools/jobs/page.tsx`

**Interfaces:**
- Consumes: React 19, Next.js 15 App Router
- Produces: Dashboard page at `/tools/jobs`

- [ ] **Step 1: Write the page component**

```typescript
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
```

- [ ] **Step 2: Verify page renders**

Run: `npm run dev`
Visit: `http://localhost:3000/tools/jobs`
Expected: Page renders with placeholder UI

- [ ] **Step 3: Commit**

```bash
git add app/tools/jobs/page.tsx
git commit -m "feat(jobs): add dashboard page structure"
```

---

### Task 1.5: Create API route skeleton

**Files:**
- Create: `app/api/jobs/config/route.ts`

**Interfaces:**
- Consumes: `getConfig()`, `saveConfig()` from `lib/jobs/storage.ts`
- Produces: GET/PUT endpoints at `/api/jobs/config`

- [ ] **Step 1: Write the API route**

```typescript
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
```

- [ ] **Step 2: Test API endpoint**

Run: `npm run dev`
Test GET: `curl http://localhost:3000/api/jobs/config`
Expected: JSON response with default config

Test PUT: `curl -X PUT http://localhost:3000/api/jobs/config -H "Content-Type: application/json" -d '{"profile":{"fullName":"Test User","email":"test@example.com","phone":"","location":"Remote"}}'`
Expected: JSON response with updated config

- [ ] **Step 3: Commit**

```bash
git add app/api/jobs/config/route.ts
git commit -m "feat(jobs): add config API route"
```

---

## PHASE 1 COMPLETION CRITERIA

✅ All TypeScript types defined and compiles without errors
✅ localStorage helpers tested and working
✅ Logging system with sanitization implemented
✅ Dashboard page accessible at `/tools/jobs`
✅ Config API route functional
✅ All tests passing: `npm test`

---

## PHASE 2: hiddenjobs.dev Integration (Week 2)

### Task 2.1: Implement hiddenjobs.dev scraper

**Files:**
- Create: `lib/jobs/scanner.ts`
- Test: Create: `lib/jobs/scanner.test.ts`

**Interfaces:**
- Consumes: Types from `lib/jobs/types.ts`
- Produces: `scanHiddenJobs()`, `parseJobListing()`, `extractATSUrl()`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/scanner.test.ts

import { describe, it, expect } from 'vitest';
import { scanHiddenJobs, extractATSUrl } from './scanner';

describe('hiddenjobs.dev scanner', () => {
  describe('extractATSUrl', () => {
    it('extracts Greenhouse URL', () => {
      const html = `
        <a href="https://job-boards.greenhouse.io/testcompany/jobs/12345">Apply</a>
      `;
      const url = extractATSUrl(html);
      expect(url).toBe('https://job-boards.greenhouse.io/testcompany/jobs/12345');
    });

    it('extracts Ashby URL', () => {
      const html = `
        <a href="https://jobs.ashbyhq.com/testcompany/12345">Apply</a>
      `;
      const url = extractATSUrl(html);
      expect(url).toBe('https://jobs.ashbyhq.com/testcompany/12345');
    });

    it('returns null if no ATS URL found', () => {
      const html = '<a href="https://example.com">Apply</a>';
      const url = extractATSUrl(html);
      expect(url).toBeNull();
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/scanner.test.ts`
Expected: FAIL with "Cannot find module './scanner'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/scanner.ts

import type { QueuedJob, ATSType } from './types';

export function extractATSUrl(html: string): string | null {
  // Try to extract ATS URLs from common patterns
  const patterns = [
    /https?:\\/\\/job-boards\\.greenhouse\\.io\\/[^\\/]+\\/jobs\\/[\\d]+/i,
    /https?:\\/\\/jobs\\.ashbyhq\\.com\\/[^\\/]+\\/[\\d]+/i,
    /https?:\\/\\/www\\.smartrecruiters\\.com\\/[^\\/]+\\/job\\/[\\d]+/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

export function detectATSType(url: string): ATSType {
  if (url.includes('greenhouse.io')) return 'greenhouse';
  if (url.includes('ashbyhq.com')) return 'ashby';
  if (url.includes('smartrecruiters.com')) return 'smartrecruiters';
  return 'other';
}

export async function scanHiddenJobs(filters: {
  categories?: string[];
  titles?: string[];
  salaryMin?: number;
  remoteOnly?: boolean;
  excludeKeywords?: string[];
}): Promise<QueuedJob[]> {
  // In a real implementation, this would scrape hiddenjobs.dev
  // For now, return mock data to test the flow
  const mockJobs: QueuedJob[] = [
    {
      id: 'job-1',
      hiddenJobsUrl: 'https://hiddenjobs.dev/jobs/1',
      atsType: 'greenhouse',
      atsUrl: 'https://job-boards.greenhouse.io/testcompany/jobs/12345',
      company: 'TestCorp',
      title: 'Senior Software Engineer',
      salary: '$150,000',
      postedAt: new Date().toISOString(),
      priority: 5,
      addedAt: new Date().toISOString()
    }
  ];

  // Filter jobs based on criteria
  return mockJobs.filter(job => {
    // Check excluded keywords
    if (filters.excludeKeywords) {
      const titleLower = job.title.toLowerCase();
      for (const keyword of filters.excludeKeywords) {
        if (titleLower.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }

    // Check salary minimum
    if (filters.salaryMin && job.salary) {
      const salaryNum = parseInt(job.salary.replace(/[^\\d]/g, ''));
      if (salaryNum < filters.salaryMin) {
        return false;
      }
    }

    return true;
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/scanner.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/jobs/scanner.ts lib/jobs/scanner.test.ts
git commit -m "feat(jobs): add hiddenjobs.dev scanner with ATS URL extraction"
```

---

### Task 2.2: Implement queue management

**Files:**
- Create: `lib/jobs/queue.ts`
- Test: Create: `lib/jobs/queue.test.ts`

**Interfaces:**
- Consumes: Types from `lib/jobs/types.ts`, `getQueue()`, `saveQueue()` from `lib/jobs/storage.ts`
- Produces: `addToQueue()`, `getNextJob()`, `completeJob()`, `failJob()`, `clearQueue()`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/queue.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { addToQueue, getNextJob, completeJob, clearQueue } from './queue';
import type { QueuedJob } from './types';

describe('Queue management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds job to pending queue', () => {
    const job: QueuedJob = {
      id: 'job-1',
      hiddenJobsUrl: 'https://hiddenjobs.dev/jobs/1',
      atsType: 'greenhouse',
      atsUrl: 'https://job-boards.greenhouse.io/test/jobs/1',
      company: 'TestCorp',
      title: 'Software Engineer',
      postedAt: new Date().toISOString(),
      priority: 5,
      addedAt: new Date().toISOString()
    };

    addToQueue(job);

    const queue = getQueue();
    expect(queue.pending).toHaveLength(1);
    expect(queue.pending[0].id).toBe('job-1');
  });

  it('gets next job from pending queue', () => {
    const job: QueuedJob = {
      id: 'job-1',
      hiddenJobsUrl: 'https://hiddenjobs.dev/jobs/1',
      atsType: 'greenhouse',
      atsUrl: 'https://job-boards.greenhouse.io/test/jobs/1',
      company: 'TestCorp',
      title: 'Software Engineer',
      postedAt: new Date().toISOString(),
      priority: 5,
      addedAt: new Date().toISOString()
    };

    addToQueue(job);
    const nextJob = getNextJob();

    expect(nextJob).toBeDefined();
    expect(nextJob?.id).toBe('job-1');
  });

  it('clears queue', () => {
    clearQueue();
    const queue = getQueue();
    expect(queue.pending).toHaveLength(0);
    expect(queue.completed).toHaveLength(0);
    expect(queue.failed).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/queue.test.ts`
Expected: FAIL with "Cannot find module './queue'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/queue.ts

import type { QueuedJob, CompletedJob, FailedJob } from './types';
import { getQueue, saveQueue } from './storage';

export function addToQueue(job: QueuedJob): void {
  const queue = getQueue();
  queue.pending.push(job);
  queue.stats.total++;
  saveQueue(queue);
}

export function getNextJob(): QueuedJob | null {
  const queue = getQueue();

  if (queue.pending.length === 0) {
    return null;
  }

  const job = queue.pending.shift();
  if (job) {
    queue.processing.push(job);
    saveQueue(queue);
    return job;
  }

  return null;
}

export function completeJob(
  jobId: string,
  result: CompletedJob
): void {
  const queue = getQueue();

  // Remove from processing
  queue.processing = queue.processing.filter(j => j.id !== jobId);

  // Add to completed
  queue.completed.push(result);
  queue.stats.completed++;
  saveQueue(queue);
}

export function failJob(jobId: string, error: FailedJob): void {
  const queue = getQueue();

  // Remove from processing
  queue.processing = queue.processing.filter(j => j.id !== jobId);

  // Add to failed
  queue.failed.push(error);
  queue.stats.failed++;
  saveQueue(queue);
}

export function clearQueue(): void {
  const emptyQueue = {
    pending: [],
    processing: [],
    completed: [],
    failed: [],
    stats: {
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0
    }
  };

  saveQueue(emptyQueue);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/queue.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/jobs/queue.ts lib/jobs/queue.test.ts
git commit -m "feat(jobs): add queue management system"
```

---

### Task 2.3: Create job list and scan API routes

**Files:**
- Create: `app/api/jobs/list/route.ts`
- Create: `app/api/jobs/scan/route.ts`

**Interfaces:**
- Consumes: `scanHiddenJobs()` from `lib/jobs/scanner.ts`, `addToQueue()` from `lib/jobs/queue.ts`
- Produces: GET/POST endpoints at `/api/jobs/list` and `/api/jobs/scan`

- [ ] **Step 1: Write the list endpoint**

```typescript
// app/api/jobs/list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { scanHiddenJobs } from '@/lib/jobs/scanner';
import type { JobsConfig } from '@/lib/jobs/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const categories = searchParams.get('categories')?.split(',') || undefined;
    const titles = searchParams.get('titles')?.split(',') || undefined;
    const salaryMin = searchParams.get('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined;
    const remoteOnly = searchParams.get('remoteOnly') === 'true';
    const excludeKeywords = searchParams.get('excludeKeywords')?.split(',') || undefined;

    const jobs = await scanHiddenJobs({
      categories,
      titles,
      salaryMin,
      remoteOnly,
      excludeKeywords
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error listing jobs:', error);
    return NextResponse.json(
      { error: 'Failed to list jobs' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Write the scan endpoint**

```typescript
// app/api/jobs/scan/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { scanHiddenJobs } from '@/lib/jobs/scanner';
import { addToQueue } from '@/lib/jobs/queue';
import { getConfig } from '@/lib/jobs/storage';

export async function POST(request: NextRequest) {
  try {
    const config = getConfig();
    const filters = config.filters;

    // Scan for jobs
    const jobs = await scanHiddenJobs(filters);

    // Add all to queue
    let addedCount = 0;
    for (const job of jobs) {
      addToQueue(job);
      addedCount++;
    }

    return NextResponse.json({
      success: true,
      added: addedCount,
      total: jobs.length
    });
  } catch (error) {
    console.error('Error scanning jobs:', error);
    return NextResponse.json(
      { error: 'Failed to scan jobs' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Test API endpoints**

Run: `npm run dev`

Test scan: `curl -X POST http://localhost:3000/api/jobs/scan`
Expected: JSON response with added and total counts

Test list: `curl http://localhost:3000/api/jobs/list`
Expected: JSON array of jobs

- [ ] **Step 4: Commit**

```bash
git add app/api/jobs/list/route.ts app/api/jobs/scan/route.ts
git commit -m "feat(jobs): add job list and scan API routes"
```

---

## PHASE 2 COMPLETION CRITERIA

✅ Can scan hiddenjobs.dev (mock or real)
✅ Can extract ATS URLs from job listings
✅ Queue management functional
✅ Jobs can be added to queue via API
✅ All tests passing: `npm test`

---

**Plan continues in next sections...**
## PHASE 3: ATS Handlers (Week 3-4)

### Task 3.1: Install Playwright and setup

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: npm install
- Produces: Playwright dependencies installed

- [ ] **Step 1: Install Playwright**

Run: `npm install -D playwright`
Expected: Package added to devDependencies

- [ ] **Step 2: Install Playwright browsers**

Run: `npx playwright install firefox`
Expected: Firefox browser installed

- [ ] **Step 3: Update package.json scripts**

Add to `scripts` section:
```json
"scripts": {
  "test:e2e": "playwright test"
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(jobs): install Playwright with Firefox"
```

---

### Task 3.2: Create base ATS handler interface

**Files:**
- Create: `lib/jobs/handlers/base.ts`
- Create: `lib/jobs/handlers/index.ts`

**Interfaces:**
- Consumes: Types from `lib/jobs/types.ts`
- Produces: `ATSHandler` interface, `getHandler()`, `registerHandler()`

- [ ] **Step 1: Write the base handler interface**

```typescript
// lib/jobs/handlers/base.ts

import type { Page } from 'playwright';
import type { ATSType, ApplicationData } from '../../types';

export interface ATSHandler {
  atsType: ATSType;
  detect(url: string): boolean;
  fillForm(page: Page, data: ApplicationData): Promise<void>;
  submit(page: Page): Promise<{ success: boolean; applicationId?: string }>;
}

export function generateCoverLetter(data: ApplicationData, company: string, title: string): string {
  return `Dear Hiring Manager,

I am writing to express my interest in the ${title} position at ${company}. With my experience in ${data.categories.join(', ')}, I believe I would be a great fit for your team.

${data.profile.github ? `You can view my work at ${data.profile.github}.` : ''}
${data.profile.portfolio ? `Check out my portfolio at ${data.profile.portfolio}.` : ''}

I look forward to discussing how I can contribute to your team.

Best regards,
${data.profile.fullName}`;
}
```

- [ ] **Step 2: Write the handler registry**

```typescript
// lib/jobs/handlers/index.ts

import type { ATSHandler } from './base';
import type { ATSType } from '../../types';

const handlers = new Map<ATSType, ATSHandler>();

export function registerHandler(handler: ATSHandler): void {
  handlers.set(handler.atsType, handler);
}

export function getHandler(atsType: ATSType): ATSHandler | null {
  const handler = handlers.get(atsType);
  if (handler) {
    return handler;
  }

  // Return generic handler as fallback
  return handlers.get('other') || null;
}

export function detectATS(url: string): ATSType {
  for (const [atsType, handler] of handlers.entries()) {
    if (handler.detect(url)) {
      return atsType;
    }
  }
  return 'other';
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/jobs/handlers/base.ts lib/jobs/handlers/index.ts
git commit -m "feat(jobs): add ATS handler interface and registry"
```

---

### Task 3.3: Implement Greenhouse handler

**Files:**
- Create: `lib/jobs/handlers/greenhouse.ts`
- Test: Create: `lib/jobs/handlers/greenhouse.test.ts`

**Interfaces:**
- Consumes: `ATSHandler` from `lib/jobs/handlers/base.ts`
- Produces: `GreenhouseHandler` class

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/handlers/greenhouse.test.ts

import { describe, it, expect } from 'vitest';
import { GreenhouseHandler } from './greenhouse';

describe('GreenhouseHandler', () => {
  const handler = new GreenhouseHandler();

  describe('detect', () => {
    it('detects Greenhouse URLs', () => {
      expect(handler.detect('https://job-boards.greenhouse.io/company/jobs/123')).toBe(true);
      expect(handler.detect('https://jobs.ashbyhq.com/company/jobs/123')).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/handlers/greenhouse.test.ts`
Expected: FAIL with "Cannot find module './greenhouse'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/handlers/greenhouse.ts

import type { Page } from 'playwright';
import type { ATSHandler, ApplicationData } from './base';
import { generateCoverLetter } from './base';

export class GreenhouseHandler implements ATSHandler {
  atsType = 'greenhouse' as const;

  detect(url: string): boolean {
    return url.includes('greenhouse.io');
  }

  async fillForm(page: Page, data: ApplicationData): Promise<void> {
    // Wait for form to load
    await page.waitForSelector('.application-form, form', { timeout: 10000 });

    // Fill standard fields
    const firstName = data.profile.fullName.split(' ')[0];
    const lastName = data.profile.fullName.split(' ').slice(1).join(' ');

    await page.fill('#first_name, input[name="first_name"]', firstName);
    await page.fill('#last_name, input[name="last_name"]', lastName);
    await page.fill('#email, input[name="email"]', data.profile.email);
    await page.fill('#phone, input[name="phone"]', data.profile.phone);

    // Handle resume upload
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(data.cv.url);
    }

    // Handle LinkedIn/GitHub fields
    const linkedinField = page.locator('input[id*="linkedin"], input[name*="linkedin"]').first();
    if (await linkedinField.isVisible() && data.profile.linkedin) {
      await linkedinField.fill(data.profile.linkedin);
    }

    const githubField = page.locator('input[id*="github"], input[name*="github"]').first();
    if (await githubField.isVisible() && data.profile.github) {
      await githubField.fill(data.profile.github);
    }

    // Handle cover letter textarea
    const coverLetterField = page.locator('textarea[id*="cover"], textarea[name*="cover"]').first();
    if (await coverLetterField.isVisible()) {
      const company = await page.evaluate(() => document.querySelector('h1')?.textContent || 'the company');
      const title = await page.evaluate(() => document.querySelector('h1, .job-title')?.textContent || 'this position');
      await coverLetterField.fill(generateCoverLetter(data, company, title));
    }
  }

  async submit(page: Page): Promise<{ success: boolean; applicationId?: string }> {
    // Check for CAPTCHA before submit
    const hasCaptcha = await page.locator('iframe[title*="recaptcha"], .g-recaptcha').count() > 0;
    if (hasCaptcha) {
      throw { type: 'captcha', message: 'CAPTCHA detected - cannot proceed' };
    }

    // Submit application
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitButton.click();

    // Wait for success or confirmation
    try {
      await page.waitForURL(/.*\/thank_you.*/i, { timeout: 5000 });
      const applicationId = page.url().split('/').pop();
      return { success: true, applicationId };
    } catch {
      // If no URL change, check for success message
      const successMessage = page.locator('text=Thank you, text=Application received').first();
      if (await successMessage.count() > 0) {
        return { success: true };
      }
      throw { type: 'form_error', message: 'Could not confirm submission' };
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/handlers/greenhouse.test.ts`
Expected: PASS

- [ ] **Step 5: Register handler in index.ts**

Add to `lib/jobs/handlers/index.ts`:
```typescript
import { GreenhouseHandler } from './greenhouse';

// Register handlers
registerHandler(new GreenhouseHandler());
```

- [ ] **Step 6: Commit**

```bash
git add lib/jobs/handlers/greenhouse.ts lib/jobs/handlers/greenhouse.test.ts lib/jobs/handlers/index.ts
git commit -m "feat(jobs): add Greenhouse ATS handler"
```

---

### Task 3.4: Implement Ashby handler

**Files:**
- Create: `lib/jobs/handlers/ashby.ts`
- Test: Create: `lib/jobs/handlers/ashby.test.ts`

**Interfaces:**
- Consumes: `ATSHandler` from `lib/jobs/handlers/base.ts`
- Produces: `AshbyHandler` class

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/handlers/ashby.test.ts

import { describe, it, expect } from 'vitest';
import { AshbyHandler } from './ashby';

describe('AshbyHandler', () => {
  const handler = new AshbyHandler();

  it('detects Ashby URLs', () => {
    expect(handler.detect('https://jobs.ashbyhq.com/company/jobs/123')).toBe(true);
    expect(handler.detect('https://job-boards.greenhouse.io/company/jobs/123')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/handlers/ashby.test.ts`
Expected: FAIL with "Cannot find module './ashby'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/handlers/ashby.ts

import type { Page } from 'playwright';
import type { ATSHandler, ApplicationData } from './base';
import { generateCoverLetter } from './base';

export class AshbyHandler implements ATSHandler {
  atsType = 'ashby' as const;

  detect(url: string): boolean {
    return url.includes('ashbyhq.com');
  }

  async fillForm(page: Page, data: ApplicationData): Promise<void> {
    await page.waitForSelector('form', { timeout: 10000 });

    // Ashby uses different field names
    await page.fill('[name="firstName"]', data.profile.fullName.split(' ')[0]);
    await page.fill('[name="lastName"]', data.profile.fullName.split(' ').slice(1).join(' '));
    await page.fill('[name="email"]', data.profile.email);
    await page.fill('[name="phone"]', data.profile.phone);

    // Resume upload
    const fileInput = page.locator('input[accept*="pdf"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(data.cv.url);
    }

    // LinkedIn
    const linkedinField = page.locator('input[id*="linkedin"]').first();
    if (await linkedinField.isVisible() && data.profile.linkedin) {
      await linkedinField.fill(data.profile.linkedin);
    }

    // Portfolio/GitHub
    const portfolioField = page.locator('input[id*="portfolio"], input[id*="url"]').first();
    if (await portfolioField.isVisible() && data.profile.portfolio) {
      await portfolioField.fill(data.profile.portfolio);
    }
  }

  async submit(page: Page): Promise<{ success: boolean; applicationId?: string }> {
    const hasCaptcha = await page.locator('.g-recaptcha').count() > 0;
    if (hasCaptcha) {
      throw { type: 'captcha', message: 'CAPTCHA detected' };
    }

    await page.click('button[type="submit"]');

    try {
      await page.waitForSelector('[data-ashby-element="application-success"], .success-message', { timeout: 5000 });
      return { success: true };
    } catch {
      throw { type: 'form_error', message: 'Could not confirm submission' };
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/handlers/ashby.test.ts`
Expected: PASS

- [ ] **Step 5: Register handler**

Add to `lib/jobs/handlers/index.ts`:
```typescript
import { AshbyHandler } from './ashby';

registerHandler(new AshbyHandler());
```

- [ ] **Step 6: Commit**

```bash
git add lib/jobs/handlers/ashby.ts lib/jobs/handlers/ashby.test.ts lib/jobs/handlers/index.ts
git commit -m "feat(jobs): add Ashby ATS handler"
```

---

### Task 3.5: Implement SmartRecruiters and Generic handlers

**Files:**
- Create: `lib/jobs/handlers/smartrecruiters.ts`
- Create: `lib/jobs/handlers/generic.ts`

**Interfaces:**
- Consumes: `ATSHandler` from `lib/jobs/handlers/base.ts`
- Produces: `SmartRecruitersHandler` and `GenericHandler` classes

- [ ] **Step 1: Write SmartRecruiters handler**

```typescript
// lib/jobs/handlers/smartrecruiters.ts

import type { Page } from 'playwright';
import type { ATSHandler, ApplicationData } from './base';

export class SmartRecruitersHandler implements ATSHandler {
  atsType = 'smartrecruiters' as const;

  detect(url: string): boolean {
    return url.includes('smartrecruiters.com');
  }

  async fillForm(page: Page, data: ApplicationData): Promise<void> {
    await page.waitForSelector('form', { timeout: 10000 });

    await page.fill('input[name*="firstName"], input[id*="firstName"]', data.profile.fullName.split(' ')[0]);
    await page.fill('input[name*="lastName"], input[id*="lastName"]', data.profile.fullName.split(' ').slice(1).join(' '));
    await page.fill('input[type="email"]', data.profile.email);
    await page.fill('input[type="tel"], input[name*="phone"]', data.profile.phone);

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(data.cv.url);
    }
  }

  async submit(page: Page): Promise<{ success: boolean; applicationId?: string }> {
    const hasCaptcha = await page.locator('iframe[title*="recaptcha"]').count() > 0;
    if (hasCaptcha) {
      throw { type: 'captcha', message: 'CAPTCHA detected' };
    }

    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    return { success: true };
  }
}
```

- [ ] **Step 2: Write Generic handler**

```typescript
// lib/jobs/handlers/generic.ts

import type { Page } from 'playwright';
import type { ATSHandler, ApplicationData } from './base';

export class GenericHandler implements ATSHandler {
  atsType = 'other' as const;

  detect(): boolean {
    return true; // Catch-all
  }

  async fillForm(page: Page, data: ApplicationData): Promise<void> {
    await page.waitForTimeout(1000);

    // Try common patterns
    const emailInputs = page.locator('input[type="email"]');
    if (await emailInputs.count() > 0) {
      await emailInputs.first().fill(data.profile.email);
    }

    const nameInputs = page.locator('input[name*="name"], input[id*="name"]');
    if (await nameInputs.count() > 0) {
      await nameInputs.first().fill(data.profile.fullName);
    }

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(data.cv.url);
    }
  }

  async submit(page: Page): Promise<{ success: boolean; applicationId?: string }> {
    const submitButtons = page.locator('button[type="submit"], button:has-text("Apply"), button:has-text("Submit")');
    if (await submitButtons.count() > 0) {
      await submitButtons.first().click();
      await page.waitForTimeout(3000);
      return { success: true };
    }
    return { success: false };
  }
}
```

- [ ] **Step 3: Register both handlers**

Add to `lib/jobs/handlers/index.ts`:
```typescript
import { SmartRecruitersHandler } from './smartrecruiters';
import { GenericHandler } from './generic';

registerHandler(new SmartRecruitersHandler());
registerHandler(new GenericHandler());
```

- [ ] **Step 4: Commit**

```bash
git add lib/jobs/handlers/smartrecruiters.ts lib/jobs/handlers/generic.ts lib/jobs/handlers/index.ts
git commit -m "feat(jobs): add SmartRecruiters and Generic ATS handlers"
```

---

## PHASE 3 COMPLETION CRITERIA

✅ Playwright installed with Firefox browser
✅ Base ATS handler interface defined
✅ Greenhouse handler implemented and tested
✅ Ashby handler implemented and tested
✅ SmartRecruiters handler implemented
✅ Generic fallback handler implemented
✅ All handlers registered in registry
✅ All tests passing: `npm test`

---

## PHASE 4: Rate Limiting & Proxy (Week 5)

### Task 4.1: Implement rate limiter

**Files:**
- Create: `lib/jobs/rate-limiter.ts`
- Test: Create: `lib/jobs/rate-limiter.test.ts`

**Interfaces:**
- Consumes: No dependencies
- Produces: `RateLimiter` class, `wait()` method

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/rate-limiter.test.ts

import { describe, it, expect, vi } from 'vitest';
import { RateLimiter } from './rate-limiter';

describe('RateLimiter', () => {
  it('calculates correct interval for 200 jobs per day', () => {
    const limiter = new RateLimiter(200);
    expect(limiter.getMinInterval()).toBeGreaterThan(400);
    expect(limiter.getMinInterval()).toBeLessThan(500);
  });

  it('waits with randomization', async () => {
    const limiter = new RateLimiter(200);
    const start = Date.now();
    await limiter.wait();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/rate-limiter.test.ts`
Expected: FAIL with "Cannot find module './rate-limiter'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/rate-limiter.ts

export class RateLimiter {
  private minInterval: number;
  private lastRequest: number = 0;

  constructor(jobsPerDay: number) {
    // Spread requests across 24 hours
    this.minInterval = (24 * 60 * 60 * 1000) / jobsPerDay;
  }

  getMinInterval(): number {
    return this.minInterval;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;

    // Add ±30% randomization
    const randomOffset = Math.random() * (this.minInterval * 0.3);
    const waitTime = this.minInterval + randomOffset - elapsed;

    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequest = Date.now();
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/rate-limiter.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/jobs/rate-limiter.ts lib/jobs/rate-limiter.test.ts
git commit -m "feat(jobs): add rate limiter with randomization"
```

---

### Task 4.2: Implement proxy manager

**Files:**
- Create: `lib/jobs/proxy-manager.ts`
- Test: Create: `lib/jobs/proxy-manager.test.ts`

**Interfaces:**
- Consumes: Types from `lib/jobs/types.ts`
- Produces: `ProxyManager` class

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/proxy-manager.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { ProxyManager } from './proxy-manager';

describe('ProxyManager', () => {
  it('tracks jobs since rotation', () => {
    const manager = new ProxyManager(['http://proxy1:8080'], 10);
    
    expect(manager.shouldRotate()).toBe(false);
    
    for (let i = 0; i < 9; i++) {
      manager.trackJob();
    }
    expect(manager.shouldRotate()).toBe(false);
    
    manager.trackJob();
    expect(manager.shouldRotate()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/proxy-manager.test.ts`
Expected: FAIL with "Cannot find module './proxy-manager'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/proxy-manager.ts

export class ProxyManager {
  private proxies: string[];
  private currentIndex: number = 0;
  private jobsSinceRotation: number = 0;

  constructor(proxies: string[], private rotateEveryJobs: number) {
    this.proxies = proxies;
  }

  trackJob(): void {
    this.jobsSinceRotation++;
  }

  shouldRotate(): boolean {
    return this.jobsSinceRotation >= this.rotateEveryJobs;
  }

  getCurrentProxy(): string {
    return this.proxies[this.currentIndex];
  }

  rotate(): void {
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    this.jobsSinceRotation = 0;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/proxy-manager.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/jobs/proxy-manager.ts lib/jobs/proxy-manager.test.ts
git commit -m "feat(jobs): add proxy manager for rotation"
```

---

### Task 4.3: Implement main worker process

**Files:**
- Create: `lib/jobs/worker.ts`
- Test: Create: `lib/jobs/worker.test.ts`

**Interfaces:**
- Consumes: All handler, rate limiter, proxy manager, queue, logger
- Produces: `JobApplicationWorker` class

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/worker.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { JobApplicationWorker } from './worker';

describe('JobApplicationWorker', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with queue', () => {
    const worker = new JobApplicationWorker();
    expect(worker).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/worker.test.ts`
Expected: FAIL with "Cannot find module './worker'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/worker.ts

import { firefox as playwrightFirefox, type Browser, type Page } from 'playwright';
import type { QueuedJob, CompletedJob, FailedJob, ApplicationData } from './types';
import { getNextJob, completeJob, failJob, getQueue, saveQueue } from './queue';
import { getConfig } from './storage';
import { getLogger } from './logger';
import { getHandler } from './handlers';
import { RateLimiter } from './rate-limiter';
import { ProxyManager } from './proxy-manager';

export class JobApplicationWorker {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private rateLimiter: RateLimiter;
  private proxyManager: ProxyManager | null = null;
  private logger = getLogger();
  private isRunning: boolean = false;

  constructor() {
    // Default to 200 jobs per day
    this.rateLimiter = new RateLimiter(200);

    const config = getConfig();
    if (config.proxyConfig?.enabled && config.proxyConfig.rotatingProxies) {
      this.proxyManager = new ProxyManager(
        config.proxyConfig.rotatingProxies,
        config.proxyConfig.rotateEveryJobs || 50
      );
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('worker', 'Worker already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('worker', 'Starting job application worker');

    // Launch headful browser for stealth
    this.browser = await playwrightFirefox.launch({
      headless: false,
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await context.newPage();

    // Anti-detection script
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      (window as any).chrome = { runtime: {} };
    });

    // Process queue
    await this.processQueue();

    // Cleanup
    await this.browser.close();
    this.isRunning = false;
    this.logger.info('worker', 'Worker finished');
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  private async processQueue(): Promise<void> {
    while (this.isRunning) {
      const job = getNextJob();
      if (!job) {
        this.logger.info('worker', 'No more jobs in queue');
        break;
      }

      try {
        await this.rateLimiter.wait();

        // Track job for proxy rotation
        if (this.proxyManager) {
          this.proxyManager.trackJob();
          if (this.proxyManager.shouldRotate()) {
            this.proxyManager.rotate();
            this.logger.info('worker', 'Rotating proxy');
          }
        }

        await this.processJob(job);
      } catch (error) {
        this.logger.error(job.id, `Job failed: ${error}`);
      }
    }
  }

  private async processJob(job: QueuedJob): Promise<void> {
    this.logger.info(job.id, `Processing job: ${job.company} - ${job.title}`);

    const config = getConfig();
    const applicationData: ApplicationData = {
      profile: config.profile,
      cv: config.cv,
      categories: config.filters.categories
    };

    const handler = getHandler(job.atsType);
    if (!handler) {
      throw new Error(`No handler found for ATS type: ${job.atsType}`);
    }

    // Navigate to ATS URL
    await this.page!.goto(job.atsUrl, { waitUntil: 'networkidle' });

    // Fill form
    await handler.fillForm(this.page!, applicationData);

    // Submit
    const result = await handler.submit(this.page!);

    if (result.success) {
      const completedJob: CompletedJob = {
        jobId: job.id,
        status: 'submitted',
        completedAt: new Date().toISOString(),
        atsApplicationId: result.applicationId
      };
      completeJob(job.id, completedJob);
      this.logger.info(job.id, `Job submitted successfully`);
    } else {
      const failedJob: FailedJob = {
        jobId: job.id,
        error: 'Submission failed',
        errorType: 'form_error',
        retried: false,
        failedAt: new Date().toISOString()
      };
      failJob(job.id, failedJob);
      this.logger.warn(job.id, `Job submission failed`);
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/worker.test.ts`
Expected: PASS (basic initialization test)

- [ ] **Step 5: Commit**

```bash
git add lib/jobs/worker.ts lib/jobs/worker.test.ts
git commit -m "feat(jobs): add main worker process with Playwright"
```

---

## PHASE 4 COMPLETION CRITERIA

✅ Rate limiter implemented with randomization
✅ Proxy manager supports rotation
✅ Main worker process integrates all components
✅ Playwright headful browser configured
✅ Stealth mode anti-detection active
✅ All tests passing: `npm test`

---

## PHASE 5: Error Handling & Monitoring (Week 6)

### Task 5.1: Implement error classification

**Files:**
- Create: `lib/jobs/error-handler.ts`
- Test: Create: `lib/jobs/error-handler.test.ts`

**Interfaces:**
- Consumes: Types from `lib/jobs/types.ts`
- Produces: `classifyError()`, `ERROR_STRATEGIES`

- [ ] **Step 1: Write the failing test**

```typescript
// lib/jobs/error-handler.test.ts

import { describe, it, expect } from 'vitest';
import { classifyError, getErrorStrategy } from './error-handler';
import type { ErrorType } from './types';

describe('Error classification', () => {
  it('classifies CAPTCHA errors', () => {
    const error = new Error('CAPTCHA detected');
    const type = classifyError(error);
    expect(type).toBe('captcha');
  });

  it('classifies rate limit errors', () => {
    const error = new Error('Rate limit exceeded 429');
    const type = classifyError(error);
    expect(type).toBe('rate_limit');
  });

  it('provides strategy for CAPTCHA', () => {
    const strategy = getErrorStrategy('captcha');
    expect(strategy.shouldRetry).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/jobs/error-handler.test.ts`
Expected: FAIL with "Cannot find module './error-handler'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// lib/jobs/error-handler.ts

import type { ErrorType } from './types';

export interface ErrorHandlingStrategy {
  shouldRetry: boolean;
  retryDelay?: number;
  maxRetries?: number;
  userMessage: string;
}

export const ERROR_STRATEGIES: Record<ErrorType, ErrorHandlingStrategy> = {
  captcha: {
    shouldRetry: false,
    userMessage: 'CAPTCHA detected - application skipped (stealth mode active)'
  },
  rate_limit: {
    shouldRetry: true,
    retryDelay: 60000,
    maxRetries: 3,
    userMessage: 'Rate limited - waiting before retry'
  },
  form_error: {
    shouldRetry: false,
    userMessage: 'Form validation failed - job skipped'
  },
  timeout: {
    shouldRetry: true,
    retryDelay: 5000,
    maxRetries: 1,
    userMessage: 'Request timed out - retrying once'
  },
  network: {
    shouldRetry: true,
    retryDelay: 10000,
    maxRetries: 2,
    userMessage: 'Network error - retrying with backoff'
  },
  validation: {
    shouldRetry: false,
    userMessage: 'Your profile data is incomplete - please update config'
  },
  ats_not_supported: {
    shouldRetry: false,
    userMessage: 'ATS not yet supported - job skipped'
  },
  unknown: {
    shouldRetry: false,
    userMessage: 'Unknown error - job skipped'
  }
};

export function classifyError(error: Error): ErrorType {
  const message = error.message.toLowerCase();

  if (message.includes('captcha') || message.includes('recaptcha')) {
    return 'captcha';
  }
  if (message.includes('rate limit') || message.includes('429')) {
    return 'rate_limit';
  }
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'timeout';
  }
  if (message.includes('network') || message.includes('ECONN')) {
    return 'network';
  }
  if (message.includes('validation') || message.includes('required')) {
    return 'validation';
  }
  if (message.includes('not supported') || message.includes('unknown ATS')) {
    return 'ats_not_supported';
  }

  return 'unknown';
}

export function getErrorStrategy(errorType: ErrorType): ErrorHandlingStrategy {
  return ERROR_STRATEGIES[errorType];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/jobs/error-handler.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/jobs/error-handler.ts lib/jobs/error-handler.test.ts
git commit -m "feat(jobs): add error classification and strategies"
```

---

### Task 5.2: Create remaining API routes

**Files:**
- Create: `app/api/jobs/queue/route.ts`
- Create: `app/api/jobs/status/route.ts`
- Create: `app/api/jobs/logs/route.ts`
- Create: `app/api/jobs/stats/route.ts`

**Interfaces:**
- Consumes: `getQueue()`, `saveQueue()`, `getLogger()` from storage and logger
- Produces: API endpoints for queue control, status, logs, stats

- [ ] **Step 1: Write queue management endpoint**

```typescript
// app/api/jobs/queue/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getQueue, clearQueue } from '@/lib/jobs/queue';

export async function GET() {
  try {
    const queue = getQueue();
    return NextResponse.json(queue);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get queue' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearQueue();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear queue' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Write status endpoint**

```typescript
// app/api/jobs/status/route.ts

import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/jobs/queue';

export async function GET() {
  try {
    const queue = getQueue();
    
    return NextResponse.json({
      isRunning: false, // In real implementation, track worker state
      pending: queue.pending.length,
      processing: queue.processing.length,
      completed: queue.completed.length,
      failed: queue.failed.length,
      stats: queue.stats
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}
```

- [ ] **Step 3: Write logs endpoint**

```typescript
// app/api/jobs/logs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getLogger } from '@/lib/jobs/logger';

export async function GET(request: NextRequest) {
  try {
    const logger = getLogger();
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'json';
    const level = searchParams.get('level') || undefined;

    const logs = logger.getLogs({ level: level as any });
    
    if (format === 'csv') {
      const csv = await logger.exportLogs('csv');
      return new NextResponse(csv, {
        headers: { 'Content-Type': 'text/csv' }
      });
    }

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get logs' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Write stats endpoint**

```typescript
// app/api/jobs/stats/route.ts

import { NextResponse } from 'next/server';
import { getQueue } from '@/lib/jobs/queue';

export async function GET() {
  try {
    const queue = getQueue();
    
    return NextResponse.json(queue.stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
```

- [ ] **Step 5: Test all endpoints**

Run: `npm run dev`

Test queue: `curl http://localhost:3000/api/jobs/queue`
Test status: `curl http://localhost:3000/api/jobs/status`
Test logs: `curl http://localhost:3000/api/jobs/logs`
Test stats: `curl http://localhost:3000/api/jobs/stats`

- [ ] **Step 6: Commit**

```bash
git add app/api/jobs/queue/route.ts app/api/jobs/status/route.ts app/api/jobs/logs/route.ts app/api/jobs/stats/route.ts
git commit -m "feat(jobs): add remaining API routes"
```

---

### Task 5.3: Create dashboard UI components

**Files:**
- Create: `components/jobs/Dashboard.tsx`
- Create: `components/jobs/StatsCards.tsx`
- Create: `components/jobs/QueueStatus.tsx`
- Create: `components/jobs/ActivityFeed.tsx`

**Interfaces:**
- Consumes: React 19, API routes
- Produces: Dashboard components

- [ ] **Step 1: Create StatsCards component**

```typescript
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
```

- [ ] **Step 2: Create QueueStatus component**

```typescript
// components/jobs/QueueStatus.tsx

'use client';

import { useEffect, useState } from 'react';

interface QueueStatus {
  isRunning: boolean;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export function QueueStatus() {
  const [status, setStatus] = useState<QueueStatus>({
    isRunning: false,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0
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

  const progress = status.total > 0 ? (status.completed / status.total) * 100 : 0;

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Queue Status</h2>
      
      {status.isRunning ? (
        <div>
          <div className="mb-2">Processing job {status.processing + 1}/{status.total}</div>
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
```

- [ ] **Step 3: Create ActivityFeed component**

```typescript
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
```

- [ ] **Step 4: Update main dashboard page**

Update `app/tools/jobs/page.tsx`:
```typescript
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
```

- [ ] **Step 5: Test components render**

Run: `npm run dev`
Visit: `http://localhost:3000/tools/jobs`
Expected: All components render

- [ ] **Step 6: Commit**

```bash
git add components/jobs/ app/tools/jobs/page.tsx
git commit -m "feat(jobs): add dashboard UI components"
```

---

## PHASE 5 COMPLETION CRITERIA

✅ Error classification implemented
✅ Error strategies defined
✅ All API routes functional
✅ Dashboard UI complete with real-time updates
✅ Activity feed shows recent logs
✅ All tests passing: `npm test`

---

## FINAL COMPLETION CRITERIA

✅ **Dashboard functional at `/tools/jobs`**
✅ **Can scan and queue jobs from hiddenjobs.dev**
✅ **Can automate applications for Greenhouse, Ashby, SmartRecruiters**
✅ **Processes jobs with rate limiting and stealth mode**
✅ **Real-time progress monitoring**
✅ **Comprehensive error handling and logging**
✅ **Export functionality for logs (CSV/JSON)**
✅ **All 5 phases completed**
✅ **All tests passing: `npm test`**
✅ **TypeScript compiles without errors: `npx tsc --noEmit`**

---

## EFFORT ESTIMATION

**Phase 1 (Foundation):** ~40 hours
**Phase 2 (hiddenjobs.dev Integration):** ~32 hours
**Phase 3 (ATS Handlers):** ~48 hours
**Phase 4 (Rate Limiting & Proxy):** ~40 hours
**Phase 5 (Error Handling & Monitoring):** ~32 hours

**Total Estimated Effort:** ~192 hours (6 weeks at 32 hours/week)

---

## DEPLOYMENT CHECKLIST

- [ ] Update Next.js config for any required headers
- [ ] Set up Vercel Blob for CV storage (if needed)
- [ ] Configure environment variables (if any)
- [ ] Test all API routes in production
- [ ] Test Playwright browser launch in production
- [ ] Verify localStorage persistence
- [ ] Test rate limiting with real jobs
- [ ] Verify CAPTCHA detection works
- [ ] Test export functionality
- [ ] Document any production-specific configurations

---

## ROLLBACK PLAN

If critical issues arise in production:
1. Disable job queue processing immediately
2. Keep dashboard accessible for viewing results
3. Export all logs for analysis
4. Revert to previous working commit if needed

---

