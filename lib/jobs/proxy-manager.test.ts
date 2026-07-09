// lib/jobs/proxy-manager.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { ProxyManager } from './proxy-manager';

describe('ProxyManager', () => {
  it('tracks jobs since rotation', () => {
    const manager = new ProxyManager(['http://proxy1:8080'], 10);

    expect(manager.shouldRotate()).toBe(false);

    for (let i = 0; i < 9; i++) {
      manager.trackJob();
    }
    expect(manager.shouldRotate()).toBe(false);

    manager.trackJob();
    expect(manager.shouldRotate()).toBe(true);
  });
});
