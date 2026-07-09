// lib/jobs/rate-limiter.test.ts

import { describe, it, expect, vi } from 'vitest';
import { RateLimiter } from './rate-limiter';

describe('RateLimiter', () => {
  it('calculates correct interval for 200 jobs per day', () => {
    const limiter = new RateLimiter(200);
    // 24 * 60 * 60 * 1000 / 200 = 432,000ms (7.2 minutes)
    expect(limiter.getMinInterval()).toBeGreaterThan(430000);
    expect(limiter.getMinInterval()).toBeLessThan(440000);
  });

  it('waits with randomization', async () => {
    const limiter = new RateLimiter(200);
    const start = Date.now();
    await limiter.wait();
    const elapsed = Date.now() - start;
    // First call should be immediate (no previous request)
    expect(elapsed).toBeGreaterThanOrEqual(0);
    expect(elapsed).toBeLessThan(100);
  });
});
