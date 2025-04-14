import { DomainEvent, EventBus, EventHandler } from '@domusjs/core';
import { RabbitMQClient } from './rabbitmq-client';

export class RabbitMQEventBus implements EventBus {

    private handlers: Map<string, EventHandler[]> = new Map();

    constructor(
        private readonly client: RabbitMQClient,
        private readonly exchangeName = 'domain_events'
    ) { }

    async publish(events: DomainEvent[]): Promise<void> {
        const channel = await this.client.connect();
        await channel.assertExchange(this.exchangeName, 'topic', { durable: true });

        for (const event of events) {
            const payload = Buffer.from(JSON.stringify(event));
            channel.publish(this.exchangeName, event.type, payload);
        }
    }

    register<E extends DomainEvent>(eventType: string, handler: EventHandler<E>): void {
        const current = this.handlers.get(eventType) ?? [];
        this.handlers.set(eventType, [...current, handler]);
    }

    async subscribe(): Promise<void> {
        const channel = await this.client.connect();
        await channel.assertExchange(this.exchangeName, 'topic', { durable: true });

        const { queue } = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(queue, this.exchangeName, '#');

        channel.consume(queue, async (msg) => {
            if (!msg) return;

            const event = JSON.parse(msg.content.toString());
            const handlers = this.handlers.get(event.type) || [];

            for (const handler of handlers) {
                await handler.handle(event);
            }

            channel.ack(msg);
        });
    }
}
