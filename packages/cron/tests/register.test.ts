import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';

import { registerCronModule } from '../src/register';
import { CronScheduler } from '../src/cron.scheduler';

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    register: vi.fn(),
  },
}));

describe('registerCronModule', () => {
  const mockContainerRegister = vi.mocked(container.register);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register CronScheduler in the container', () => {
    registerCronModule();

    expect(mockContainerRegister).toHaveBeenCalledWith('CronScheduler', {
      useValue: expect.any(CronScheduler),
    });
  });

  it('should register with correct token', () => {
    registerCronModule();

    expect(mockContainerRegister).toHaveBeenCalledWith('CronScheduler', expect.any(Object));
  });

  it('should register with useValue strategy', () => {
    registerCronModule();

    const registrationCall = mockContainerRegister.mock.calls[0];
    expect(registrationCall[1]).toHaveProperty('useValue');
  });

  it('should register a CronScheduler instance', () => {
    registerCronModule();

    const registrationCall = mockContainerRegister.mock.calls[0];
    const registeredValue = (registrationCall[1] as any).useValue;

    expect(registeredValue).toBeInstanceOf(CronScheduler);
  });

  it('should only register once per call', () => {
    registerCronModule();

    expect(mockContainerRegister).toHaveBeenCalledTimes(1);
  });

  it('should register multiple times when called multiple times', () => {
    registerCronModule();
    registerCronModule();

    expect(mockContainerRegister).toHaveBeenCalledTimes(2);
  });
});
