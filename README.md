# 🏛 DomusJS

> A minimal, scalable framework for building real-world backend systems with TypeScript, CQRS, and Clean Architecture.

DomusJS is a modular framework for backend applications, designed with architecture in mind. It provides clean, decoupled patterns such as Command/Query buses, Domain Events, and Dependency Injection, while offering ready-to-use modules for authentication, job queues, observability and scheduled tasks.

---

## ✨ Features

- 🧱 **Domain-Driven Design** – Entities, Value Objects, Aggregates, Domain Events
- ⚙️ **Clean Architecture** – Clear separation of concerns
- 📤 **Command & Query Buses** – Decoupled use case execution
- 📡 **Event Bus** – In-memory and RabbitMQ ready
- 🛡️ **Authentication** – Pluggable strategies (Google, Password, etc.)
- ⏰ **Cron Jobs** – Declarative scheduling with DI
- 🧵 **Job Queues** – Heavy or delayed processing via BullMQ
- 🧪 **TypeScript-first** – Strict types, modular structure
- 🧩 **Fully Extensible** – Bring your own implementation, customize everything

---

## 📦 Packages

Each module is self-contained and installable:

| Package                      | Description                                                     |
|------------------------------|-----------------------------------------------------------------|
| `@domusjs/core`              | Core interfaces and base contracts (Command, Query, Result, Handler, etc.) |
| `@domusjs/infrastructure`    | In-memory buses, logger, DI, middlewares                        |
| `@domusjs/auth`              | Auth module (pluggable providers + JWT support)                 |
| `@domusjs/security`          | Hashing, password validation, secure value objects              |
| `@domusjs/cron`              | Cron-based job scheduler with dependency injection support      |
| `@domusjs/jobs`              | Background job queue handling (BullMQ support)                  |
| `@domusjs/rbac`              | Role-Based Access Control utilities and Express middleware      |
| `@domusjs/observability`     | Tracing and observability tools (OpenTelemetry / Datadog ready) |

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

## ❤️ Contribute

DomusJS is built with simplicity and extensibility in mind. PRs are welcome, especially improvements in modularization, observability, and real-world examples.

---

## License

MIT