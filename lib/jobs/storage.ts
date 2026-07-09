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
