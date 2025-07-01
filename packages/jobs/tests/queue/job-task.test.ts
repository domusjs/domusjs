import { describe, it, expect } from 'vitest';
import { JobTask } from '../../src/queue/job-task';

describe('JobTask', () => {
  it('should set data via constructor', () => {
    class MyJob extends JobTask {
      static jobName = 'my-job';
      async execute() { return 1; }
    }
    const job = new MyJob({ foo: 'bar' });
    expect(job.data).toEqual({ foo: 'bar' });
  });

  it('should require execute to be implemented', async () => {
    class MyJob extends JobTask {
      static jobName = 'my-job';
      // simulate unimplemented
      async execute() {
        throw new Error('Not implemented');
      }
    }
    const job = new MyJob({});
    expect(() => job.execute()).rejects.toThrow('Not implemented');
  });

  it('should have a static jobName property', () => {
    class MyJob extends JobTask {
      static jobName = 'my-job';
      async execute() { return 1; }
    }
    expect(MyJob.jobName).toBe('my-job');
  });
}); 