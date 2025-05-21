# 🛡️ DomusJS - Auth Module

The `@domusjs/auth` module provides a flexible authentication layer. It is designed to support multiple authentication strategies (e.g. password, Google, GitHub), allowing developers to plug in their own providers and control the shape of the authenticated user data (`AuthResult`).

## ✨ Features

- 🔑 Support for multiple auth providers (password, OAuth, etc.)
- 🔄 Strategy pattern for easy extensibility
- 🔐 JWT integration for session management
- 🧩 Decoupled design to support any domain-specific user model
- ✅ Built-in interfaces and services to speed up integration




## 🚀 Usage

### 1. Define your own `AuthResult`

```ts
export interface UserAuthResult {
  userId: string;
  email: string;
  roles: string[];
}
```

### 2. Implement a custom strategy

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

### 3. Register Auth Module with custom strategies

```ts
import { registerAuthModule, AuthService } from "@domusjs/auth";

const jwtOptions = {
    secret: 'my_jwt_secret',
    expiresIn: '1h'
};

registerAuthModule([{
    strategy: PasswordAuthStrategy,
    instance: new PasswordAuthStrategy()
}], jwtOptions);
```

### 4. Use AuthService

```ts

const authService = container.resolve('AuthService');
const authResult = await authService.loginWith(PasswordAuthStrategy, { email: 'me@test.com', password: '1234' });
```

---

### 📐 Design Philosophy

- **Open to extension, closed to modification** – easily plug in custom strategies.
- **Domain-agnostic** – does not assume any user model.
- **Type-safe by default** – strategy payloads and results are strongly typed.
- **Testable** – the service and strategies are easy to mock in isolation.
