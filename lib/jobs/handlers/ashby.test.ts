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
