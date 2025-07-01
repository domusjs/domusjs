import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import cron from 'node-cron';

import { CronScheduler } from '../src/cron.scheduler';

// Mock node-cron
vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn(),
  },
}));

describe('CronScheduler', () => {
  let scheduler: CronScheduler;
  const mockCronSchedule = vi.mocked(cron.schedule);

  beforeEach(() => {
    scheduler = new CronScheduler();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a job successfully', () => {
      const job = {
        schedule: '0 0 * * *',
        name: 'daily-job',
        task: vi.fn(),
      };

      scheduler.register(job);

      // Access private jobs array for testing
      const jobs = (scheduler as any).jobs;
      expect(jobs).toHaveLength(1);
      expect(jobs[0]).toEqual(job);
    });

    it('should register multiple jobs', () => {
      const job1 = {
        schedule: '0 0 * * *',
        name: 'daily-job',
        task: vi.fn(),
      };

      const job2 = {
        schedule: '0 */6 * * *',
        name: 'every-6-hours',
        task: vi.fn(),
      };

      scheduler.register(job1);
      scheduler.register(job2);

      const jobs = (scheduler as any).jobs;
      expect(jobs).toHaveLength(2);
      expect(jobs[0]).toEqual(job1);
      expect(jobs[1]).toEqual(job2);
    });

    it('should register job with valid cron expression', () => {
      const job = {
        schedule: '*/5 * * * *', // Every 5 minutes
        name: 'every-5-minutes',
        task: vi.fn(),
      };

      scheduler.register(job);

      const jobs = (scheduler as any).jobs;
      expect(jobs).toHaveLength(1);
      expect(jobs[0].schedule).toBe('*/5 * * * *');
    });
  });

  describe('startAll', () => {
    it('should start all registered jobs', () => {
      const job1 = {
        schedule: '0 0 * * *',
        name: 'daily-job',
        task: vi.fn(),
      };

      const job2 = {
        schedule: '0 */6 * * *',
        name: 'every-6-hours',
        task: vi.fn(),
      };

      scheduler.register(job1);
      scheduler.register(job2);

      scheduler.startAll();

      expect(mockCronSchedule).toHaveBeenCalledTimes(2);
      expect(mockCronSchedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));
      expect(mockCronSchedule).toHaveBeenCalledWith('0 */6 * * *', expect.any(Function));
    });

    it('should execute task when cron job runs', () => {
      const mockTask = vi.fn();
      const job = {
        schedule: '0 0 * * *',
        name: 'daily-job',
        task: mockTask,
      };

      scheduler.register(job);
      scheduler.startAll();

      expect(mockCronSchedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));

      // Simulate cron execution by calling the callback
      const cronCallback = mockCronSchedule.mock.calls[0][1] as Function;
      cronCallback();

      expect(mockTask).toHaveBeenCalledTimes(1);
    });

    it('should handle empty job list', () => {
      scheduler.startAll();

      expect(mockCronSchedule).not.toHaveBeenCalled();
    });

    it('should handle multiple executions of the same task', () => {
      const mockTask = vi.fn();
      const job = {
        schedule: '*/1 * * * *', // Every minute
        name: 'every-minute',
        task: mockTask,
      };

      scheduler.register(job);
      scheduler.startAll();

      const cronCallback = mockCronSchedule.mock.calls[0][1] as Function;

      // Simulate multiple executions
      cronCallback();
      cronCallback();
      cronCallback();

      expect(mockTask).toHaveBeenCalledTimes(3);
    });
  });

  describe('integration', () => {
    it('should register and start jobs in sequence', () => {
      const job1 = {
        schedule: '0 0 * * *',
        name: 'daily-job',
        task: vi.fn(),
      };

      const job2 = {
        schedule: '0 */6 * * *',
        name: 'every-6-hours',
        task: vi.fn(),
      };

      // Register jobs
      scheduler.register(job1);
      scheduler.register(job2);

      // Verify jobs are registered
      const jobs = (scheduler as any).jobs;
      expect(jobs).toHaveLength(2);

      // Start all jobs
      scheduler.startAll();

      // Verify cron.schedule was called for each job
      expect(mockCronSchedule).toHaveBeenCalledTimes(2);
    });
  });
});
