import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DomusWorker } from '../../src/queue/domus-worker';
import { Job as DomusJob } from '../../src/core/job.interface';

const mockOn = vi.fn();
const mockClose = vi.fn();
const mockWorker = { on: mockOn, close: mockClose };

describe('DomusWorker', () => {
  let worker: DomusWorker;

  beforeEach(() => {
    vi.clearAllMocks();
    worker = new DomusWorker(mockWorker as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register onFailed callback and map job', () => {
    const callback = vi.fn();
    worker.onFailed(callback);
    expect(mockOn).toHaveBeenCalledWith('failed', expect.any(Function));
    // Simulate event
    const job = { id: '1', name: 'foo', data: {}, attemptsMade: 0, timestamp: 0 };
    const error = new Error('fail');
    const handler = mockOn.mock.calls[0][1];
    handler(job, error);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ id: '1', name: 'foo' }), error);
  });

  it('should handle null job in onFailed', () => {
    const callback = vi.fn();
    worker.onFailed(callback);
    const error = new Error('fail');
    const handler = mockOn.mock.calls[0][1];
    handler(null, error);
    expect(callback).toHaveBeenCalledWith(expect.any(Object), error);
  });

  it('should register onCompleted callback and map job', () => {
    const callback = vi.fn();
    worker.onCompleted(callback);
    expect(mockOn).toHaveBeenCalledWith('completed', expect.any(Function));
    const job = { id: '2', name: 'bar', data: { x: 1 }, attemptsMade: 1, timestamp: 123 };
    const result = 42;
    const handler = mockOn.mock.calls[0][1];
    handler(job, result);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ id: '2', name: 'bar' }), result);
  });

  it('should close the worker', async () => {
    await worker.close();
    expect(mockClose).toHaveBeenCalled();
  });
}); 