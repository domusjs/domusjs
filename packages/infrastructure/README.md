# 🏗️ DomusJS - Infrastructure Module

The `@domusjs/infrastructure` module provides all the essential building blocks to support application execution, such as buses, logging, configuration, and validation. It's meant to bootstrap your app environment and enable scalable, modular development.

---

## ✨ Features

- 🧠 In-memory command, query and event buses
- 🧰 Middleware support for logging, validation, tracing, and more
- 📦 Integrated dependency injection via `tsyringe`
- 🔍 Input validation via Zod
- 🧪 Designed to be composable and decoupled

---

## 🚀 Usage

### 1. Register Infrastructure in your App

```ts
import { registerDomusCore, PinoLogger } from '@domusjs/infrastructure';

registerDomusCore({
  logger: new PinoLogger(),
});
```

This sets up the command/query/event buses and binds a logger instance globally via `tsyringe`. You can also create your own bus implementations using the `CommandBus`, `QueryBus`, and `EventBus` interfaces from the `@domusjs/core` module.

---

### 2. Use the Command/Query/Event Buses

```ts
const commandBus = container.resolve<CommandBus>('CommandBus');
await commandBus.dispatch(new CreateUserCommand(...));

const queryBus = container.resolve<QueryBus>('QueryBus');
const result = await queryBus.ask(new GetUserByIdQuery(userId));
```

You can also apply middlewares (e.g., for tracing or logging) to each bus.

---

### 3. Request Validation with Zod

You can apply automatic schema validation with your own zod schemas to incoming requests:

```ts
import { z } from 'zod';

export const registerUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
```

Then, apply the middleware to your routes:

```ts
import { validateBody } from '@domusjs/infrastructure';
import { registerUserSchema } from './schemas';

router.post('/register', validateBody(registerUserSchema), handler);
```

It will return 400 Bad Request if the input does not match the schema.

---

### 4. Error Handling Middleware

DomusJS provides an Express-ready error handler middleware to automatically:

- Catch thrown domain errors (like ValidationError, NotFoundError, etc.)
- Convert them into meaningful HTTP responses
- Log them using your custom logger (Logger interface)

```ts
import { errorHandler } from '@domusjs/infrastructure';

app.use(errorHandler());
```

Make sure this is placed after all route handlers and middlewares, as the last app.use(...) call.

This middleware ensures consistent error formatting and full integration with your logger.


## 🧠 Design Philosophy

- Separate infrastructure from domain and application
- Easily swappable: change bus, logger, validation without touching domain logic
- Type-safety and flexibility


## ✅ When to Use

Use this module if:

- You want to build a DDD/CQRS-based application with `DomusJS`
- You want modular logging, validation and bus middleware
- You prefer clean, decoupled infrastructure wiring
- You're aiming to scale your application across contexts and services



## 📌 Tips

- You can replace the in-memory buses with a distributed version (e.g. RabbitMQ) for production.
- You can bind your own middlewares to the buses using the `middlewares` subfolders.
- Logging is abstracted: you can use `PinoLogger` or your own `Logger` implementation.

---

## 🧪 Testing

This module is designed to be fully testable in isolation. The in-memory buses make it ideal for unit and integration testing in local environments.
