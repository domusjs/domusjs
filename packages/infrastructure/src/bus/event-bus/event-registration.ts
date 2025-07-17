import { container } from 'tsyringe';
import { DomainEvent } from 'packages/core/src/domain/event';

import { EventBus } from '../../../../core/src/application/bus/event-bus';
import { EventHandler } from '../../../../core/src/application/handler';

export function registerEventHandler<E extends DomainEvent>(
  eventBus: EventBus,
  eventClass: { TYPE: string; fromJSON: (data: any) => E },
  handlerClass: new (...args: any[]) => EventHandler<E>
) {
  container.register(handlerClass, { useClass: handlerClass });

  const handlerInstance = container.resolve(handlerClass);

  eventBus.register(eventClass, handlerInstance);
}
