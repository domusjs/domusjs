import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';

import { registerDomusCore, DomusOverrides } from '../../src/config/dependency-injection';
import { InMemoryCommandBus } from '../../src/bus/command-bus/in-memory-command-bus';
import { InMemoryQueryBus } from '../../src/bus/query-bus/in-memory-query-bus';
import { InMemoryEventBus } from '../../src/bus/event-bus/in-memory-event-bus';
import { PinoLogger } from '../../src/logger/pino-logger';

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    register: vi.fn(),
  },
}));

// Mock core interfaces
vi.mock('@domusjs/core', () => ({
  CommandBus: vi.fn(),
  QueryBus: vi.fn(),
  EventBus: vi.fn(),
  Logger: vi.fn(),
}));

// Mock bus implementations
vi.mock('../../src/bus/command-bus/in-memory-command-bus', () => ({
  InMemoryCommandBus: vi.fn(),
}));

vi.mock('../../src/bus/query-bus/in-memory-query-bus', () => ({
  InMemoryQueryBus: vi.fn(),
}));

vi.mock('../../src/bus/event-bus/in-memory-event-bus', () => ({
  InMemoryEventBus: vi.fn(),
}));

// Mock logger implementation
vi.mock('../../src/logger/pino-logger', () => ({
  PinoLogger: vi.fn(),
}));

describe('registerDomusCore', () => {
  const mockContainerRegister = vi.mocked(container.register);
  const mockInMemoryCommandBus = vi.mocked(InMemoryCommandBus);
  const mockInMemoryQueryBus = vi.mocked(InMemoryQueryBus);
  const mockInMemoryEventBus = vi.mocked(InMemoryEventBus);
  const mockPinoLogger = vi.mocked(PinoLogger);

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock instances
    const mockCommandBusInstance = {};
    const mockQueryBusInstance = {};
    const mockEventBusInstance = {};
    const mockLoggerInstance = {};

    mockInMemoryCommandBus.mockImplementation(() => mockCommandBusInstance as any);
    mockInMemoryQueryBus.mockImplementation(() => mockQueryBusInstance as any);
    mockInMemoryEventBus.mockImplementation(() => mockEventBusInstance as any);
    mockPinoLogger.mockImplementation(() => mockLoggerInstance as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('default registration', () => {
    it('should register all core services with default implementations', () => {
      registerDomusCore();

      expect(mockContainerRegister).toHaveBeenCalledTimes(4);

      // Check CommandBus registration
      expect(mockContainerRegister).toHaveBeenCalledWith('CommandBus', {
        useValue: expect.any(Object),
      });

      // Check QueryBus registration
      expect(mockContainerRegister).toHaveBeenCalledWith('QueryBus', {
        useValue: expect.any(Object),
      });

      // Check EventBus registration
      expect(mockContainerRegister).toHaveBeenCalledWith('EventBus', {
        useValue: expect.any(Object),
      });

      // Check Logger registration
      expect(mockContainerRegister).toHaveBeenCalledWith('Logger', {
        useValue: expect.any(Object),
      });
    });

    it('should create default implementations', () => {
      registerDomusCore();

      expect(mockInMemoryCommandBus).toHaveBeenCalledTimes(1);
      expect(mockInMemoryQueryBus).toHaveBeenCalledTimes(1);
      expect(mockInMemoryEventBus).toHaveBeenCalledTimes(1);
      expect(mockPinoLogger).toHaveBeenCalledTimes(1);
    });

    it('should register services with correct tokens', () => {
      registerDomusCore();

      const calls = mockContainerRegister.mock.calls;
      const tokens = calls.map((call) => call[0]);

      expect(tokens).toContain('CommandBus');
      expect(tokens).toContain('QueryBus');
      expect(tokens).toContain('EventBus');
      expect(tokens).toContain('Logger');
    });
  });

  describe('with overrides', () => {
    it('should use provided CommandBus override', () => {
      const customCommandBus = { custom: 'command-bus' } as any;
      const overrides: DomusOverrides = {
        commandBus: customCommandBus,
      };

      registerDomusCore(overrides);

      expect(mockContainerRegister).toHaveBeenCalledWith('CommandBus', {
        useValue: customCommandBus,
      });

      // Should not create default implementation
      expect(mockInMemoryCommandBus).not.toHaveBeenCalled();
    });

    it('should use provided QueryBus override', () => {
      const customQueryBus = { custom: 'query-bus' } as any;
      const overrides: DomusOverrides = {
        queryBus: customQueryBus,
      };

      registerDomusCore(overrides);

      expect(mockContainerRegister).toHaveBeenCalledWith('QueryBus', {
        useValue: customQueryBus,
      });

      // Should not create default implementation
      expect(mockInMemoryQueryBus).not.toHaveBeenCalled();
    });

    it('should use provided EventBus override', () => {
      const customEventBus = { custom: 'event-bus' } as any;
      const overrides: DomusOverrides = {
        eventBus: customEventBus,
      };

      registerDomusCore(overrides);

      expect(mockContainerRegister).toHaveBeenCalledWith('EventBus', {
        useValue: customEventBus,
      });

      // Should not create default implementation
      expect(mockInMemoryEventBus).not.toHaveBeenCalled();
    });

    it('should use provided Logger override', () => {
      const customLogger = { custom: 'logger' } as any;
      const overrides: DomusOverrides = {
        logger: customLogger,
      };

      registerDomusCore(overrides);

      expect(mockContainerRegister).toHaveBeenCalledWith('Logger', {
        useValue: customLogger,
      });

      // Should not create default implementation
      expect(mockPinoLogger).not.toHaveBeenCalled();
    });

    it('should handle partial overrides', () => {
      const customCommandBus = { custom: 'command-bus' } as any;
      const customLogger = { custom: 'logger' } as any;
      const overrides: DomusOverrides = {
        commandBus: customCommandBus,
        logger: customLogger,
      };

      registerDomusCore(overrides);

      // Should use overrides for provided services
      expect(mockContainerRegister).toHaveBeenCalledWith('CommandBus', {
        useValue: customCommandBus,
      });
      expect(mockContainerRegister).toHaveBeenCalledWith('Logger', {
        useValue: customLogger,
      });

      // Should create defaults for non-overridden services
      expect(mockInMemoryQueryBus).toHaveBeenCalledTimes(1);
      expect(mockInMemoryEventBus).toHaveBeenCalledTimes(1);

      // Should not create defaults for overridden services
      expect(mockInMemoryCommandBus).not.toHaveBeenCalled();
      expect(mockPinoLogger).not.toHaveBeenCalled();
    });

    it('should handle all overrides', () => {
      const customCommandBus = { custom: 'command-bus' } as any;
      const customQueryBus = { custom: 'query-bus' } as any;
      const customEventBus = { custom: 'event-bus' } as any;
      const customLogger = { custom: 'logger' } as any;

      const overrides: DomusOverrides = {
        commandBus: customCommandBus,
        queryBus: customQueryBus,
        eventBus: customEventBus,
        logger: customLogger,
      };

      registerDomusCore(overrides);

      expect(mockContainerRegister).toHaveBeenCalledWith('CommandBus', {
        useValue: customCommandBus,
      });
      expect(mockContainerRegister).toHaveBeenCalledWith('QueryBus', {
        useValue: customQueryBus,
      });
      expect(mockContainerRegister).toHaveBeenCalledWith('EventBus', {
        useValue: customEventBus,
      });
      expect(mockContainerRegister).toHaveBeenCalledWith('Logger', {
        useValue: customLogger,
      });

      // Should not create any default implementations
      expect(mockInMemoryCommandBus).not.toHaveBeenCalled();
      expect(mockInMemoryQueryBus).not.toHaveBeenCalled();
      expect(mockInMemoryEventBus).not.toHaveBeenCalled();
      expect(mockPinoLogger).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty overrides object', () => {
      registerDomusCore({});

      expect(mockContainerRegister).toHaveBeenCalledTimes(4);
      expect(mockInMemoryCommandBus).toHaveBeenCalledTimes(1);
      expect(mockInMemoryQueryBus).toHaveBeenCalledTimes(1);
      expect(mockInMemoryEventBus).toHaveBeenCalledTimes(1);
      expect(mockPinoLogger).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined overrides', () => {
      registerDomusCore(undefined);

      expect(mockContainerRegister).toHaveBeenCalledTimes(4);
      expect(mockInMemoryCommandBus).toHaveBeenCalledTimes(1);
      expect(mockInMemoryQueryBus).toHaveBeenCalledTimes(1);
      expect(mockInMemoryEventBus).toHaveBeenCalledTimes(1);
      expect(mockPinoLogger).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration', () => {
    it('should register services in correct order', () => {
      registerDomusCore();

      const calls = mockContainerRegister.mock.calls;

      // Verify all services are registered
      expect(calls).toHaveLength(4);

      // Verify tokens are registered
      const tokens = calls.map((call) => call[0]);
      expect(tokens).toEqual(['CommandBus', 'QueryBus', 'EventBus', 'Logger']);
    });

    it('should handle multiple registrations', () => {
      registerDomusCore();
      registerDomusCore();

      // Should register twice
      expect(mockContainerRegister).toHaveBeenCalledTimes(8);
      expect(mockInMemoryCommandBus).toHaveBeenCalledTimes(2);
      expect(mockInMemoryQueryBus).toHaveBeenCalledTimes(2);
      expect(mockInMemoryEventBus).toHaveBeenCalledTimes(2);
      expect(mockPinoLogger).toHaveBeenCalledTimes(2);
    });
  });
});
