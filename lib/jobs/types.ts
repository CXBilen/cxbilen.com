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
