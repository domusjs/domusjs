import { Request, Response, NextFunction } from 'express';
import { RateLimiter } from './rate-limiter.interface';

export function rateLimitMiddleware(
  rateLimiter: RateLimiter,
  keyResolver: (req: Request) => string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = keyResolver(req);
    const result = await rateLimiter.consume(key);

    res.set('X-RateLimit-Remaining', result.remaining.toString());
    res.set('X-RateLimit-Reset', result.resetIn.toString());

    if (result.isLimited) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }

    next();
  };
}
