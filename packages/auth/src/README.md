# 🛡️ DomusJS - Auth Module

The `@domusjs/auth` module provides a flexible authentication layer for applications using the DomusJS framework. It is designed to support multiple authentication strategies (e.g. password, Google, GitHub), allowing developers to plug in their own providers and control the shape of the authenticated user data (`AuthResult`).

## ✨ Features

- 🔑 Support for multiple auth providers (password, OAuth, etc.)
- 🔄 Strategy pattern for easy extensibility
- 🔐 JWT integration for session management
- 🧩 Decoupled design to support any domain-specific user model
- ✅ Built-in interfaces and services to speed up integration

---

## 🧱 Structure

```
auth/
├── jwt/
│   ├── jwt.middleware.ts       # Middleware to validate incoming JWTs
│   └── jwt.service.ts          # Service to sign/verify tokens
├── providers/
│   ├── auth-provider.interface.ts     # Interface to implement auth providers
│   ├── auth-provider-entry.interface.ts # Maps strategy to concrete provider
│   ├── auth-result.interface.ts       # Customizable result of login
│   └── password-auth.provider.ts     # Example placeholder
├── auth.service.ts             # Core service handling login flow
└── register.ts                 # Module registration (DI)
```

---

## 🚀 Usage

### 1. Define your `AuthResult`

```ts
// user-auth-result.ts
export interface UserAuthResult {
  userId: string;
  email: string;
  roles: string[];
}
```

### 2. Implement a provider

```ts
// password-auth.provider.ts
import { AuthProvider } from '../providers/auth-provider.interface';
import { UserAuthResult } from './user-auth-result';

export class PasswordAuthProvider implements AuthProvider<{ email: string; password: string }, UserAuthResult> {
  async login(payload): Promise<UserAuthResult> {
    // Validate user, check password, etc.
    return { userId: 'abc123', email: payload.email, roles: ['user'] };
  }
}
```

### 3. Register providers

```ts
container.register<AuthProviderEntry<UserAuthResult>[]>('AuthProviders', {
  useValue: [
    { strategy: 'password', provider: new PasswordAuthProvider() },
  ],
});
```

### 4. Use AuthService

```ts
const authService = container.resolve(AuthService<UserAuthResult>);
const result = await authService.login('password', { email: 'me@test.com', password: '1234' });
```

---

## 🧩 Integration with JWT

By default, the `AuthService` will return a signed JWT using the result from `provider.login(...)`. You can customize JWT configuration via the `config-loader`.

---

## 📌 Notes

- You can define your own payload for each auth provider.
- You must register each provider and associate it with a strategy.
- You can extend `AuthService<T>` with a specific `AuthResult` shape.

---

## 🧠 Design Philosophy

- Open to extension, closed to modification.
- Domain-agnostic.
- Explicit, type-safe and testable.
