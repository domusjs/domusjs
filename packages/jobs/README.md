# 🚀 DomusJS – Jobs Module

The `@domusjs/jobs` package offers a structured and scalable solution for managing **background jobs** and **recurring tasks** in distributed applications. It operates with BullMQ under the hood.

## ✨ Features

- 🎯 Job execution abstraction
- 📦 Uses [BullMQ](https://github.com/taskforcesh/bullmq) under the hood
- 🧪 Decoupled from infrastructure, perfect for testing
- 🧩 Modular design: define jobs, workers, and queues separately


## 🚦 When to Use

Use this module when:

- You need to run asynchronous or long-running tasks off the main HTTP request cycle
- You need job retries, failure handling, or queueing logic


## 🔨 Example

### 1. Define a Job

```ts
import { JobTask } from '@domusjs/jobs';

type HelloWorldJobData = {
  name: string;
};

export class HelloWorldJob extends JobTask {
  static readonly jobName = 'hello_world';

  constructor(public readonly data: HelloWorldJobData) {
    super(data);
  }

  async execute(): Promise<string> {
    const ret = `[HelloWorldJob] Hello ${this.data.name}!`;

    return ret;
  }
}

```

### 2. Setup the Job Queue, Worker and Worker events

```ts
import 'reflect-metadata';

import { DomusJobClient } from '@domusjs/jobs';
import { HelloWorldJob } from './hello-world.job';

// Create queue
const queue = DomusJobClient.createQueue('basic_queue');

// Add a worker to the queue
const worker = DomusJobClient.createWorker(queue, [HelloWorldJob]);

// Enqueue jobs
queue.add(new HelloWorldJob({ name: 'DomusJS' }));

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

```
---

## 🧰 Testing

- Jobs are plain classes and can be tested in isolation.
- You can use in-memory queues in tests or mock queue calls.
- Avoid tight coupling to BullMQ directly — always interact through `DomusQueue`.
