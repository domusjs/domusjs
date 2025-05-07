import { JobTask } from '../queue/job-task';

export interface Queue {
  add<T extends JobTask>(payload: T): Promise<void>;
}
