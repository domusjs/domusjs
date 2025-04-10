# 🏛 DomusJS

> A minimal, scalable framework for building real-world backend systems with TypeScript, CQRS, and Clean Architecture.

DomusJS is a modular foundation for backend applications, designed with architecture in mind. It provides clean, decoupled patterns such as Command/Query buses, Domain Events, and Dependency Injection, while offering ready-to-use modules for authentication, file storage, job queues, and scheduled tasks.

---

## ✨ Features

- 🧱 **Domain-Driven Design** – Entities, Value Objects, Aggregates, Domain Events
- ⚙️ **Clean Architecture** – Clear separation of concerns
- 📤 **Command & Query Buses** – Decoupled use case execution
- 📡 **Event Bus** – In-memory and RabbitMQ ready
- 🛡️ **Authentication** – Pluggable strategies (Google, Password, etc.)
- 🗄️ **Storage Module** – Upload to local or S3 seamlessly
- ⏰ **Cron Jobs** – Declarative scheduling with DI
- 🧵 **Job Queues** – Heavy or delayed processing via BullMQ
- 🧪 **TypeScript-first** – Strict types, modular structure
- 🧩 **Fully Extensible** – Bring your own implementation, customize everything

---

## 📦 Packages

Each module is self-contained and installable:

| Package                  | Description                      |
|--------------------------|----------------------------------|
| `@domusjs/core`          | Core interfaces and base contracts (Command, Query, Result, Handler, etc.) |
| `@domusjs/infrastructure`| In-memory buses, logger, DI, middlewares |
| `@domusjs/auth`          | Auth module (providers + JWT)    |
| `@domusjs/security`      | Hashing and password validation  |
| `@domusjs/storage`       | File storage abstraction         |
| `@domusjs/cron`          | CronScheduler                    |
| `@domusjs/jobs`          | Job queue handling (BullMQ etc.) |

---

## 🚀 Getting Started

```bash
npm install @domusjs/core @domusjs/infrastructure
```

Then structure your app with clear contexts, services and bus-driven execution.

---

## 🧠 Philosophy

DomusJS is not a full-stack framework — it's a backend *architecture kit*.  
You decide how to structure your domain logic. DomusJS provides the building blocks to scale your architecture, not magic.

---

## 🛠 Example Use (simplified)

```ts
const commandBus = container.resolve<CommandBus>('CommandBus');

await commandBus.dispatch(new CreateUserCommand('sergio@domus.dev'));
```

---

## ❤️ Contribute

DomusJS is built with simplicity and extensibility in mind. PRs are welcome, especially improvements in modularization, observability, and real-world examples.

---

## License

MIT