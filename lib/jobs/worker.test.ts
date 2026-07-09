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
