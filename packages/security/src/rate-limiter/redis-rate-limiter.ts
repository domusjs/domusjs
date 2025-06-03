import { RateLimiter, RateLimitResult } from './rate-limiter.interface';
import { Redis } from 'ioredis';

export class RedisRateLimiter implements RateLimiter {
  constructor(
    private readonly redis: Redis,
    private readonly limit = 100,
    private readonly windowSec = 60
  ) {}

  async consume(key: string): Promise<RateLimitResult> {
    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, this.windowSec);
    }

    const ttl = await this.redis.ttl(key);

    return {
      remaining: Math.max(this.limit - current, 0),
      resetIn: ttl,
      isLimited: current > this.limit,
    };
  }
}
