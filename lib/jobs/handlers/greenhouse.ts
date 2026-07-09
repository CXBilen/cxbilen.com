// lib/jobs/handlers/greenhouse.ts

import type { Page } from 'playwright';
import type { ATSHandler, ApplicationData } from './base';
import { generateCoverLetter } from './base';

export class GreenhouseHandler implements ATSHandler {
  atsType = 'greenhouse' as const;

  detect(url: string): boolean {
    return url.includes('greenhouse.io');
  }

  async fillForm(page: Page, data: ApplicationData): Promise<void> {
    // Wait for form to load
    await page.waitForSelector('.application-form, form', { timeout: 10000 });

    // Fill standard fields
    const firstName = data.profile.fullName.split(' ')[0];
    const lastName = data.profile.fullName.split(' ').slice(1).join(' ');

    await page.fill('#first_name, input[name="first_name"]', firstName);
    await page.fill('#last_name, input[name="last_name"]', lastName);
    await page.fill('#email, input[name="email"]', data.profile.email);
    await page.fill('#phone, input[name="phone"]', data.profile.phone);

    // Handle resume upload
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(data.cv.url);
    }

    // Handle LinkedIn/GitHub fields
    const linkedinField = page.locator('input[id*="linkedin"], input[name*="linkedin"]').first();
    if (await linkedinField.isVisible() && data.profile.linkedin) {
      await linkedinField.fill(data.profile.linkedin);
    }

    const githubField = page.locator('input[id*="github"], input[name*="github"]').first();
    if (await githubField.isVisible() && data.profile.github) {
      await githubField.fill(data.profile.github);
    }

    // Handle cover letter textarea
    const coverLetterField = page.locator('textarea[id*="cover"], textarea[name*="cover"]').first();
    if (await coverLetterField.isVisible()) {
      const company = await page.evaluate(() => document.querySelector('h1')?.textContent || 'the company');
      const title = await page.evaluate(() => document.querySelector('h1, .job-title')?.textContent || 'this position');
      await coverLetterField.fill(generateCoverLetter(data, company, title));
    }
  }

  async submit(page: Page): Promise<{ success: boolean; applicationId?: string }> {
    // Check for CAPTCHA before submit
    const hasCaptcha = await page.locator('iframe[title*="recaptcha"], .g-recaptcha').count() > 0;
    if (hasCaptcha) {
      throw { type: 'captcha', message: 'CAPTCHA detected - cannot proceed' };
    }

    // Submit application
    const submitButton = page.locator('button[type="submit"], input[type="submit"]').first();
    await submitButton.click();

    // Wait for success or confirmation
    try {
      await page.waitForURL(/.*\/thank_you.*/i, { timeout: 5000 });
      const applicationId = page.url().split('/').pop();
      return { success: true, applicationId };
    } catch {
      // If no URL change, check for success message
      const successMessage = page.locator('text=Thank you, text=Application received').first();
      if (await successMessage.count() > 0) {
        return { success: true };
      }
      throw { type: 'form_error', message: 'Could not confirm submission' };
    }
  }
}
