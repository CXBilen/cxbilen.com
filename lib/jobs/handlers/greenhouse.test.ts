// lib/jobs/handlers/greenhouse.test.ts

import { describe, it, expect } from 'vitest';
import { GreenhouseHandler } from './greenhouse';

describe('GreenhouseHandler', () => {
  const handler = new GreenhouseHandler();

  describe('detect', () => {
    it('detects Greenhouse URLs', () => {
      expect(handler.detect('https://job-boards.greenhouse.io/company/jobs/123')).toBe(true);
      expect(handler.detect('https://jobs.ashbyhq.com/company/jobs/123')).toBe(false);
    });
  });
});
