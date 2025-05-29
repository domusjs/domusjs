import { DomainEvent } from '../../domain/event';
import { EventHandler } from '../../application/handler';

export interface EventBus {
  publish(events: DomainEvent[]): Promise<void>;
  subscribe(): Promise<void>;
  register<E extends DomainEvent>(
    eventClass: { TYPE: string; fromJSON: (data: any) => E },
    handler: EventHandler<E>
  ): void;
}
