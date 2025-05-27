import { Query, QueryBus, QueryHandler } from '@domusjs/core';

export type QueryMiddleware<Q extends Query = Query, R = any> = (
  query: Q,
  next: () => Promise<R>
) => Promise<R>;

export class MiddlewareQueryBus implements QueryBus {
  private middlewares: QueryMiddleware[] = [];

  constructor(private readonly base: QueryBus) {}

  use(middleware: QueryMiddleware): void {
    this.middlewares.push(middleware);
  }

  register<Q extends Query, R = any>(queryClass: { TYPE: string }, handlerClass: new (...args: any[]) => QueryHandler<Q, R>): void {}

  async ask<Q extends Query<R>, R = any>(query: Q): Promise<R> {
    const composed = this.middlewares.reverse().reduce<() => Promise<R>>(
      (next, middleware) => () => middleware(query, next),
      () => this.base.ask(query)
    );

    return composed();
  }
}
