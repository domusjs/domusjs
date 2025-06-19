# @domusjs/core

The `@domusjs/core` module provides the foundational building blocks for implementing Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) in TypeScript applications.

📚 Full documentation: [@domusjs/core Docs](https://docs.domusjs.com/modules/core/core-introduction/)

---

## ✨ Features

- ✅ Command and Query Buses (CQRS)
- ✅ Domain Events and Entities
- ✅ Value Objects and Repositories
- ✅ Result wrapper and rich error types
- ✅ Interfaces to decouple infrastructure
- ✅ Logging

---

## 📦 Installation

```bash
npm install @domusjs/core
```

---

## 🚀 Quick Example

```ts
import { Command, Result, CommandHandler } from '@domusjs/core';

class SayHelloCommand implements Command {
  constructor(public readonly name: string) {}
}

class SayHelloHandler implements CommandHandler<SayHelloCommand> {
  async execute(command: SayHelloCommand): Promise<Result<void>> {
    console.log(`Hello, ${command.name}`);
    return Result.ok();
  }
}
```

---

## 🔗 Learn More

For advanced patterns, dependency injection, and more, check out the full documentation:

👉 [https://docs.domusjs.com](https://docs.domusjs.com)
