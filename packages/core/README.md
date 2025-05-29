# 🧠 DomusJS - Core Module

The `@domusjs/core` module provides the foundational building blocks for implementing Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) in TypeScript applications. It defines domain primitives, error types, and interfaces for command and query handling.

## ✨ Key Concepts

### 🚀 Commands & Queries

DomusJS Core introduces `CommandHandler` and `QueryHandler` interfaces to decouple business logic from transport layers, following the CQRS (Command Query Responsibility Segregation) pattern.

#### Commands

Commands represent write operations that change the system state:

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

#### Queries

Queries represent read operations that retrieve data

```ts
class GetUserQuery {
  static readonly TYPE = 'GetUser';
  readonly type = GetUserQuery.TYPE;

  constructor(public readonly userId: string) {}
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
      email: 'john.doe@example.com',
    };
  }
}
```

#### Registration & Usage

Register your handlers with the command and query buses:

```ts
import { container } from 'tsyringe';
import { CommandBus, QueryBus } from '@domusjs/core';
import { registerCommandHandler, registerQueryHandler } from '@domusjs/infrastructure';

const commandBus = container.resolve<CommandBus>('CommandBus');
const queryBus = container.resolve<QueryBus>('QueryBus');

registerCommandHandler(commandBus, CreateUserCommand, CreateUserHandler);
registerQueryHandler(queryBus, GetUserQuery, GetUserHandler);
```

Dispatch commands and execute queries:

```ts
import { container } from 'tsyringe';
import { CommandBus, QueryBus } from '@domusjs/core';

const commandBus = container.resolve<CommandBus>('CommandBus');
const queryBus = container.resolve<QueryBus>('QueryBus');

// Execute a command (write operation)
await commandBus.dispatch(new CreateUserCommand('john', 'john.doe@example.com'));

// Execute a query (read operation)
const user = await queryBus.ask(new GetUserQuery('123'));
```

> Handlers encapsulate single actions or read queries, following CQRS principles by separating write and read responsibilities.

### 🧩 Domain Building Blocks

#### Value Objects

Value Objects represent immutable concepts in your domain:

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

#### Entities

Entities represent objects with identity that can change over time:

```ts
class User extends Entity<{ email: Email; name: string }> {
  constructor(props: { email: Email; name: string }, id?: UniqueEntityId) {
    super(props, id);
  }

  get email(): Email {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }
}
```

#### Unique Entity Identifiers

A lightweight UUID wrapper for entity identification:

```ts
const id = new UniqueEntityId(); // auto-generates a v4 UUID
const customId = new UniqueEntityId('custom-id-string');

console.log(id.toString()); // outputs the UUID string
console.log(id.equals(customId)); // false
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
