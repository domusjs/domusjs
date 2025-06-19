# @domusjs/auth

The `@domusjs/auth` module provides a modular, extensible foundation for handling user authentication in modern backend applications.

📘 **Documentation:** [@domusjs/auth Docs](https://docs.domusjs.com/modules/auth/auth-introduction/)

---

## Features

- 🧩 Pluggable strategies for authentication (e.g., credentials, Google, GitHub, etc.)
- 🔐 Unified JWT generation and validation
- ✨ Built with extensibility and type-safety in mind

---

## Installation

```bash
npm install @domusjs/auth
```

---

### Usage

#### 1. Define your own `AuthResult`

```ts
export interface UserAuthResult {
  userId: string;
  email: string;
}
```

#### 2. Implement a custom strategy

```ts
// password-auth.strategy.ts
import { AuthStrategy } from '@domusjs/auth';

interface PasswordAuthPayload {
  email: string;
  password: string;
}

interface PasswordAuthResult {
  userId: string;
  email: string;
}

export class PasswordAuthStrategy implements AuthStrategy<PasswordAuthPayload, PasswordAuthResult> {
  async login(payload: PasswordAuthPayload): Promise<PasswordAuthResult> {
    // Validate user, check password, etc.
    return { userId: 'abc123', email: payload.email };
  }
}
```

#### 3. Register Auth Module with custom strategies

```ts
import { registerAuthModule, AuthService } from '@domusjs/auth';
import { PasswordAuthStrategy } from './password-auth.strategy';

const jwtOptions = {
  secret: 'my_jwt_secret',
  expiresIn: '1h',
};

registerAuthModule(
  [
    {
      strategy: PasswordAuthStrategy,
      instance: new PasswordAuthStrategy(),
    },
  ],
  jwtOptions
);
```

#### 4. Use AuthService

```ts
import { container } from 'tsyringe';
import { AuthService } from '@domusjs/auth';
import { PasswordAuthStrategy } from './password-auth.strategy';

const authService = container.resolve<AuthService>('AuthService');
const authResult = await authService.loginWith(PasswordAuthStrategy, {
  email: 'me@test.com',
  password: '1234',
});
```

---

## 🔗 Learn More

For advanced patterns, dependency injection, and more, check out the full documentation:

👉 [https://docs.domusjs.com](https://docs.domusjs.com)