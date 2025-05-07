import { Queue } from 'bullmq';
import { JobTask } from './job-task';
import { Queue as IDomusQueue } from '../core/queue.interface';

export class DomusQueue implements IDomusQueue {
  readonly name: string;

  constructor(private readonly queue: Queue) {
    this.name = queue.name;
  }

  async add<T extends JobTask>(payload: T): Promise<void> {
    // Infer the jobName from the JobTask class via its constructor.
    const jobClass = payload.constructor as typeof JobTask;

    const jobName = jobClass.jobName;

    if (!jobName) {
      throw new Error('Job class is missing static jobName');
    }

    await this.queue.add(jobName, payload.data);
  }
}
