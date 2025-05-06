import { Job } from './job.interface';

export interface Worker {
    onFailed(callback: (job: Job, error: Error) => void): void;
    onCompleted(callback: (job: Job, result: unknown) => void): void;
    close(): Promise<void>;
}
