import { RateLimiter, RateLimitResult } from './rate-limiter.interface';

export class InMemoryRateLimiter implements RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly limit = 100,
    private readonly windowSec = 60
  ) {}

  async consume(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const record = this.store.get(key) || { count: 0, resetAt: now + this.windowSec * 1000 };

    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + this.windowSec * 1000;
    }

    record.count++;
    this.store.set(key, record);

    return {
      remaining: Math.max(this.limit - record.count, 0),
      resetIn: Math.floor((record.resetAt - now) / 1000),
      isLimited: record.count > this.limit,
    };
  }
}
