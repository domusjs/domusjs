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

DomusJS is not a full-stack framework — it's an *architecture-first backend kit*.

You get the **building blocks** for designing scalable, decoupled, real-world systems:
- Explicit boundaries.
- Modular contexts.
- Bus-driven execution.
- Zero magic.

DomusJS **trusts you as the architect**: it won’t hide complexity behind decorators or assumptions.

---

### 🆚 DomusJS vs NestJS

| Aspect             | **DomusJS**                                                             | **NestJS**                                                       |
|--------------------|-------------------------------------------------------------------------|------------------------------------------------------------------|
| **Philosophy**     | Minimalistic, architecture-focused toolkit for experts                 | Full-stack backend framework, batteries-included                 |
| **Abstraction**    | Explicit manual wiring, maximum developer control                      | Heavy use of decorators and metadata abstraction                 |
| **Complexity**     | Low baseline complexity, high flexibility                              | Higher baseline complexity with opinionated layers               |
| **Extensibility**  | Plug-and-play modules, easily replaceable or extendable               | Strong ecosystem, but tightly coupled modules                   |
| **Execution**      | Command/Query/Event Buses as first-class citizens                     | Controller-service driven, CQRS optional                         |
| **Use Cases**      | Best for microservices, event-driven architectures, headless backends | Best for full-stack backends, enterprise APIs, rapid scaffolding |

---

### 🧩 When to Use DomusJS

Use **DomusJS** if:

- You are an experienced backend engineer or architect.
- You want **explicit control** over the structure and flows of your application.
- You are building **modular microservices**, **job-driven systems**, or **event-driven backends**.
- You need **native observability, tracing, and decoupled buses**.
- You value **clean architecture patterns** over heavy framework conventions.
- You want to avoid framework lock-in and keep full ownership of your tech stack.

Use **NestJS** if:

- You want an **out-of-the-box solution** with rich CLI, tooling, and conventions.
- You’re working in a **large team** that benefits from standardization.
- You value **batteries-included** features like controllers, interceptors, Swagger, GraphQL.
- You prefer fast scaffolding and rapid delivery over architecture customization.

---

## ⚡ Why DomusJS?

DomusJS exists for developers who:
- Want to push the limits of scalable backend architecture.
- Prefer modular systems over monolithic frameworks.
- Need explicit control over buses, events, jobs, and tracing.
- Believe architecture should be shaped by the problem, not the framework.

---

## ❤️ Contribute

DomusJS is built with simplicity and extensibility in mind. PRs are welcome, especially improvements in modularization, observability, and real-world examples.

---

## License

MIT