import { Query, QueryBus } from '@domusjs/core';

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

  async ask<Q extends Query<R>, R = any>(query: Q): Promise<R> {
    const composed = this.middlewares.reverse().reduce<() => Promise<R>>(
      (next, middleware) => () => middleware(query, next),
      () => this.base.ask(query)
    );

    return composed();
  }
}
