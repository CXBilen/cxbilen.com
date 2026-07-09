// lib/jobs/handlers/index.ts

import type { ATSHandler } from './base';
import type { ATSType } from '../types';
import { GreenhouseHandler } from './greenhouse';
import { AshbyHandler } from './ashby';

const handlers = new Map<ATSType, ATSHandler>();

// Register handlers
registerHandler(new GreenhouseHandler());
registerHandler(new AshbyHandler());

export function registerHandler(handler: ATSHandler): void {
  handlers.set(handler.atsType, handler);
}

export function getHandler(atsType: ATSType): ATSHandler | null {
  const handler = handlers.get(atsType);
  if (handler) {
    return handler;
  }

  // Return generic handler as fallback
  return handlers.get('other') || null;
}

export function detectATS(url: string): ATSType {
  for (const [atsType, handler] of handlers.entries()) {
    if (handler.detect(url)) {
      return atsType;
    }
  }
  return 'other';
}
