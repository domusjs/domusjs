import { describe, it, expect, beforeEach, vi } from 'vitest';

import { InMemoryRateLimiter } from '../../src/rate-limiter/in-memory-rate-limiter';

describe('InMemoryRateLimiter', () => {
  let rateLimiter: InMemoryRateLimiter;

  beforeEach(() => {
    rateLimiter = new InMemoryRateLimiter(100, 60);
  });

  describe('consume', () => {
    it('should allow requests within limit', async () => {
      const key = 'test-key';

      const result1 = await rateLimiter.consume(key);
      expect(result1.remaining).toBe(99);
      expect(result1.isLimited).toBe(false);

      const result2 = await rateLimiter.consume(key);
      expect(result2.remaining).toBe(98);
      expect(result2.isLimited).toBe(false);
    });

    it('should limit requests when exceeded', async () => {
      const key = 'test-key';

      // Consume all allowed requests
      for (let i = 0; i < 100; i++) {
        await rateLimiter.consume(key);
      }

      const result = await rateLimiter.consume(key);
      expect(result.remaining).toBe(0);
      expect(result.isLimited).toBe(true);
    });

    it('should reset window after time expires', async () => {
      const key = 'test-key';

      // Consume some requests
      await rateLimiter.consume(key);
      await rateLimiter.consume(key);

      // Mock time to advance past window
      const originalDateNow = Date.now;
      Date.now = vi.fn(() => originalDateNow() + 61000); // 61 seconds later

      const result = await rateLimiter.consume(key);
      expect(result.remaining).toBe(99); // Should reset
      expect(result.isLimited).toBe(false);

      // Restore original Date.now
      Date.now = originalDateNow;
    });

    it('should use custom overrides', async () => {
      const key = 'test-key';

      const result = await rateLimiter.consume(key, { limit: 5, windowSec: 30 });

      expect(result.remaining).toBe(4);
      expect(result.isLimited).toBe(false);
      expect(result.resetIn).toBeLessThanOrEqual(30);
    });

    it('should handle multiple keys independently', async () => {
      const key1 = 'key1';
      const key2 = 'key2';

      // Consume all requests for key1
      for (let i = 0; i < 100; i++) {
        await rateLimiter.consume(key1);
      }

      // Key2 should still be available
      const result1 = await rateLimiter.consume(key1);
      expect(result1.isLimited).toBe(true);

      const result2 = await rateLimiter.consume(key2);
      expect(result2.isLimited).toBe(false);
      expect(result2.remaining).toBe(99);
    });
  });

  describe('constructor', () => {
    it('should use default values', () => {
      const defaultLimiter = new InMemoryRateLimiter();

      expect(defaultLimiter).toBeInstanceOf(InMemoryRateLimiter);
    });

    it('should use custom default values', () => {
      const customLimiter = new InMemoryRateLimiter(50, 30);

      expect(customLimiter).toBeInstanceOf(InMemoryRateLimiter);
    });
  });
});
