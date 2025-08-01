export interface RateLimiter {
  /**
   * Consumes a request from the rate limiter.
   * @param key - The key to consume the request from.
   * @param options - The options for the rate limit.
   * @returns The result of the rate limit check.
   */
  consume(key: string, options?: { limit?: number; windowSec?: number }): Promise<RateLimitResult>;
}

export interface RateLimitResult {
  /**
   * The remaining number of requests allowed.
   */
  remaining: number;
  /**
   * The number of seconds until the rate limit resets.
   */
  resetIn: number;
  /**
   * Whether the rate limit has been exceeded.
   */
  isLimited: boolean;
}
