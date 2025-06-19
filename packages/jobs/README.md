# @domusjs/jobs

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

## Install

```bash
npm install @domusjs/jobs
```

## Usage

### 1. Define a Job

```ts
// hello-world.job.ts
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

✅ This defines a reusable job by extending `JobTask`, with a clear `jobName` identifier and its own `execute()` logic.

---

### 2. Set Up Client, Queue, Worker, and Events

```ts
import 'reflect-metadata';

import { DomusJobClient } from '@domusjs/jobs';
import { HelloWorldJob } from './hello-world.job';

// Create a client with Redis connection settings
const client = new DomusJobClient({
  host: 'localhost',
  port: 6379,
  password: 'your_password',
});

// Create a queue
const queue = client.createQueue('basic_queue');

// Add a worker for the queue
const worker = client.createWorker(queue, [HelloWorldJob]);

// Enqueue a job
await queue.add(new HelloWorldJob({ name: 'DomusJS' }));

// Handle worker events
worker.onFailed((job, error) => {
  console.error('Job failed:', {
    jobId: job?.id,
    error: error.message,
  });
});

worker.onCompleted((job, result) => {
  console.info('Job completed:', {
    jobId: job?.id,
    result,
  });
});
```

---

## 🔗 Learn More

For advanced aspects, check out the full documentation:

👉 [https://docs.domusjs.com](https://docs.domusjs.com)
