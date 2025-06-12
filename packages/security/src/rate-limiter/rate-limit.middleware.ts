import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import { RateLimiter } from './rate-limiter.interface';

type RateLimitOptions = {
  keyResolver?: (req: Request) => string;
  limit?: number;
  windowSec?: number;
};

export function rateLimitMiddleware(options?: RateLimitOptions) {
  const keyResolver = options?.keyResolver ?? ((req: Request) => req.ip ?? 'anonymous');

  return async (req: Request, res: Response, next: NextFunction) => {
    const key = keyResolver(req);
    const rateLimiter = container.resolve<RateLimiter>('RateLimiter');

    const result = await rateLimiter.consume(key, {
      limit: options?.limit,
      windowSec: options?.windowSec,
    });

    res.set('X-RateLimit-Remaining', result.remaining.toString());
    res.set('X-RateLimit-Reset', result.resetIn.toString());

    if (result.isLimited) {
      res.status(429).json({ message: 'Too many requests, please try again later.' });
      return;
    }

    next();
  };
}
