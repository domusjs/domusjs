import { container } from 'tsyringe';
import { Query, QueryBus, QueryHandler } from '@domusjs/core';

export class InMemoryQueryBus implements QueryBus {
  async ask<Q extends Query<R>, R = any>(query: Q): Promise<R> {
    const handlerToken = `${query.type}Handler`;

    try {
      const handler = container.resolve<QueryHandler<Q, R>>(handlerToken);
      return await handler.execute(query);
    } catch {
      throw new Error(
        `Query handler not found for type "${query.type}". Did you forget to register it?`
      );
    }
  }
}
