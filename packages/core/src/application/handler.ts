import { Command } from './command';
import { Query } from './query';
import { DomainEvent } from '../domain/event';

export interface CommandHandler<C extends Command = Command, R = void> {
  execute(command: C): Promise<R>;
}

export interface QueryHandler<Q extends Query<R>, R = any> {
  execute(query: Q): Promise<R>;
}

export interface EventHandler<E extends DomainEvent = DomainEvent> {
  handle(event: E): Promise<void>;
}
