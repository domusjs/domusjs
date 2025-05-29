# 🧠 DomusJS - Core Module

The `@domusjs/core` module provides the foundational building blocks for implementing Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) in TypeScript applications. It defines domain primitives, error types, and interfaces for command and query handling.

## ✨ Key Concepts

### ✅ Commands & Queries

DomusJS Core introduces `CommandHandler` and `QueryHandler` interfaces to decouple business logic from transport layers:


Command example:
```ts
class CreateUserCommand {
  static readonly TYPE = 'CreateUser';
  readonly type = CreateUserCommand.TYPE;

  constructor(
    public readonly username: string,
    public readonly email: string
  ) {}
}

class CreateUserHandler implements CommandHandler<CreateUserCommand> {
  async execute(command: CreateUserCommand): Promise<void> {
    // Handle creation logic

  }
}
```

Query example:
```ts
class GetUserQuery {
  static readonly TYPE = 'GetUser';
  readonly type = GetUserQuery.TYPE;

  constructor(
    public readonly userId: string
  ) {}
}

interface UserResult {
  id: string;
  name: string;
  email: string;
}

class GetUserHandler implements QueryHandler<GetUserQuery, UserResult> {
  async execute(query: GetUserQuery): Promise<UserResult> {
    // Handle query logic
    return {
      id: query.userId,
      name: 'John Doe',
      email: 'john.doe@example.com'
    };
  }
}
```

Command & Query bus registration:
```ts
import { CommandBus, QueryBus } from '@domusjs/core';
import { registerCommandHandler, registerQueryHandler } from '@domusjs/infrastructure';

registerCommandHandler(commandBus, CreateUserCommand, CreateUserHandler);
registerQueryHandler(queryBus, GetUserQuery, GetUserHandler);
```

Handlers are meant to encapsulate a single action or read query, and they follow the CQRS principle by separating write and read responsibilities.

### 🧩 Entities and Value Objects

The `Entity` and `ValueObject` base classes help model business concepts explicitly and immutably.

```ts
class Email extends ValueObject<{ value: string }> {
  static create(email: string): Email {
    if (!email.includes('@')) throw new ValidationError('Invalid email');
    return new Email({ value: email });
  }

  get value(): string {
    return this.props.value;
  }
}
```

```ts
class User extends Entity<{ email: Email; name: string }> {
  constructor(props: { email: Email; name: string }, id?: UniqueEntityId) {
    super(props, id);
  }

  get email(): Email {
    return this.props.email;
  }
}
```

### 🪪 UniqueEntityId

A lightweight UUID wrapper to help identify entities:

```ts
const id = new UniqueEntityId(); // auto-generates a v4 UUID
console.log(id.toString());
```

## 🔥 Common Errors

DomusJS Core includes common domain-level exceptions that are structured and semantically meaningful:

```ts
throw new NotFoundError('User not found');
throw new ValidationError('Invalid data', 'INVALID_DATA');
throw new UnauthorizedError('Not allowed');
throw new InternalServerError('Something went wrong', 'UNEXPECTED_ERROR');
```

These errors can be caught at a global level to send appropriate HTTP status codes or user-facing messages.

## 🧠 When Should You Use It?

Use this module if you're:

- Designing a clean architecture-based application
- Applying Domain-Driven Design and want consistent modeling
- Working with CQRS and need a contract-based system for handlers
- Building microservices or modular monoliths with explicit boundaries
