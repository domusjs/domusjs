import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';
import { startSchedulers } from '../src/start';
import { CronScheduler } from '../src/cron.scheduler';

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    resolve: vi.fn()
  }
}));

// Mock CronScheduler
vi.mock('../src/cron.scheduler', () => ({
  CronScheduler: vi.fn().mockImplementation(() => ({
    startAll: vi.fn()
  }))
}));

describe('startSchedulers', () => {
  const mockContainerResolve = vi.mocked(container.resolve);
  const mockScheduler = {
    startAll: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockContainerResolve.mockReturnValue(mockScheduler);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should resolve CronScheduler from container', () => {
    startSchedulers();

    expect(mockContainerResolve).toHaveBeenCalledWith('CronScheduler');
  });

  it('should call startAll on the resolved scheduler', () => {
    startSchedulers();

    expect(mockScheduler.startAll).toHaveBeenCalledTimes(1);
  });

  it('should handle scheduler resolution failure', () => {
    const error = new Error('Scheduler not found');
    mockContainerResolve.mockImplementation(() => {
      throw error;
    });

    expect(() => startSchedulers()).toThrow('Scheduler not found');
  });

  it('should handle scheduler without startAll method', () => {
    const invalidScheduler = {};
    mockContainerResolve.mockReturnValue(invalidScheduler as any);

    expect(() => startSchedulers()).toThrow();
  });

  it('should work with valid CronScheduler instance', () => {
    const realScheduler = new CronScheduler();
    mockContainerResolve.mockReturnValue(realScheduler);

    expect(() => startSchedulers()).not.toThrow();
  });
}); 