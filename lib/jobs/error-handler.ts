// lib/jobs/error-handler.ts

import type { ErrorType } from './types';

export interface ErrorHandlingStrategy {
  shouldRetry: boolean;
  retryDelay?: number;
  maxRetries?: number;
  userMessage: string;
}

export const ERROR_STRATEGIES: Record<ErrorType, ErrorHandlingStrategy> = {
  captcha: {
    shouldRetry: false,
    userMessage: 'CAPTCHA detected - application skipped (stealth mode active)'
  },
  rate_limit: {
    shouldRetry: true,
    retryDelay: 60000,
    maxRetries: 3,
    userMessage: 'Rate limited - waiting before retry'
  },
  form_error: {
    shouldRetry: false,
    userMessage: 'Form validation failed - job skipped'
  },
  timeout: {
    shouldRetry: true,
    retryDelay: 5000,
    maxRetries: 1,
    userMessage: 'Request timed out - retrying once'
  },
  network: {
    shouldRetry: true,
    retryDelay: 10000,
    maxRetries: 2,
    userMessage: 'Network error - retrying with backoff'
  },
  validation: {
    shouldRetry: false,
    userMessage: 'Your profile data is incomplete - please update config'
  },
  ats_not_supported: {
    shouldRetry: false,
    userMessage: 'ATS not yet supported - job skipped'
  },
  unknown: {
    shouldRetry: false,
    userMessage: 'Unknown error - job skipped'
  }
};

export function classifyError(error: Error): ErrorType {
  const message = error.message.toLowerCase();

  if (message.includes('captcha') || message.includes('recaptcha')) {
    return 'captcha';
  }
  if (message.includes('rate limit') || message.includes('429')) {
    return 'rate_limit';
  }
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'timeout';
  }
  if (message.includes('network') || message.includes('ECONN')) {
    return 'network';
  }
  if (message.includes('validation') || message.includes('required')) {
    return 'validation';
  }
  if (message.includes('not supported') || message.includes('unknown ATS')) {
    return 'ats_not_supported';
  }

  return 'unknown';
}

export function getErrorStrategy(errorType: ErrorType): ErrorHandlingStrategy {
  return ERROR_STRATEGIES[errorType];
}
