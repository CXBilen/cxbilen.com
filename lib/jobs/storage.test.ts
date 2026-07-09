// lib/jobs/storage.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { getConfig, saveConfig, getQueue, saveQueue } from './storage';

describe('localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getConfig', () => {
    it('returns default config when none exists', () => {
      const config = getConfig();
      expect(config).toBeDefined();
      expect(config.profile).toEqual({
        fullName: '',
        email: '',
        phone: '',
        location: ''
      });
    });
  });

  describe('saveConfig', () => {
    it('saves config to localStorage', () => {
      const config = {
        cv: { url: 'test.pdf', filename: 'test.pdf', uploadedAt: '2024-01-01' },
        profile: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          location: 'Remote'
        },
        filters: {
          categories: ['Backend'],
          titles: ['Software Engineer'],
          remoteOnly: true,
          excludeKeywords: []
        }
      };

      saveConfig(config);
      const retrieved = getConfig();

      expect(retrieved.profile.fullName).toBe('Test User');
      expect(retrieved.profile.email).toBe('test@example.com');
    });
  });

  describe('getQueue', () => {
    it('returns empty queue when none exists', () => {
      const queue = getQueue();
      expect(queue).toBeDefined();
      expect(queue.pending).toEqual([]);
      expect(queue.completed).toEqual([]);
    });
  });

  describe('saveQueue', () => {
    it('saves queue to localStorage', () => {
      const queue = {
        pending: [],
        processing: [],
        completed: [],
        failed: [],
        stats: { total: 0, completed: 0, failed: 0, skipped: 0 }
      };

      saveQueue(queue);
      const retrieved = getQueue();

      expect(retrieved.stats.total).toBe(0);
    });
  });
});
