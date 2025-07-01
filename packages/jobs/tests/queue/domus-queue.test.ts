import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { DomusQueue } from '../../src/queue/domus-queue';
import { JobTask } from '../../src/queue/job-task';

const mockAdd = vi.fn();
const mockQueue = { name: 'test-queue', add: mockAdd };

describe('DomusQueue', () => {
  let queue: DomusQueue;

  beforeEach(() => {
    vi.clearAllMocks();
    queue = new DomusQueue(mockQueue as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set the queue name', () => {
    expect(queue.name).toBe('test-queue');
  });

  it('should add a job with correct jobName and data', async () => {
    class MyJob extends JobTask {
      static jobName = 'my-job';
      async execute() {
        return 42;
      }
    }
    const job = new MyJob({ foo: 'bar' });
    await queue.add(job);
    expect(mockAdd).toHaveBeenCalledWith('my-job', { foo: 'bar' });
  });

  it('should throw if job class is missing static jobName', async () => {
    class BadJob extends JobTask {
      // no static jobName
      async execute() {
        return 0;
      }
    }
    const job = new BadJob({ foo: 'bar' });
    await expect(queue.add(job)).rejects.toThrow('Job class is missing static jobName');
  });
});
