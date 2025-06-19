# 🛡️ @domusjs/security

The `@domusjs/security` module offers essential security utilities like **password hashing** and **rate limiting**, built for simplicity and extensibility. Its plug-and-play design allows you to seamlessly swap implementations while maintaining a consistent, unified interface.

📘 **Documentation:** [@domusjs/security Docs](https://docs.domusjs.com/modules/security/security-introduction/)

---

## Install

```bash
npm install @domusjs/security
```

(Optional) If you want to use the `RedisRateLimiter`, you need to install the `ioredis` package:

```bash
npm install ioredis
```

---

## Setup the module

Register the module in your main `bootstrap.ts` using the following method:

```ts
import { registerSecurityModule, RedisRateLimiter } from '@domusjs/security';
import { Redis } from 'ioredis';

registerSecurityModule({
  rateLimiter: new RedisRateLimiter(
    new Redis({
      host: 'localhost',
      port: 6379,
      password: 'your-redis-password',
    })
  ),
});
```

> ✅ This registers:
>
> - `Hasher` → default `BcryptHasher`
> - `HashingService` → wrapper with convenience methods
> - `RateLimiter` → passed implementation

You may also use the in-memory rate limiter for development:

```ts
import { registerSecurityModule, InMemoryRateLimiter } from '@domusjs/security';

registerSecurityModule({
  rateLimiter: new InMemoryRateLimiter(),
});
```

---

## Rate Limiting Middleware (for Express)

DomusJS provides an Express middleware for applying rate limits using the registered `RateLimiter`.

```ts
import { rateLimitMiddleware } from '@domusjs/security';

app.post(
  '/login',
  rateLimitMiddleware({
    keyResolver: (req) => `login:${req.ip}`,
    limit: 5,
    windowSec: 60,
  }),
  loginHandler
);
```

✅ Adds headers like `X-RateLimit-Remaining` and `X-RateLimit-Reset`  
✅ Returns 429 if limit exceeded  
✅ You can apply different limits and resolvers per route

---

### Flexible Configuration

You can apply the middleware globally:

```ts
app.use(
  rateLimitMiddleware({
    keyResolver: (req) => req.ip,
  })
);
```

And override per route:

```ts
app.post(
  '/reset-password',
  rateLimitMiddleware({
    keyResolver: (req) => `reset:${req.ip}`,
    limit: 3,
    windowSec: 300,
  }),
  resetPasswordHandler
);
```

💡 This pattern decouples your routes from a shared rate limit bucket, avoiding unintended rate sharing.

---

## HashingService Example

```ts
import { container } from 'tsyringe';
import { HashingService } from '@domusjs/security';

const hashingService = container.resolve<HashingService>('HashingService');

const hash = await hashingService.hash('my-password');
const isValid = await hashingService.compare('my-password', hash);
```

✅ Internally uses the `Hasher` interface, which defaults to `BcryptHasher`.

---

## 🔗 Learn More

For advanced aspects, check out the full documentation:

👉 [https://docs.domusjs.com](https://docs.domusjs.com)
