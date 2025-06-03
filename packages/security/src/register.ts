import { container } from 'tsyringe';
import { Hasher } from './hashing/hashing.interface';
import { BcryptHasher } from './hashing/bcrypt-hasher';
import { HashingService } from './hashing/hashing.service';
import { RateLimiter } from './rate-limiter/rate-limiter.interface';

interface SecurityModuleOptions {
  /**
   * The rate limiter to use.
   */
  rateLimiter?: RateLimiter;
}

export function registerSecurityModule(options: SecurityModuleOptions = {}) {
  container.register<Hasher>('Hasher', {
    useClass: BcryptHasher,
  });

  container.register<HashingService>('HashingService', {
    useClass: HashingService,
  });

  if (options.rateLimiter) {
    container.register<RateLimiter>('RateLimiter', {
      useValue: options.rateLimiter,
    });
  }
}
