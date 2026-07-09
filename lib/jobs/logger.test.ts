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
