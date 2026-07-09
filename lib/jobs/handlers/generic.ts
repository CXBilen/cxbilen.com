// lib/jobs/handlers/generic.ts

import type { Page } from 'playwright';
import type { ATSHandler, ApplicationData } from './base';

export class GenericHandler implements ATSHandler {
  atsType = 'other' as const;

  detect(): boolean {
    return true; // Catch-all
  }

  async fillForm(page: Page, data: ApplicationData): Promise<void> {
    await page.waitForTimeout(1000);

    // Try common patterns
    const emailInputs = page.locator('input[type="email"]');
    if (await emailInputs.count() > 0) {
      await emailInputs.first().fill(data.profile.email);
    }

    const nameInputs = page.locator('input[name*="name"], input[id*="name"]');
    if (await nameInputs.count() > 0) {
      await nameInputs.first().fill(data.profile.fullName);
    }

    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(data.cv.url);
    }
  }

  async submit(page: Page): Promise<{ success: boolean; applicationId?: string }> {
    const submitButtons = page.locator('button[type="submit"], button:has-text("Apply"), button:has-text("Submit")');
    if (await submitButtons.count() > 0) {
      await submitButtons.first().click();
      await page.waitForTimeout(3000);
      return { success: true };
    }
    return { success: false };
  }
}
