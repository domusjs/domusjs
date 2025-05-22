# 🛡️ DomusJS - Security Module

The `@domusjs/security` module provides cryptographic utilities for password hashing and verification. It is designed to be easily integrated into any authentication system or security-sensitive feature in Backend applications.

---

## ✨ Features

- 🔒 Secure password hashing using [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- 🔁 Pluggable hasher strategy
- 🧪 Easy to mock for testing


---

## 🚀 Usage

### 1. Register the Security Module

```ts
import { registerSecurityModule } from '@domusjs/security';

registerSecurityModule();
```

### 2. Use the Hashing Service

```ts
import { container } from 'tsyringe';
import { HashingService } from '@domusjs/security';

const hashingService = container.resolve<HashingService>('HashingService');

const hashedPassword = await hashingService.hash('myPassword123');

const isValid = await hashingService.compare('myPassword123', hashedPassword); // Returns true
```

---

## 🧪 Testing

You can mock the `HashingService` in unit tests by providing a fake implementation:

```ts
const mockHasher = {
  hash: vi.fn().mockResolvedValue('hashed'),
  compare: vi.fn().mockResolvedValue(true),
};
```
