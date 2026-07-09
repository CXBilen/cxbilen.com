// lib/jobs/worker.ts

import { firefox as playwrightFirefox, type Browser, type Page } from 'playwright';
import type { QueuedJob, CompletedJob, FailedJob, ApplicationData } from './types';
import { getNextJob, completeJob, failJob, getQueue, saveQueue } from './queue';
import { getConfig } from './storage';
import { getLogger } from './logger';
import { getHandler } from './handlers';
import { RateLimiter } from './rate-limiter';
import { ProxyManager } from './proxy-manager';

export class JobApplicationWorker {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private rateLimiter: RateLimiter;
  private proxyManager: ProxyManager | null = null;
  private logger = getLogger();
  private isRunning: boolean = false;

  constructor() {
    // Default to 200 jobs per day
    this.rateLimiter = new RateLimiter(200);

    const config = getConfig();
    if (config.proxyConfig?.enabled && config.proxyConfig.rotatingProxies) {
      this.proxyManager = new ProxyManager(
        config.proxyConfig.rotatingProxies,
        config.proxyConfig.rotateEveryJobs || 50
      );
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('worker', 'Worker already running');
      return;
    }

    this.isRunning = true;
    this.logger.info('worker', 'Starting job application worker');

    // Launch headful browser for stealth
    this.browser = await playwrightFirefox.launch({
      headless: false,
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });

    this.page = await context.newPage();

    // Anti-detection script
    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      (window as any).chrome = { runtime: {} };
    });

    // Process queue
    await this.processQueue();

    // Cleanup
    await this.browser.close();
    this.isRunning = false;
    this.logger.info('worker', 'Worker finished');
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  private async processQueue(): Promise<void> {
    while (this.isRunning) {
      const job = getNextJob();
      if (!job) {
        this.logger.info('worker', 'No more jobs in queue');
        break;
      }

      try {
        await this.rateLimiter.wait();

        // Track job for proxy rotation
        if (this.proxyManager) {
          this.proxyManager.trackJob();
          if (this.proxyManager.shouldRotate()) {
            this.proxyManager.rotate();
            this.logger.info('worker', 'Rotating proxy');
          }
        }

        await this.processJob(job);
      } catch (error) {
        this.logger.error(job.id, `Job failed: ${error}`);
      }
    }
  }

  private async processJob(job: QueuedJob): Promise<void> {
    this.logger.info(job.id, `Processing job: ${job.company} - ${job.title}`);

    const config = getConfig();
    const applicationData: ApplicationData = {
      profile: config.profile,
      cv: config.cv,
      categories: config.filters.categories
    };

    const handler = getHandler(job.atsType);
    if (!handler) {
      throw new Error(`No handler found for ATS type: ${job.atsType}`);
    }

    // Navigate to ATS URL
    await this.page!.goto(job.atsUrl, { waitUntil: 'networkidle' });

    // Fill form
    await handler.fillForm(this.page!, applicationData);

    // Submit
    const result = await handler.submit(this.page!);

    if (result.success) {
      const completedJob: CompletedJob = {
        jobId: job.id,
        status: 'submitted',
        completedAt: new Date().toISOString(),
        atsApplicationId: result.applicationId
      };
      completeJob(job.id, completedJob);
      this.logger.info(job.id, `Job submitted successfully`);
    } else {
      const failedJob: FailedJob = {
        jobId: job.id,
        error: 'Submission failed',
        errorType: 'form_error',
        retried: false,
        failedAt: new Date().toISOString()
      };
      failJob(job.id, failedJob);
      this.logger.warn(job.id, `Job submission failed`);
    }
  }
}
