// lib/jobs/handlers/ashby.ts

import type { Page } from 'playwright';
import type { ATSHandler, ApplicationData } from './base';
import { generateCoverLetter } from './base';

export class AshbyHandler implements ATSHandler {
  atsType = 'ashby' as const;

  detect(url: string): boolean {
    return url.includes('ashbyhq.com');
  }

  async fillForm(page: Page, data: ApplicationData): Promise<void> {
    await page.waitForSelector('form', { timeout: 10000 });

    // Ashby uses different field names
    await page.fill('[name="firstName"]', data.profile.fullName.split(' ')[0]);
    await page.fill('[name="lastName"]', data.profile.fullName.split(' ').slice(1).join(' '));
    await page.fill('[name="email"]', data.profile.email);
    await page.fill('[name="phone"]', data.profile.phone);

    // Resume upload
    const fileInput = page.locator('input[accept*="pdf"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(data.cv.url);
    }

    // LinkedIn
    const linkedinField = page.locator('input[id*="linkedin"]').first();
    if (await linkedinField.isVisible() && data.profile.linkedin) {
      await linkedinField.fill(data.profile.linkedin);
    }

    // Portfolio/GitHub
    const portfolioField = page.locator('input[id*="portfolio"], input[id*="url"]').first();
    if (await portfolioField.isVisible() && data.profile.portfolio) {
      await portfolioField.fill(data.profile.portfolio);
    }
  }

  async submit(page: Page): Promise<{ success: boolean; applicationId?: string }> {
    const hasCaptcha = await page.locator('.g-recaptcha').count() > 0;
    if (hasCaptcha) {
      throw { type: 'captcha', message: 'CAPTCHA detected' };
    }

    await page.click('button[type="submit"]');

    try {
      await page.waitForSelector('[data-ashby-element="application-success"], .success-message', { timeout: 5000 });
      return { success: true };
    } catch {
      throw { type: 'form_error', message: 'Could not confirm submission' };
    }
  }
}
