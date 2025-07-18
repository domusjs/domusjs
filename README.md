
<p align="center">
  <a href="https://domusjs.com/" target="blank"><img src="https://domusjs.com/domusjs_logo.png" width="120" alt="DomusJS Logo" /></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@domusjs/core"><img src="https://img.shields.io/npm/v/@domusjs/core?style=flat-square&color=blue" alt="npm version" /></a>
  <a href="https://github.com/vssalcedo/DomusJS/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  
</p>

<p align="center">
  <strong>A modern, TypeScript-first backend framework built for scalable, enterprise-grade applications.</strong><br>
  <em>Clean Architecture • CQRS • Domain-Driven Design • Modular Design</em>
</p>

<p align="center">
  DomusJS provides a lightweight yet powerful foundation for building robust backend systems. 
  It emphasizes <strong>clarity</strong>, <strong>extensibility</strong>, and <strong>separation of concerns</strong> 
  through clean architecture principles and modular design patterns.
</p>

<p align="center">
  Whether you're building microservices, event-driven systems, or complex enterprise applications, 
  DomusJS gives you the building blocks to create scalable, maintainable, and testable code 
  with plug-and-play modules for authentication, job queues, cron jobs, and more.
</p>


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
| `@domusjs/observability`  | Distributed tracing (OpenTelemetry, Datadog ready)           |

---

## 🚀 Getting Started

To get started, check out the [Official Documentation](https://docs.domusjs.com/getting-started/introduction).

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

## 📫 Stay in touch

- Website: https://domusjs.com
- Author: [Sergio Salcedo](https://github.com/vssalcedo)
- X: [@vssalcedox](https://x.com/vssalcedox)

---

## License

MIT
