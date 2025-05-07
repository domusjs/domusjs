import 'reflect-metadata';

import { DomusJobClient } from '../queue/domus-client';
import { HelloWorldJob } from './hello-world.job';
import { SimpleAdderJob } from './simple-adder.job';


// Create queue
const queue = DomusJobClient.createQueue('basic_queue');

// Create worker
const worker = DomusJobClient.createWorker(queue, [
  HelloWorldJob,
  SimpleAdderJob,
]);

// Enqueue jobs
queue.add(new HelloWorldJob({ name: 'DomusJS' }));
queue.add(new SimpleAdderJob({ a: 1000, b: 337 }));

// Handle worker events
worker.onFailed((job, error) => {
  console.error('Job failed', {
    jobId: job?.id,
    error: error.message,
  });
});

worker.onCompleted((job, result) => {
  console.info('Job completed', {
    jobId: job?.id,
    result,
  });
});
