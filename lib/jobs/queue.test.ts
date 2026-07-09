// lib/jobs/queue.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { addToQueue, getNextJob, completeJob, failJob, clearQueue } from './queue';
import { getQueue } from './storage';
import type { QueuedJob, CompletedJob, FailedJob } from './types';

describe('Queue management', () => {
  beforeEach(() => {
    localStorage.clear();
    // Initialize queue
    clearQueue();
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

  it('completes job and moves to completed array', () => {
    const result: CompletedJob = {
      jobId: 'job-1',
      status: 'submitted',
      completedAt: new Date().toISOString()
    };

    completeJob('job-1', result);

    const queue = getQueue();
    expect(queue.completed).toHaveLength(1);
    expect(queue.completed[0].jobId).toBe('job-1');
  });

  it('fails job and moves to failed array', () => {
    const error: FailedJob = {
      jobId: 'job-1',
      error: 'Test error',
      errorType: 'form_error',
      retried: false,
      failedAt: new Date().toISOString()
    };

    failJob('job-1', error);

    const queue = getQueue();
    expect(queue.failed).toHaveLength(1);
    expect(queue.failed[0].error).toBe('Test error');
  });

  it('clears queue', () => {
    clearQueue();
    const queue = getQueue();
    expect(queue.pending).toHaveLength(0);
    expect(queue.completed).toHaveLength(0);
    expect(queue.failed).toHaveLength(0);
  });
});
