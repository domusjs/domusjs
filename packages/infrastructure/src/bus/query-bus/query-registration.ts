import { Query, QueryBus, QueryHandler } from '@domusjs/core';
import { container } from 'tsyringe';

export function registerQueryHandler<Q extends Query, R>(
  queryBus: QueryBus,
  queryClass: { TYPE: string },
  handlerClass: new (...args: any[]) => QueryHandler<Q, R>
) {
  container.register(handlerClass, { useClass: handlerClass });
  queryBus.register(queryClass, handlerClass);
}
