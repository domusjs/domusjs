import { CommandBus } from '../../../../../core/src/application/bus/command-bus';
import { Command } from '../../../../../core/src/application/command';

export type Middleware<C extends Command = Command, R = void> = (
  command: C,
  next: () => Promise<R>
) => Promise<R>;

export class MiddlewareCommandBus implements CommandBus {
  private middlewares: Middleware<any, any>[] = [];

  constructor(private readonly base: CommandBus) {}

  use<C extends Command = Command, R = void>(middleware: Middleware<C, R>): void {
    this.middlewares.push(middleware);
  }

  async dispatch<C extends Command, R = void>(command: C): Promise<R> {
    const composed = [...this.middlewares].reverse().reduce<() => Promise<R>>(
      (next, middleware) => () => (middleware as Middleware<C, R>)(command, next),
      () => this.base.dispatch<C, R>(command)
    );

    return composed();
  }
}
