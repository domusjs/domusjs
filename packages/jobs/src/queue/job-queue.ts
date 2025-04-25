export interface JobQueue {
  enqueue<T = any>(name: string, payload: T): Promise<void>;
}
