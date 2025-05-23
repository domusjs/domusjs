# 🏛 DomusJS

> A scalable, TypeScript-first framework for real-world backend applications using Clean Architecture, CQRS, and modular design.


DomusJS provides a lightweight but powerful foundation for backend systems, focusing on **clarity**, **extensibility**, and **separation of concerns**. It encourages you to design your system with proper boundaries while offering plug-and-play modules for common needs like authentication, job queues, cron jobs, etc.


---

## ✨ Features

- 🧱 **Domain-Driven Design** — Entities, Value Objects, Domain Events
- 🧠 **Clean Architecture** — Independent layers and inversion of control
- 📤 **CQRS Buses** — Command/Query buses with middleware support
- 📡 **Event Bus** — In-memory or RabbitMQ integration
- 🛡️ **Authentication** — Strategy-based (e.g. Google, Password)
- ⏰ **Cron Jobs** — Declarative scheduling with full DI support
- 🧵 **Job Queues** — Asynchronous job handling powered by BullMQ
- 🧪 **TypeScript-First** — Full typings and modular organization
- 🧩 **Fully Extensible** — Bring your own implementations, override anything

---

## 📦 Packages

DomusJS is modular. Pick what you need:

| Package                   | Description                                                   |
|---------------------------|---------------------------------------------------------------|
| `@domusjs/core`           | Core contracts: Command, Query, Result, Entity, Value Object |
| `@domusjs/infrastructure` | In-memory buses, logger, dependency injection, middlewares   |
| `@domusjs/auth`           | Auth system with strategy registration + JWT support         |
| `@domusjs/security`       | Hashing, password policies, validation helpers               |
| `@domusjs/cron`           | DI-compatible cron scheduler for periodic tasks              |
| `@domusjs/jobs`           | Job queue management using BullMQ                            |
| `@domusjs/rbac`           | Role-based access control utilities                          |
| `@domusjs/observability`  | Distributed tracing (OpenTelemetry, Datadog ready)           |

---

## 🚀 Getting Started

Install the basic packages:

```bash
npm install @domusjs/core @domusjs/infrastructure
```

Then structure your app with clear contexts, services and bus-driven execution.

---

## 🧠 Philosophy

DomusJS is not a full-stack framework — it's a backend *architecture kit*.  
You decide how to structure your domain logic. DomusJS provides the building blocks to scale your architecture, not magic.

---

### 🆚 DomusJS vs NestJS

| Aspect             | **DomusJS**                                                             | **NestJS**                                                       |
|--------------------|-------------------------------------------------------------------------|------------------------------------------------------------------|
| **Philosophy**     | Architectural toolkit: minimal, modular, explicit                      | Full-stack framework: batteries-included                         |
| **Abstraction**    | Manual wiring and DI encourages ownership of design                    | Heavy use of decorators and metadata abstraction                 |
| **Complexity**     | Low baseline complexity, flexible project structure                    | Steeper learning curve with opinionated defaults                 |
| **Modularity**     | Decoupled, framework-agnostic modules (auth, jobs, etc.)               | Modular, but tightly coupled to the Nest ecosystem               |
| **Execution**      | Explicit use of Command/Query/Event Buses                              | Mostly hidden behind controller/service layers                   |
| **Use Cases**      | Perfect for microservices, backend APIs, job workers, headless apps    | Great for teams needing batteries-included structure             |

---

### 🧩 When to Use DomusJS

Use **DomusJS** if:

- You want full control over your application's architecture.
- You prefer **explicit boundaries** and **low coupling** between application layers.
- You are building **modular backend services**, **microservices**, or **event-driven systems**.
- You want to scale a backend codebase while avoiding framework lock-in.
- You need a **lean foundation** with **plug-and-play modules** for jobs, auth, RBAC, etc.

Use **NestJS** if:

- You want a comprehensive, **out-of-the-box solution** with controllers, interceptors, guards, etc.
- You're working on a **large team** that benefits from heavy conventions and tooling.
- You value a **batteries-included** ecosystem (CLI, Swagger, GraphQL, etc.).
- You prefer heavy use of **decorators and dependency injection magic**.

---

## ❤️ Contribute

DomusJS is built with simplicity and extensibility in mind. PRs are welcome, especially improvements in modularization, observability, and real-world examples.

---

## License

MIT