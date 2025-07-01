import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DomainEvent, EventHandler } from '@domusjs/core';

import { InMemoryEventBus } from '../../../src/bus/event-bus/in-memory-event-bus';

describe('InMemoryEventBus', () => {
  let eventBus: InMemoryEventBus;

  beforeEach(() => {
    eventBus = new InMemoryEventBus();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register an event handler for an event type', () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        type = TestEvent.TYPE;
        occurredAt = new Date();
      }
      const handler: EventHandler = { handle: vi.fn() };

      eventBus.register(TestEvent, handler);

      const handlers = eventBus.getHandlers().get('test-event');
      expect(handlers).toBeDefined();
      expect(handlers).toContain(handler);
    });

    it('should allow multiple handlers for the same event type', () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        type = TestEvent.TYPE;
        occurredAt = new Date();
      }
      const handler1: EventHandler = { handle: vi.fn() };
      const handler2: EventHandler = { handle: vi.fn() };

      eventBus.register(TestEvent, handler1);
      eventBus.register(TestEvent, handler2);

      const handlers = eventBus.getHandlers().get('test-event');
      expect(handlers).toHaveLength(2);
      expect(handlers).toContain(handler1);
      expect(handlers).toContain(handler2);
    });
  });

  describe('publish', () => {
    it('should call all handlers for published events', async () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        type = TestEvent.TYPE;
        occurredAt = new Date();
      }
      const handler1: EventHandler<TestEvent> = { handle: vi.fn() };
      const handler2: EventHandler<TestEvent> = { handle: vi.fn() };
      eventBus.register(TestEvent, handler1);
      eventBus.register(TestEvent, handler2);

      const event = new TestEvent();
      await eventBus.publish([event]);

      expect(handler1.handle).toHaveBeenCalledWith(event);
      expect(handler2.handle).toHaveBeenCalledWith(event);
    });

    it('should not fail if no handlers are registered for an event', async () => {
      class TestEvent implements DomainEvent {
        static TYPE = 'test-event';
        type = TestEvent.TYPE;
        occurredAt = new Date();
      }
      const event = new TestEvent();
      await expect(eventBus.publish([event])).resolves.not.toThrow();
    });

    it('should call handlers for multiple event types', async () => {
      class EventA implements DomainEvent {
        static TYPE = 'event-a';
        type = EventA.TYPE;
        occurredAt = new Date();
      }
      class EventB implements DomainEvent {
        static TYPE = 'event-b';
        type = EventB.TYPE;
        occurredAt = new Date();
      }
      const handlerA: EventHandler<EventA> = { handle: vi.fn() };
      const handlerB: EventHandler<EventB> = { handle: vi.fn() };
      eventBus.register(EventA, handlerA);
      eventBus.register(EventB, handlerB);

      const eventA = new EventA();
      const eventB = new EventB();
      await eventBus.publish([eventA, eventB]);

      expect(handlerA.handle).toHaveBeenCalledWith(eventA);
      expect(handlerB.handle).toHaveBeenCalledWith(eventB);
    });
  });

  describe('getHandlers', () => {
    it('should return the handlers map', () => {
      expect(eventBus.getHandlers()).toBeInstanceOf(Map);
    });
  });

  describe('subscribe', () => {
    it('should resolve without error (no-op)', async () => {
      await expect(eventBus.subscribe()).resolves.not.toThrow();
    });
  });

  describe('integration', () => {
    it('should handle event lifecycle with multiple handlers and event types', async () => {
      class UserCreated implements DomainEvent {
        static TYPE = 'user-created';
        type = UserCreated.TYPE;
        occurredAt = new Date();
        constructor(public readonly userId: string) {}
      }
      class UserDeleted implements DomainEvent {
        static TYPE = 'user-deleted';
        type = UserDeleted.TYPE;
        occurredAt = new Date();
        constructor(public readonly userId: string) {}
      }
      const createdHandler: EventHandler<UserCreated> = { handle: vi.fn() };
      const deletedHandler: EventHandler<UserDeleted> = { handle: vi.fn() };
      eventBus.register(UserCreated, createdHandler);
      eventBus.register(UserDeleted, deletedHandler);

      const createdEvent = new UserCreated('abc');
      const deletedEvent = new UserDeleted('abc');
      await eventBus.publish([createdEvent, deletedEvent]);

      expect(createdHandler.handle).toHaveBeenCalledWith(createdEvent);
      expect(deletedHandler.handle).toHaveBeenCalledWith(deletedEvent);
    });
  });
});
