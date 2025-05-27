import { DomainEvent, EventBus, EventHandler } from '@domusjs/core';

export class InMemoryEventBus implements EventBus {
  private readonly handlers = new Map<string, EventHandler[]>();

  publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers.get(event.type) || [];

      for (const handler of handlers) {
        handler.handle(event); // Could be either sync or async, so no need to await
      }
    }

    return Promise.resolve();
  }

  register<E extends DomainEvent>(eventClass: { TYPE: string }, handler: EventHandler<E>): void {
    const current = this.handlers.get(eventClass.TYPE) ?? [];
    this.handlers.set(eventClass.TYPE, [...current, handler]);
  }

  async subscribe(): Promise<void> {
    // No-op: in-memory buses don't need to subscribe
  }

  getHandlers(): Map<string, EventHandler[]> {
    return this.handlers;
  }
}
