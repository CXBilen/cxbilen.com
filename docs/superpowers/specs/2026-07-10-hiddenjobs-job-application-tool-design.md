# Automated Job Application Tool for hiddenjobs.dev

**Design Specification**
**Date:** 2026-07-10
**Author:** Cem Bilen (with Claude)
**Status:** Approved - Ready for Implementation Planning

---

## Overview

An automated job application tool integrated into cxbilen.com portfolio site that scans hiddenjobs.dev for remote tech jobs and automatically submits applications through external ATS systems (Greenhouse, Ashby, SmartRecruiters, and others).

**Key Requirements:**
- Integrated into existing Next.js portfolio site at `/tools/jobs`
- Fully automated (find, fill, submit without user intervention per job)
- Support all ATS systems with priority on Greenhouse, Ashby, SmartRecruiters
- High volume: 200+ applications per day
- No authentication, localStorage only for data storage
- Stealth mode + CAPTCHA skip approach (no paid CAPTCHA services)
- Node.js + Playwright for browser automation

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    cxbilen.com Portfolio Site                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐     ┌──────────────────┐     ┌──────────────┐  │
│  │   Dashboard │────▶│   API Routes     │────▶│  Queue &     │  │
│  │   (/tools/  │     │   (/api/jobs/*)  │     │  Scheduler   │  │
│  │    jobs)    │     │                  │     │  (in-memory) │  │
│  └─────────────┘     └──────────────────┘     └──────────────┘  │
│                                │                       │          │
│                                │                       │          │
│                                ▼                       ▼          │
│                       ┌──────────────────────────────────────┐   │
│                       │   Job Application Worker             │   │
│                       │   (Playwright - headful browser)      │   │
│                       └──────────────────────────────────────┘   │
│                                │                                  │
│                                │                                  │
│                       ┌─────────┴────────────────┐               │
│                       │                          │                │
│                       ▼                          ▼                │
│              ┌──────────────┐         ┌─────────────────┐       │
│              │ hiddenjobs.  │         │  External ATS    │       │
│              │    dev       │         │  (Greenhouse/    │       │
│              │              │         │   Ashby/etc)     │       │
│              └──────────────┘         └─────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### User Flow

1. **Setup** - User visits dashboard, uploads CV, sets filters
2. **Start** - User clicks "Apply Now" to begin processing
3. **Processing** - Worker processes queue:
   - Fetches job details from hiddenjobs.dev
   - Opens direct apply link
   - Fills ATS form
   - Submits (or skips if CAPTCHA detected)
4. **Monitoring** - User views real-time progress on dashboard
5. **Results** - User reviews completed/failed applications, exports results

### Technical Flow

```
User Action → API Route → Queue Job → Worker Process → External ATS
     ↓             ↓           ↓            ↓              ↓
  Dashboard   Validate    Schedule    Playwright     Submit Form
  Update      Filters     Rate Limit   Fill Form      Log Result
```

---

## Data Models

### localStorage Schema

```typescript
// localStorage['jobs-config']
interface JobsConfig {
  cv: {
    url: string;           // CV PDF URL or base64
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
    categories: string[];   // ['Backend', 'AI', 'Data']
    titles: string[];       // ['Software Engineer', 'AI Engineer']
    salaryMin?: number;    // 100000
    remoteOnly: boolean;
    excludeKeywords: string[];
  };
  proxyConfig?: {
    enabled: boolean;
    rotatingProxies?: string[];
    rotateEveryJobs?: number;   // 50
  };
}

// localStorage['jobs-queue']
interface JobsQueue {
  pending: QueuedJob[];
  processing: QueuedJob[];
  completed: CompletedJob[];
  failed: FailedJob[];
  stats: QueueStats;
}

// localStorage['jobs-logs']
interface JobsLogs {
  entries: LogEntry[];
}
```

### Core Data Types

```typescript
interface QueuedJob {
  id: string;
  hiddenJobsUrl: string;
  atsType: 'greenhouse' | 'ashby' | 'smartrecruiters' | 'other';
  atsUrl: string;
  company: string;
  title: string;
  salary?: string;
  postedAt: string;
  priority: number;
  addedAt: string;
}

interface CompletedJob {
  jobId: string;
  status: 'submitted' | 'manual_review' | 'skipped';
  completedAt: string;
  atsApplicationId?: string;
  screenshot?: string;
  notes?: string;
}

interface FailedJob {
  jobId: string;
  error: string;
  errorType: 'captcha' | 'rate_limit' | 'form_error' | 'timeout' | 'other';
  retried: boolean;
  failedAt: string;
}

interface LogEntry {
  id: string;
  jobId: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface QueueStats {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  startedAt?: string;
}
```

---

## API Routes

```
GET    /api/jobs/list         → Fetch from hiddenjobs.dev with filters
POST   /api/jobs/scan         → Trigger scan & queue jobs

GET    /api/jobs/queue        → Get current queue state
POST   /api/jobs/queue/start  → Start processing queue
POST   /api/jobs/queue/pause  → Pause processing
DELETE /api/jobs/queue/clear  → Clear queue

GET    /api/jobs/:id          → Get job details
DELETE /api/jobs/:id          → Remove from queue
POST   /api/jobs/:id/retry    → Retry failed job

GET    /api/jobs/config       → Get user config
PUT    /api/jobs/config       → Update config (filters, profile, CV)
POST   /api/jobs/upload-cv    → Upload CV PDF

GET    /api/jobs/status       → Real-time worker status
GET    /api/jobs/logs         → Get logs
GET    /api/jobs/stats        → Get statistics
```

---

## Dashboard UI

Located at `/tools/jobs` with following components:

**Layout:**
- Stats cards (Total, Done, Failed, Skipped)
- Active filters display
- Queue status with progress bar
- Control buttons (Start, Pause, Clear, Export)
- Active job display
- Recent activity feed

**Config Modal:**
- Profile fields (name, email, phone, location, links)
- Job filters (categories, titles, salary, remote)
- CV upload
- Proxy configuration (optional)

**Real-time Updates:**
- Polling every 2 seconds for worker status
- Live queue progress updates
- Recent activity feed refreshes

---

## Worker Process & ATS Handlers

### Worker Architecture

Single worker instance processes queue sequentially:

```typescript
class JobApplicationWorker {
  private browser: Browser;
  private page: Page;
  private queue: Queue;
  private proxyManager: ProxyManager;
  private rateLimiter: RateLimiter;

  async start(queue: JobsQueue): Promise<void> {
    // Launch headful browser for stealth
    this.browser = await playwright.firefox.launch({
      headless: false,
      args: ['--start-maximized', '--disable-blink-features=AutomationControlled']
    });

    // Process each job with rate limiting
    while (queue.pending.length > 0) {
      const job = queue.pending.shift();
      await this.rateLimiter.wait();
      
      // Rotate proxy if configured
      if (this.proxyManager.shouldRotate()) {
        await this.proxyManager.rotate(this.page);
      }

      // Process job with error handling
      const result = await this.processJob(job);
      // Update queue based on result
    }
  }
}
```

### ATS Handler Strategy Pattern

Each ATS has dedicated handler implementing:

```typescript
interface ATSHandler {
  atsType: string;
  detect(url: string): boolean;
  fillForm(page: Page, data: ApplicationData): Promise<void>;
  submit(page: Page): Promise<{ success: boolean; applicationId?: string }>;
}
```

**Implemented Handlers:**
1. **GreenhouseHandler** - Highest priority, standard fields
2. **AshbyHandler** - Simplified form structure
3. **SmartRecruitersHandler** - Corporate ATS support
4. **GenericHandler** - Fallback for unknown ATS systems

### Stealth Mode

Anti-detection measures:
- Headful browser (not headless)
- Custom user agent
- Hide automation indicators
- Randomized request intervals
- Natural mouse movements (optional)

---

## Rate Limiting & Proxy Management

### Rate Limiter

```typescript
class RateLimiter {
  private minInterval: number;

  constructor(jobsPerDay: number) {
    // Spread requests across 24 hours with ±30% randomization
    this.minInterval = (24 * 60 * 60 * 1000) / jobsPerDay;
  }

  async wait(): Promise<void> {
    const randomOffset = Math.random() * (this.minInterval * 0.3);
    await new Promise(resolve => 
      setTimeout(resolve, this.minInterval + randomOffset)
    );
  }
}
```

For 200+ jobs/day: ~432 seconds between requests (±30% randomization)

### Proxy Manager

Optional proxy rotation every N jobs:

```typescript
class ProxyManager {
  private proxies: string[];
  private currentProxyIndex: number;
  private jobsSinceRotation: number;

  shouldRotate(): boolean {
    this.jobsSinceRotation++;
    return this.jobsSinceRotation >= this.rotationInterval;
  }

  async rotate(page: Page): Promise<void> {
    // Create new browser context with new proxy
    const proxy = this.proxies[this.currentProxyIndex];
    // ... rotation logic
  }
}
```

---

## Error Handling & Logging

### Error Classification

```typescript
type ErrorType =
  | 'captcha'           // Skip immediately, don't retry
  | 'rate_limit'        // Wait and retry
  | 'form_error'        // Log and skip
  | 'timeout'           // Retry once
  | 'network'           // Retry with backoff
  | 'validation'        // User data issue, skip
  | 'ats_not_supported' // Skip with warning
  | 'unknown';          // Log and skip
```

### Error Strategies

Each error type has predefined handling strategy:
- **captcha**: Skip immediately (stealth mode active)
- **rate_limit**: Wait 60s, retry up to 3 times
- **timeout**: Retry once after 5s
- **network**: Retry twice with 10s backoff
- **validation**: Skip, notify user to update config

### Logging System

Comprehensive logging with:
- Multiple levels (debug, info, warn, error)
- Job-specific context
- Sensitive data masking
- Last 1000 logs kept in memory
- Export to CSV/JSON

---

## Security Considerations

### Data Privacy
- CV and profile data stored locally only
- Never sent to external APIs except ATS forms
- Sensitive data masked in logs
- Optional encryption for localStorage

### Anti-Detection
- Stealth mode with headful browser
- Randomized request intervals
- Multiple user agents
- Natural behavior simulation

### Form Validation
- Required field validation before submission
- Form field type detection
- Cover letter generation when needed

### Network Security
- CORS validation on API routes
- Rate limiting per user session
- No hardcoded credentials
- Secure proxy credential storage

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Setup project structure in `/tools/jobs`
- Create API routes skeleton
- Implement localStorage data models
- Build dashboard UI shell
- Add configuration modal
- Implement basic logging

### Phase 2: hiddenjobs.dev Integration (Week 2)
- Implement `/api/jobs/list` endpoint
- Parse job listings and extract ATS URLs
- Add job queue management
- Build job listing UI with filters
- Add queue controls (start/pause/clear)

### Phase 3: ATS Handlers (Week 3-4)
- Implement base ATS handler interface
- Build Greenhouse handler
- Build Ashby handler
- Build SmartRecruiters handler
- Add fallback generic handler
- Implement Playwright browser automation
- Add stealth mode setup

### Phase 4: Rate Limiting & Proxy (Week 5)
- Implement rate limiter with configurable intervals
- Add proxy rotation manager
- Integrate with worker process
- Implement retry logic with exponential backoff
- Add CAPTCHA detection and skip

### Phase 5: Error Handling & Monitoring (Week 6)
- Implement comprehensive error classification
- Add error strategies and retry logic
- Build error dashboard UI
- Add CSV/JSON export for logs
- Implement real-time status updates
- Add success/failure statistics

---

## Testing Strategy

### Unit Tests
- ATS handler detection logic
- Form filling functions
- Error classification
- Rate limiter calculations

### Integration Tests
- End-to-end job application flow
- Queue management
- API route functionality
- localStorage persistence

### Manual Testing
- Real ATS form submissions (test jobs)
- CAPTCHA detection
- Proxy rotation
- Error recovery

---

## Tech Stack

```yaml
Frontend:
  - React 19 (Next.js 15)
  - TypeScript 5.8
  - Tailwind CSS 4
  - shadcn/ui components

Backend:
  - Next.js API Routes
  - Playwright (browser automation)
  - Node.js 24 LTS

Storage:
  - localStorage (user config, CV, queue state)
  - Vercel Blob (optional for CV storage)

Monitoring:
  - In-memory logging
  - Dashboard real-time updates

Security:
  - Stealth mode (headful browser)
  - Rate limiting
  - Proxy rotation (optional)
  - CAPTCHA detection & skip
```

---

## Success Criteria

✅ Dashboard functional at `/tools/jobs`
✅ Can scan and queue jobs from hiddenjobs.dev
✅ Can automate applications for Greenhouse, Ashby, SmartRecruiters
✅ Processes 200+ jobs per day with rate limiting
✅ Real-time progress monitoring
✅ Comprehensive error handling and logging
✅ Export functionality for results
✅ Stealth mode active to avoid detection

---

## Open Questions & Decisions Needed

1. **Vercel Function Time Limits**: 300s limit may require job chunking or alternative hosting
   - **Decision**: Use Vercel Sandbox or self-host for worker process

2. **CV Storage**: Large PDFs may exceed localStorage limits
   - **Decision**: Store in Vercel Blob, keep URL in localStorage

3. **Proxy Sources**: Where to obtain rotating proxies for high volume
   - **Decision**: User-provided, not included in base implementation

---

## Next Steps

1. ✅ Design specification approved
2. ⏳ Create detailed implementation plan (writing-plans skill)
3. ⏳ Begin Phase 1 implementation
4. ⏳ Testing and validation
5. ⏳ Deployment and monitoring

---

**Document Status: Complete - Ready for Implementation Planning**
