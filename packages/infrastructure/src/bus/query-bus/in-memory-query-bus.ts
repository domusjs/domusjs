import { container } from 'tsyringe';
import { Query, QueryBus, QueryHandler } from '@domusjs/core';

export class InMemoryQueryBus implements QueryBus {
  private handlers: Map<string, QueryHandler<any, any>> = new Map();

  register<Q extends Query<R>, R = any>(
    queryClass: { TYPE: string },
    handlerClass: new (...args: any[]) => QueryHandler<Q, R>
  ): void {
    const handlerInstance = container.resolve(handlerClass);
    this.handlers.set(queryClass.TYPE, handlerInstance);
  }

  async ask<Q extends Query<R>, R = any>(query: Q): Promise<R> {
    const handler = this.handlers.get(query.type);

    if (!handler) {
      throw new Error(
        `Query handler not found for type "${query.type}". Did you forget to register it?`
      );
    }

    return await handler.execute(query);
  }
}
