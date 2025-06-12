import { RateLimiter, RateLimitResult } from './rate-limiter.interface';

export class InMemoryRateLimiter implements RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly defaultLimit = 100,
    private readonly defaultWindowSec = 60
  ) {}

  async consume(
    key: string,
    overrides: { limit?: number; windowSec?: number } = {}
  ): Promise<RateLimitResult> {
    const now = Date.now();

    const limit = overrides.limit ?? this.defaultLimit;
    const windowSec = overrides.windowSec ?? this.defaultWindowSec;

    const record = this.store.get(key) ?? {
      count: 0,
      resetAt: now + windowSec * 1000,
    };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowSec * 1000;
    }

    record.count++;
    this.store.set(key, record);

    return {
      remaining: Math.max(limit - record.count, 0),
      resetIn: Math.floor((record.resetAt - now) / 1000),
      isLimited: record.count > limit,
    };
  }
}
