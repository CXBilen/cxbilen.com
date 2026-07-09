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
