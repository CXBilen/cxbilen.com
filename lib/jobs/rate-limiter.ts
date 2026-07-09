// lib/jobs/rate-limiter.ts

export class RateLimiter {
  private minInterval: number;
  private lastRequest: number = 0;

  constructor(jobsPerDay: number) {
    // Spread requests across 24 hours
    this.minInterval = (24 * 60 * 60 * 1000) / jobsPerDay;
  }

  getMinInterval(): number {
    return this.minInterval;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;

    // Add ±30% randomization
    const randomOffset = Math.random() * (this.minInterval * 0.3);
    const waitTime = this.minInterval + randomOffset - elapsed;

    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequest = Date.now();
  }
}
