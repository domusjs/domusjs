import { container } from 'tsyringe';
import { DomainEvent, EventBus, EventHandler } from '@domusjs/core';

export function registerEventHandler<E extends DomainEvent>(
  eventBus: EventBus,
  eventClass: { TYPE: string; fromJSON: (data: any) => E },
  handlerClass: new (...args: any[]) => EventHandler<E>
) {
  container.register(handlerClass, { useClass: handlerClass });

  const handlerInstance = container.resolve(handlerClass);

  eventBus.register(eventClass, handlerInstance);
}
