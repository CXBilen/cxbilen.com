// lib/jobs/scanner.ts

import type { QueuedJob, ATSType } from './types';

export function extractATSUrl(html: string): string | null {
  // Try to extract ATS URLs from common patterns
  const patterns = [
    /https?:\/\/job-boards\.greenhouse\.io\/[^\/]+\/jobs\/[\d]+/i,
    /https?:\/\/jobs\.ashbyhq\.com\/[^\/]+\/[\d]+/i,
    /https?:\/\/www\.smartrecruiters\.com\/[^\/]+\/job\/[\d]+/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

export function detectATSType(url: string): ATSType {
  if (url.includes('greenhouse.io')) return 'greenhouse';
  if (url.includes('ashbyhq.com')) return 'ashby';
  if (url.includes('smartrecruiters.com')) return 'smartrecruiters';
  return 'other';
}

export async function scanHiddenJobs(filters: {
  categories?: string[];
  titles?: string[];
  salaryMin?: number;
  remoteOnly?: boolean;
  excludeKeywords?: string[];
}): Promise<QueuedJob[]> {
  // In a real implementation, this would scrape hiddenjobs.dev
  // For now, return mock data to test the flow
  const mockJobs: QueuedJob[] = [
    {
      id: 'job-1',
      hiddenJobsUrl: 'https://hiddenjobs.dev/jobs/1',
      atsType: 'greenhouse',
      atsUrl: 'https://job-boards.greenhouse.io/testcompany/jobs/12345',
      company: 'TestCorp',
      title: 'Senior Software Engineer',
      salary: '$150,000',
      postedAt: new Date().toISOString(),
      priority: 5,
      addedAt: new Date().toISOString()
    }
  ];

  // Filter jobs based on criteria
  return mockJobs.filter(job => {
    // Check excluded keywords
    if (filters.excludeKeywords) {
      const titleLower = job.title.toLowerCase();
      for (const keyword of filters.excludeKeywords) {
        if (titleLower.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }

    // Check salary minimum
    if (filters.salaryMin && job.salary) {
      const salaryNum = parseInt(job.salary.replace(/[^\d]/g, ''));
      if (salaryNum < filters.salaryMin) {
        return false;
      }
    }

    return true;
  });
}
