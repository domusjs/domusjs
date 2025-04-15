# 🔐 DomusJS - Security Module

The `@domusjs/security` module provides secure utilities and abstractions for password handling. It includes hashing functionality, value objects, and a clear service-oriented design to enforce domain rules.

---

## ✨ Features

- 🔒 Bcrypt-based password hashing
- 🧱 `PlainPassword` value object for validation at domain level
- 🧩 Extensible `Hasher` interface for future support (e.g. Argon2)
- ✅ TSyringe DI support (dependency injection)

---

## 📦 Structure

```
security/
├── hashing/
│   ├── hashing.interface.ts      # Hasher interface
│   ├── bcrypt-hasher.ts          # Concrete implementation using bcrypt
│   └── hashing.service.ts        # Main service using Hasher
├── value-objects/
│   └── plain-password.ts         # Enforces password rules (min length, format, etc.)
├── register.ts                   # Module registration in DI
└── README.md
```

---

## 🚀 Usage

### 1. Register the module

```ts
import { registerSecurityModule } from '@domusjs/security';

registerSecurityModule();
```

### 2. Use PlainPassword + HashingService

```ts
const password = PlainPassword.create('MySecurePass1!');
const hasher = container.resolve(HashingService);

const hashed = await hasher.hash(password);
const match = await hasher.compare('MySecurePass1!', hashed);
```

---

## 📌 Value Object: PlainPassword

```ts
const password = PlainPassword.create('Secret123', (val) =>
  val.length >= 8 && /[A-Z]/.test(val) && /\d/.test(val)
);
```

This guarantees validation at domain level, and makes your system more robust and expressive.

---

## 🧠 Design Philosophy

- Validation lives in the domain (`PlainPassword`)
- Hashing logic is abstracted and replaceable
- Service layer orchestrates domain & infrastructure

