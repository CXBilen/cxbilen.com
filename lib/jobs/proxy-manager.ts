// lib/jobs/proxy-manager.ts

export class ProxyManager {
  private proxies: string[];
  private currentIndex: number = 0;
  private jobsSinceRotation: number = 0;

  constructor(proxies: string[], private rotateEveryJobs: number) {
    this.proxies = proxies;
  }

  trackJob(): void {
    this.jobsSinceRotation++;
  }

  shouldRotate(): boolean {
    return this.jobsSinceRotation >= this.rotateEveryJobs;
  }

  getCurrentProxy(): string {
    return this.proxies[this.currentIndex];
  }

  rotate(): void {
    this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
    this.jobsSinceRotation = 0;
  }
}
