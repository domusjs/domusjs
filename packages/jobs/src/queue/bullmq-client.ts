import { Queue, Worker, Job } from 'bullmq';

import { getBullMQConnection } from './bullmq.config';
import { JobTask } from './job-task';

export class BullMQClient {
  static createQueue(name: string): Queue {
    return new Queue(name, { connection: getBullMQConnection() });
  }

  static async enqueue<T extends JobTask>(queue: Queue, task: T): Promise<void> {
    await queue.add(task.name, task.toJSON());
  }

  static createWorker(queueName: string, jobs: Record<string, new (data: any) => JobTask>): Worker {
    return new Worker(
      queueName,
      async (job: Job) => {
        const JobClass = jobs[job.name];
        if (!JobClass) {
          throw new Error(`No job class found for job: ${job.name}`);
        }

        const task = new JobClass(job.data);
        await task.execute();
      },
      { connection: getBullMQConnection() }
    );
  }
}
