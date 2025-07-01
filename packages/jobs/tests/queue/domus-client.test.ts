import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Queue, Worker } from 'bullmq';

import { DomusJobClient } from '../../src/queue/domus-client';
import { JobTask } from '../../src/queue/job-task';

const mockQueueInstance = { name: 'test-queue' };
const mockWorkerInstance = { on: vi.fn(), close: vi.fn() };

vi.mock('bullmq', () => {
  return {
    Queue: vi.fn(),
    Worker: vi.fn(),
  };
});

vi.mock('../../src/queue/domus-queue', () => ({
  DomusQueue: vi.fn().mockImplementation((q) => ({ ...q, __isDomusQueue: true })),
}));

vi.mock('../../src/queue/domus-worker', () => ({
  DomusWorker: vi.fn().mockImplementation((w) => ({ ...w, __isDomusWorker: true })),
}));

describe('DomusJobClient', () => {
  const mockConnection = { host: 'localhost', port: 6379 };
  let client: DomusJobClient;

  beforeEach(() => {
    vi.clearAllMocks();
    (Queue as any).mockReturnValue(mockQueueInstance);
    (Worker as any).mockReturnValue(mockWorkerInstance);
    client = new DomusJobClient(mockConnection as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a DomusQueue with correct name', () => {
    const queue = client.createQueue('foo');
    expect(Queue).toHaveBeenCalledWith('foo', { connection: mockConnection });
    expect(queue).toHaveProperty('name', 'test-queue');
    expect(queue).toHaveProperty('__isDomusQueue', true);
  });

  it('should create a DomusWorker with job mapping', () => {
    class MyJob extends JobTask {
      static jobName = 'my-job';
      async execute() {
        return 1;
      }
    }
    const queue = { name: 'foo' } as any;
    const jobs = [MyJob];
    const worker = client.createWorker(queue, jobs);
    expect(worker).toHaveProperty('__isDomusWorker', true);
    expect(Worker).toHaveBeenCalledWith('foo', expect.any(Function), {
      connection: mockConnection,
    });
  });

  it('should throw if job class is missing static jobName', () => {
    class BadJob extends JobTask {
      async execute() {
        return 0;
      }
    }
    const queue = { name: 'foo' } as any;
    expect(() => client.createWorker(queue, [BadJob])).toThrow(
      'Job class BadJob missing static jobName'
    );
  });

  it('should throw if no job class found for job', async () => {
    class MyJob extends JobTask {
      static jobName = 'my-job';
      async execute() {
        return 1;
      }
    }
    const queue = { name: 'foo' } as any;
    let processFn: any;
    (Worker as any).mockImplementation((_name: any, fn: any) => {
      processFn = fn;
      return mockWorkerInstance;
    });
    client.createWorker(queue, [MyJob]);
    await expect(processFn({ name: 'unknown-job', data: {} })).rejects.toThrow(
      'No job class found for job: unknown-job'
    );
  });

  it('should instantiate and execute the correct job class', async () => {
    class MyJob extends JobTask {
      static jobName = 'my-job';
      async execute() {
        return 123;
      }
    }
    const queue = { name: 'foo' } as any;
    let processFn: any;
    (Worker as any).mockImplementation((_name: any, fn: any) => {
      processFn = fn;
      return mockWorkerInstance;
    });
    client.createWorker(queue, [MyJob]);
    const result = await processFn({ name: 'my-job', data: { x: 1 } });
    expect(result).toBe(123);
  });
});
