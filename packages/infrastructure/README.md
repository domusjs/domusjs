# @domusjs/infrastructure

The `@domusjs/infrastructure` module provides all the essential building blocks to support application execution. It's meant to bootstrap your app environment and enable scalable, modular development.

📘 **Documentation**: [@domusjs/infrastructure Docs](https://docs.domusjs.com/modules/infrastructure/infrastructure-introduction/)

---

## Features

- ✅ CommandBus, QueryBus, and EventBus interfaces and implementations
- ✅ Middleware support for cross-cutting concerns (logging, tracing, validation)
- ✅ Result wrapper
- ✅ Rich error types
- ✅ Validation utilities
- ✅ Logging implementations

---

## Installation

```bash
npm install @domusjs/infrastructure
```

---

## Example Use Case: Registering a User

### Step 1: Define the Command
```ts
import { Command } from '@domusjs/core';

export class RegisterUserCommand implements Command {
  static TYPE = 'REGISTER_USER';
  readonly type = RegisterUserCommand.TYPE;

  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
```

### Step 2: Create the Command Handler
```ts
import { CommandHandler } from '@domusjs/core';
import { RegisterUserCommand } from './register-user.command';

export class RegisterUserHandler implements CommandHandler<RegisterUserCommand> {
  async execute(command: RegisterUserCommand): Promise<void> {
    // Business logic: validate, create user, emit events
  }
}
```

### Step 3: Register and Dispatch

DomusJS provides the helper function `registerCommandHandler` to register the command handler.

```ts
import { container } from 'tsyringe';
import { CommandBus } from '@domusjs/core';
import { registerCommandHandler } from '@domusjs/infrastructure';
import { RegisterUserCommand } from './register-user.command';
import { RegisterUserHandler } from './register-user.handler';

const commandBus = container.resolve<CommandBus>('CommandBus');

registerCommandHandler(commandBus, RegisterUserCommand, RegisterUserHandler);

commandBus.dispatch(new RegisterUserCommand('john@example.com', 'secret123'));
```

✅ The controller only talks to the bus — no need to know the handler.

✅ You can extend functionality (middleware, tracing) without touching the app logic.

---

## 🔗 Learn More

For advanced patterns, dependency injection, and more, check out the full documentation:

👉 [https://docs.domusjs.com](https://docs.domusjs.com)
