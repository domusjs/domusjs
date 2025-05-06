import { container } from 'tsyringe';
import { Logger } from '@domusjs/core';

import { BullMQClient } from '../queue/bullmq-client';
import { HelloWorldJob } from './hello-world.job';
import { SimpleAdderJob } from './simple-adder.job';

// Initialize logger
const logger = container.resolve<Logger>('Logger');

// Create queue
const queue = BullMQClient.createQueue('basic_queue');

// Create worker
const worker = BullMQClient.createWorker(queue.name, {
  HelloWorldJob,
  SimpleAdderJob,
});

// Enqueue jobs
BullMQClient.enqueue(queue, new HelloWorldJob({ name: 'DomusJS' }));
BullMQClient.enqueue(queue, new SimpleAdderJob({ a: 1000, b: 337 }));

// Handle worker events
worker.onFailed((job, error) => {
  logger.error('Job failed', {
    jobId: job?.id,
    error: error.message,
  });
});

worker.onCompleted((job, result) => {
  logger.info('Job completed', {
    jobId: job?.id,
    result,
  });
});
