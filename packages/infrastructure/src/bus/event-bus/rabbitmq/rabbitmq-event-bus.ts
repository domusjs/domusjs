import { DomainEvent, EventBus, EventHandler, EventConstructor, Logger } from '@domusjs/core';
import { RabbitMQClient } from './rabbitmq-client';

export class RabbitMQEventBus implements EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();
  private eventClasses: Map<string, EventConstructor<any>> = new Map();

  constructor(
    private readonly client: RabbitMQClient,
    private readonly exchangeName = 'domain_events',
    private readonly logger: Logger
  ) {}

  register<E extends DomainEvent>(eventClass: EventConstructor<E>, handler: EventHandler<E>): void {
    const current = this.handlers.get(eventClass.TYPE) ?? [];
    this.handlers.set(eventClass.TYPE, [...current, handler]);

    if (!this.eventClasses.has(eventClass.TYPE)) {
      this.eventClasses.set(eventClass.TYPE, eventClass);
    }
  }

  async publish(events: DomainEvent[]): Promise<void> {
    const channel = await this.client.connect();
    await channel.assertExchange(this.exchangeName, 'topic', { durable: true });

    for (const event of events) {
      const payload = Buffer.from(JSON.stringify(event));
      channel.publish(this.exchangeName, event.type, payload);
    }
  }

  async subscribe(): Promise<void> {
    const channel = await this.client.connect();
    await channel.assertExchange(this.exchangeName, 'topic', { durable: true });

    const { queue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue, this.exchangeName, '#');

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const rawEvent = JSON.parse(msg.content.toString());
        const EventClass = this.eventClasses.get(rawEvent.type);

        if (!EventClass) {
          this.logger.warn(`No EventClass registered for type "${rawEvent.type}"`);
          channel.ack(msg);
          return;
        }

        const event = EventClass.fromJSON(rawEvent);
        const handlers = this.handlers.get(event.type) || [];

        if (handlers.length === 0) {
          this.logger.warn(`No handlers registered for event type "${event.type}"`);
        }

        for (const handler of handlers) {
          await handler.handle(event);
        }

        channel.ack(msg);
      } catch (error) {
        this.logger.error('Error handling event message:', error);
        channel.ack(msg);
      }
    });
  }
}
