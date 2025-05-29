import { Query } from '../query';
import { QueryHandler } from '../handler';

export interface QueryBus {
  ask<T extends Query, R = any>(query: T): Promise<R>;
  register<Q extends Query, R = any>(
    queryClass: { TYPE: string },
    handlerClass: new (...args: any[]) => QueryHandler<Q, R>
  ): void;
}
