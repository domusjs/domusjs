import { Queue, Worker, Job } from 'bullmq';
import { getBullMQConnection } from './bullmq.config';
import { JobTask } from './job-task';

import { Job as DomusJob } from '../core/job.interface';
import { Worker as DomusWorker } from '../core/worker.interface';


function toDomusJob<T>(job: Job<T>): DomusJob<T> {
    return {
        id: job.id ?? null,
        name: job.name,
        data: job.data,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason,
        returnvalue: job.returnvalue,
        timestamp: job.timestamp,
    };
}

export class BullMQWorker implements DomusWorker {
    constructor(private readonly worker: Worker) {}

    onFailed(callback: (job: DomusJob, error: Error) => void): void {
        this.worker.on('failed', (job, error) => {
            if(job) {
                callback(toDomusJob(job), error);
            } else {
                callback({} as DomusJob, error);
            }
        });
    }

    onCompleted(callback: (job: DomusJob, result: unknown) => void): void {
        this.worker.on('completed', (job, result) => {
            callback(toDomusJob(job), result);
        });
    }

    async close(): Promise<void> {
        await this.worker.close();
    }
}
