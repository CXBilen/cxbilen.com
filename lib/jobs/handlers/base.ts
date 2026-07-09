// lib/jobs/handlers/base.ts

import type { Page } from 'playwright';
import type { ATSType, ApplicationData } from '../types';

export type { ApplicationData };

export interface ATSHandler {
  atsType: ATSType;
  detect(url: string): boolean;
  fillForm(page: Page, data: ApplicationData): Promise<void>;
  submit(page: Page): Promise<{ success: boolean; applicationId?: string }>;
}

export function generateCoverLetter(data: ApplicationData, company: string, title: string): string {
  return `Dear Hiring Manager,

I am writing to express my interest in the ${title} position at ${company}. With my experience in ${data.categories.join(', ')}, I believe I would be a great fit for your team.

${data.profile.github ? `You can view my work at ${data.profile.github}.` : ''}
${data.profile.portfolio ? `Check out my portfolio at ${data.profile.portfolio}.` : ''}

I look forward to discussing how I can contribute to your team.

Best regards,
${data.profile.fullName}`;
}
