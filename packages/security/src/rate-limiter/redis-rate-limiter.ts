import { Redis } from 'ioredis';

import { RateLimiter } from './rate-limiter.interface';
import { RateLimitResult } from './rate-limiter.interface';

export class RedisRateLimiter implements RateLimiter {
  constructor(
    private readonly redis: Redis,
    private readonly defaultLimit = 100,
    private readonly defaultWindowSec = 60
  ) {}

  async consume(
    key: string,
    overrides: { limit?: number; windowSec?: number } = {}
  ): Promise<RateLimitResult> {
    const limit = overrides.limit ?? this.defaultLimit;
    const windowSec = overrides.windowSec ?? this.defaultWindowSec;

    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, windowSec);
    }

    const ttl = await this.redis.ttl(key);

    return {
      remaining: Math.max(limit - current, 0),
      resetIn: ttl,
      isLimited: current > limit,
    };
  }
}
