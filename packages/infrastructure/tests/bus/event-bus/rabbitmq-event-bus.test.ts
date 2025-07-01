import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DomainEvent, EventHandler, Logger } from '@domusjs/core';

import { RabbitMQEventBus } from '../../../src/bus/event-bus/rabbitmq/rabbitmq-event-bus';

// Mocks
const mockChannel = {
  assertExchange: vi.fn(),
  publish: vi.fn(),
  assertQueue: vi.fn().mockResolvedValue({ queue: 'test-queue' }),
  bindQueue: vi.fn(),
  consume: vi.fn(),
  ack: vi.fn(),
};
const mockClient = {
  connect: vi.fn().mockResolvedValue(mockChannel),
};
const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
};

describe('RabbitMQEventBus', () => {
  let eventBus: RabbitMQEventBus;

  beforeEach(() => {
    vi.clearAllMocks();
    eventBus = new RabbitMQEventBus(mockClient as any, 'test-exchange', mockLogger);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register event handler and event class', () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        static fromJSON = vi.fn();
        type = TestEvent.TYPE;
        occurredAt = new Date();
      }
      const handler: EventHandler<TestEvent> = { handle: vi.fn() };
      eventBus.register(TestEvent, handler);
      // Internal state checks
      expect((eventBus as any).handlers.get('test-event')).toContain(handler);
      expect((eventBus as any).eventClasses.get('test-event')).toBe(TestEvent);
    });
    it('should allow multiple handlers for the same event type', () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        static fromJSON = vi.fn();
        type = TestEvent.TYPE;
        occurredAt = new Date();
      }
      const handler1: EventHandler<TestEvent> = { handle: vi.fn() };
      const handler2: EventHandler<TestEvent> = { handle: vi.fn() };
      eventBus.register(TestEvent, handler1);
      eventBus.register(TestEvent, handler2);
      expect((eventBus as any).handlers.get('test-event')).toEqual([handler1, handler2]);
    });
  });

  describe('publish', () => {
    it('should publish events to the exchange', async () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        static fromJSON = vi.fn();
        type = TestEvent.TYPE;
        occurredAt = new Date();
        constructor(public readonly payload: string) {}
      }
      const event = new TestEvent('payload');
      await eventBus.publish([event]);
      expect(mockClient.connect).toHaveBeenCalled();
      expect(mockChannel.assertExchange).toHaveBeenCalledWith('test-exchange', 'topic', {
        durable: true,
      });
      expect(mockChannel.publish).toHaveBeenCalledWith(
        'test-exchange',
        'test-event',
        Buffer.from(JSON.stringify(event))
      );
    });
  });

  describe('subscribe', () => {
    it('should set up queue and consume messages', async () => {
      // Simulate channel.consume calling the callback with a message
      const fakeMsg = {
        content: Buffer.from(JSON.stringify({ type: 'test-event', foo: 'bar' })),
      };
      let consumeCallback: any;
      mockChannel.consume.mockImplementation((_queue, cb) => {
        consumeCallback = cb;
      });
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        static fromJSON = vi
          .fn()
          .mockReturnValue({ type: 'test-event', occurredAt: new Date(), foo: 'bar' });
        type = TestEvent.TYPE;
        occurredAt = new Date();
        foo = 'bar';
      }
      const handler: EventHandler<TestEvent> = { handle: vi.fn().mockResolvedValue(undefined) };
      eventBus.register(TestEvent, handler);
      await eventBus.subscribe();
      // Simulate message received
      await consumeCallback(fakeMsg);
      expect(TestEvent.fromJSON).toHaveBeenCalledWith({ type: 'test-event', foo: 'bar' });
      expect(handler.handle).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'test-event', foo: 'bar' })
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(fakeMsg);
    });
    it('should warn if no EventClass is registered for the event type', async () => {
      const fakeMsg = {
        content: Buffer.from(JSON.stringify({ type: 'unknown-event' })),
      };
      let consumeCallback: any;
      mockChannel.consume.mockImplementation((_queue, cb) => {
        consumeCallback = cb;
      });
      await eventBus.subscribe();
      consumeCallback(fakeMsg);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'No EventClass registered for type "unknown-event"'
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(fakeMsg);
    });
    it('should warn if no handlers are registered for the event type', async () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        static fromJSON = vi.fn().mockReturnValue({ type: 'test-event', occurredAt: new Date() });
        type = TestEvent.TYPE;
        occurredAt = new Date();
      }
      eventBus.register(TestEvent, { handle: vi.fn() });
      // Remove all handlers for this event type
      (eventBus as any).handlers.set('test-event', []);
      const fakeMsg = {
        content: Buffer.from(JSON.stringify({ type: 'test-event' })),
      };
      let consumeCallback: any;
      mockChannel.consume.mockImplementation((_queue, cb) => {
        consumeCallback = cb;
      });
      await eventBus.subscribe();
      consumeCallback(fakeMsg);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'No handlers registered for event type "test-event"'
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(fakeMsg);
    });
    it('should log error and ack if handler throws', async () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        static fromJSON = vi.fn().mockReturnValue({ type: 'test-event', occurredAt: new Date() });
        type = TestEvent.TYPE;
        occurredAt = new Date();
      }
      const handler: EventHandler<TestEvent> = {
        handle: vi.fn().mockRejectedValue(new Error('fail')),
      };
      eventBus.register(TestEvent, handler);
      const fakeMsg = {
        content: Buffer.from(JSON.stringify({ type: 'test-event' })),
      };
      let consumeCallback: any;
      mockChannel.consume.mockImplementation((_queue, cb) => {
        consumeCallback = cb;
      });
      await eventBus.subscribe();
      // Simulate error in handler
      await consumeCallback(fakeMsg);
      // The error is caught and logger.error is called
      expect(mockLogger.error).toHaveBeenCalled();
      expect(mockChannel.ack).toHaveBeenCalledWith(fakeMsg);
    });
  });
});
