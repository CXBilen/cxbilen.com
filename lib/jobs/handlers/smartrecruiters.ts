// lib/jobs/handlers/smartrecruiters.ts

import type { Page } from 'playwright';
import type { ATSHandler, ApplicationData } from './base';

export class SmartRecruitersHandler implements ATSHandler {
  atsType = 'smartrecruiters' as const;

  detect(url: string): boolean {
    return url.includes('smartrecruiters.com');
  }

  async fillForm(page: Page, data: ApplicationData): Promise<void> {
    await page.waitForSelector('form', { timeout: 10000 });

    await page.fill('input[name*="firstName"], input[id*="firstName"]', data.profile.fullName.split(' ')[0]);
    await page.fill('input[name*="lastName"], input[id*="lastName"]', data.profile.fullName.split(' ').slice(1).join(' '));
    await page.fill('input[type="email"]', data.profile.email);
    await page.fill('input[type="tel"], input[name*="phone"]', data.profile.phone);

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(data.cv.url);
    }
  }

  async submit(page: Page): Promise<{ success: boolean; applicationId?: string }> {
    const hasCaptcha = await page.locator('iframe[title*="recaptcha"]').count() > 0;
    if (hasCaptcha) {
      throw { type: 'captcha', message: 'CAPTCHA detected' };
    }

    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    return { success: true };
  }
}
