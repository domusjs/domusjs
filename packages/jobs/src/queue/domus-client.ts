import { Queue, Worker, Job } from 'bullmq';

import { JobTask } from './job-task';
import { Worker as IDomusWorker } from '../core/worker.interface';
import { DomusWorker } from './domus-worker';
import { DomusQueue } from './domus-queue';
import { DomusJobClientConnection } from '../core/domus-job-client-connection.interface';

interface JobTaskConstructor<T extends JobTask = any> {
  new (data: any): T;
  jobName: string;
}

export class DomusJobClient {
  constructor(private readonly connection: DomusJobClientConnection) {}

  createQueue(name: string): DomusQueue {
    const queue = new Queue(name, { connection: this.connection });
    return new DomusQueue(queue);
  }

  createWorker(queue: DomusQueue, jobs: JobTaskConstructor[]): IDomusWorker {
    const jobMap: Record<string, JobTaskConstructor> = {};

    for (const jobClass of jobs) {
      const jobName = (jobClass as any).jobName;
      if (!jobName) {
        throw new Error(`Job class ${jobClass.name} missing static jobName`);
      }
      jobMap[jobName] = jobClass;
    }

    const worker = new Worker(
      queue.name,
      async (job: Job) => {
        const JobClass = jobMap[job.name];
        if (!JobClass) {
          throw new Error(`No job class found for job: ${job.name}`);
        }

        const task = new JobClass(job.data);
        return await task.execute();
      },
      { connection: this.connection }
    );

    return new DomusWorker(worker);
  }
}
