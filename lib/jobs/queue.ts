// lib/jobs/queue.ts

import type { QueuedJob, CompletedJob, FailedJob } from './types';
import { getQueue, saveQueue } from './storage';

export function addToQueue(job: QueuedJob): void {
  const queue = getQueue();
  queue.pending.push(job);
  queue.stats.total++;
  saveQueue(queue);
}

export function getNextJob(): QueuedJob | null {
  const queue = getQueue();

  if (queue.pending.length === 0) {
    return null;
  }

  const job = queue.pending.shift();
  if (job) {
    queue.processing.push(job);
    saveQueue(queue);
    return job;
  }

  return null;
}

export function completeJob(
  jobId: string,
  result: CompletedJob
): void {
  const queue = getQueue();

  // Remove from processing
  queue.processing = queue.processing.filter(j => j.id !== jobId);

  // Add to completed
  queue.completed.push(result);
  queue.stats.completed++;
  saveQueue(queue);
}

export function failJob(jobId: string, error: FailedJob): void {
  const queue = getQueue();

  // Remove from processing
  queue.processing = queue.processing.filter(j => j.id !== jobId);

  // Add to failed
  queue.failed.push(error);
  queue.stats.failed++;
  saveQueue(queue);
}

export function clearQueue(): void {
  const emptyQueue = {
    pending: [],
    processing: [],
    completed: [],
    failed: [],
    stats: {
      total: 0,
      completed: 0,
      failed: 0,
      skipped: 0
    }
  };

  saveQueue(emptyQueue);
}
