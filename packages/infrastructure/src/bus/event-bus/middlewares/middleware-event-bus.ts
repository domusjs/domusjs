import { DomainEvent, EventBus, EventHandler } from '@domusjs/core';

export type EventMiddleware<E extends DomainEvent = DomainEvent> = (
  event: E,
  next: () => Promise<void>
) => Promise<void>;

export class MiddlewareEventBus implements EventBus {
  private middlewares: EventMiddleware[] = [];

  constructor(
    private readonly base: EventBus,
    private readonly handlerRegistry: Map<string, EventHandler[]>
  ) {}

  use(middleware: EventMiddleware): void {
    this.middlewares.push(middleware);
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlerRegistry.get(event.type) || [];

      for (const handler of handlers) {
        const composed = this.middlewares
          .slice()
          .reverse()
          .reduce<() => Promise<void>>(
            (next, middleware) => () => middleware(event, next),
            () => handler.handle(event)
          );

        await composed();
      }
    }
  }

  async subscribe(): Promise<void> {
    await this.base.subscribe();
  }
}
