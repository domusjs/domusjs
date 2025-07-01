import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';
import cron from 'node-cron';
import { registerCronModule } from '../src/register';
import { startSchedulers } from '../src/start';
import { CronScheduler } from '../src/cron.scheduler';

// Mock node-cron
vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn()
  }
}));

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    register: vi.fn(),
    resolve: vi.fn()
  }
}));

describe('Cron Module Integration', () => {
  const mockCronSchedule = vi.mocked(cron.schedule);
  const mockContainerRegister = vi.mocked(container.register);
  const mockContainerResolve = vi.mocked(container.resolve);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete workflow', () => {
    it('should register module and start schedulers successfully', () => {
      // Register the module
      registerCronModule();

      // Verify registration
      expect(mockContainerRegister).toHaveBeenCalledWith('CronScheduler', {
        useValue: expect.any(CronScheduler)
      });

      // Get the registered scheduler instance
      const registrationCall = mockContainerRegister.mock.calls[0];
      const registeredScheduler = (registrationCall[1] as any).useValue;
      mockContainerResolve.mockReturnValue(registeredScheduler);

      // Start schedulers
      startSchedulers();

      // Verify resolution and start
      expect(mockContainerResolve).toHaveBeenCalledWith('CronScheduler');
    });

    it('should handle job registration and execution', () => {
      // Create a fresh scheduler for this test
      const scheduler = new CronScheduler();
      mockContainerResolve.mockReturnValue(scheduler);

      // Register a test job
      const mockTask = vi.fn();
      const testJob = {
        schedule: '0 0 * * *',
        name: 'test-job',
        task: mockTask
      };

      scheduler.register(testJob);

      // Verify job is registered
      const jobs = (scheduler as any).jobs;
      expect(jobs).toHaveLength(1);
      expect(jobs[0]).toEqual(testJob);

      // Start the scheduler
      startSchedulers();

      // Verify cron.schedule was called
      expect(mockCronSchedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));

      // Simulate job execution
      const cronCallback = mockCronSchedule.mock.calls[0][1] as Function;
      cronCallback();

      // Verify task was executed
      expect(mockTask).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple jobs in the workflow', () => {
      // Create a fresh scheduler for this test
      const scheduler = new CronScheduler();
      mockContainerResolve.mockReturnValue(scheduler);

      // Register multiple jobs
      const mockTask1 = vi.fn();
      const mockTask2 = vi.fn();

      const job1 = {
        schedule: '0 0 * * *',
        name: 'daily-job',
        task: mockTask1
      };

      const job2 = {
        schedule: '0 */6 * * *',
        name: 'every-6-hours',
        task: mockTask2
      };

      scheduler.register(job1);
      scheduler.register(job2);

      // Verify jobs are registered
      const jobs = (scheduler as any).jobs;
      expect(jobs).toHaveLength(2);

      // Start the scheduler
      startSchedulers();

      // Verify both jobs are scheduled
      expect(mockCronSchedule).toHaveBeenCalledTimes(2);
      expect(mockCronSchedule).toHaveBeenCalledWith('0 0 * * *', expect.any(Function));
      expect(mockCronSchedule).toHaveBeenCalledWith('0 */6 * * *', expect.any(Function));

      // Simulate execution of both jobs
      const callback1 = mockCronSchedule.mock.calls[0][1] as Function;
      const callback2 = mockCronSchedule.mock.calls[1][1] as Function;

      callback1();
      callback2();

      expect(mockTask1).toHaveBeenCalledTimes(1);
      expect(mockTask2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error handling', () => {
    it('should handle container resolution errors gracefully', () => {
      // Register the module
      registerCronModule();

      // Mock resolution failure
      mockContainerResolve.mockImplementation(() => {
        throw new Error('Container resolution failed');
      });

      // Should throw when trying to start schedulers
      expect(() => startSchedulers()).toThrow('Container resolution failed');
    });

    it('should handle invalid scheduler instance', () => {
      // Register the module
      registerCronModule();

      // Mock invalid scheduler
      mockContainerResolve.mockReturnValue({} as any);

      // Should throw when trying to call startAll on invalid object
      expect(() => startSchedulers()).toThrow();
    });
  });

  describe('Module exports', () => {
    it('should export all necessary functions and classes', () => {
      // Test individual imports instead of require
      expect(CronScheduler).toBeDefined();
      expect(registerCronModule).toBeDefined();
      expect(startSchedulers).toBeDefined();
    });
  });
}); 