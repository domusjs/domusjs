import { Command, CommandBus } from '@domusjs/core';

export type Middleware<C extends Command = Command> = (
  command: C,
  next: () => Promise<void>
) => Promise<void>;

export class MiddlewareCommandBus implements CommandBus {
  private middlewares: Middleware[] = [];

  constructor(private readonly base: CommandBus) {}

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  async dispatch<C extends Command>(command: C): Promise<void> {
    const composed = this.middlewares.reverse().reduce<() => Promise<void>>(
      (next, middleware) => () => middleware(command, next),
      () => this.base.dispatch(command)
    );

    await composed();
  }
}
