import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Redis } from 'ioredis';

import { RedisRateLimiter } from '../../src/rate-limiter/redis-rate-limiter';

vi.mock('ioredis');

describe('RedisRateLimiter', () => {
  let rateLimiter: RedisRateLimiter;
  let mockRedis: any;

  beforeEach(() => {
    mockRedis = {
      incr: vi.fn(),
      expire: vi.fn(),
      ttl: vi.fn(),
    };
    rateLimiter = new RedisRateLimiter(mockRedis, 100, 60);
    vi.clearAllMocks();
  });

  describe('consume', () => {
    it('should allow requests within limit', async () => {
      const key = 'test-key';

      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(59);

      const result = await rateLimiter.consume(key);

      expect(mockRedis.incr).toHaveBeenCalledWith(key);
      expect(mockRedis.expire).toHaveBeenCalledWith(key, 60);
      expect(mockRedis.ttl).toHaveBeenCalledWith(key);
      expect(result.remaining).toBe(99);
      expect(result.isLimited).toBe(false);
      expect(result.resetIn).toBe(59);
    });

    it('should not set expire for subsequent requests', async () => {
      const key = 'test-key';

      mockRedis.incr.mockResolvedValue(2);
      mockRedis.ttl.mockResolvedValue(58);

      const result = await rateLimiter.consume(key);

      expect(mockRedis.incr).toHaveBeenCalledWith(key);
      expect(mockRedis.expire).not.toHaveBeenCalled();
      expect(mockRedis.ttl).toHaveBeenCalledWith(key);
      expect(result.remaining).toBe(98);
      expect(result.isLimited).toBe(false);
    });

    it('should limit requests when exceeded', async () => {
      const key = 'test-key';

      mockRedis.incr.mockResolvedValue(101);
      mockRedis.ttl.mockResolvedValue(30);

      const result = await rateLimiter.consume(key);

      expect(mockRedis.incr).toHaveBeenCalledWith(key);
      expect(result.remaining).toBe(0);
      expect(result.isLimited).toBe(true);
      expect(result.resetIn).toBe(30);
    });

    it('should use custom overrides', async () => {
      const key = 'test-key';

      mockRedis.incr.mockResolvedValue(1);
      mockRedis.ttl.mockResolvedValue(25);

      const result = await rateLimiter.consume(key, { limit: 5, windowSec: 30 });

      expect(mockRedis.incr).toHaveBeenCalledWith(key);
      expect(mockRedis.expire).toHaveBeenCalledWith(key, 30);
      expect(result.remaining).toBe(4);
      expect(result.isLimited).toBe(false);
      expect(result.resetIn).toBe(25);
    });

    it('should handle edge case when remaining is negative', async () => {
      const key = 'test-key';

      mockRedis.incr.mockResolvedValue(150);
      mockRedis.ttl.mockResolvedValue(10);

      const result = await rateLimiter.consume(key);

      expect(result.remaining).toBe(0); // Should be clamped to 0
      expect(result.isLimited).toBe(true);
    });
  });

  describe('constructor', () => {
    it('should use provided Redis instance and defaults', () => {
      const redis = new Redis();
      const limiter = new RedisRateLimiter(redis);

      expect(limiter).toBeInstanceOf(RedisRateLimiter);
    });

    it('should use custom default values', () => {
      const redis = new Redis();
      const limiter = new RedisRateLimiter(redis, 50, 30);

      expect(limiter).toBeInstanceOf(RedisRateLimiter);
    });
  });
});
