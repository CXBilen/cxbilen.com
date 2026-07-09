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

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
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
        profile.phone = profile.phone.replace(/\d(?=.{4})/g, '*');
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
