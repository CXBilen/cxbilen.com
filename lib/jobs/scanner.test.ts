// lib/jobs/scanner.test.ts

import { describe, it, expect } from 'vitest';
import { scanHiddenJobs, extractATSUrl } from './scanner';

describe('hiddenjobs.dev scanner', () => {
  describe('extractATSUrl', () => {
    it('extracts Greenhouse URL', () => {
      const html = `
        <a href="https://job-boards.greenhouse.io/testcompany/jobs/12345">Apply</a>
      `;
      const url = extractATSUrl(html);
      expect(url).toBe('https://job-boards.greenhouse.io/testcompany/jobs/12345');
    });

    it('extracts Ashby URL', () => {
      const html = `
        <a href="https://jobs.ashbyhq.com/testcompany/12345">Apply</a>
      `;
      const url = extractATSUrl(html);
      expect(url).toBe('https://jobs.ashbyhq.com/testcompany/12345');
    });

    it('returns null if no ATS URL found', () => {
      const html = '<a href="https://example.com">Apply</a>';
      const url = extractATSUrl(html);
      expect(url).toBeNull();
    });
  });
});
