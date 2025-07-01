import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';
import { registerQueryHandler } from '../../../src/bus/query-bus/query-registration';
import { QueryBus, QueryHandler } from '@domusjs/core';

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    register: vi.fn(),
  },
}));

describe('registerQueryHandler', () => {
  const mockContainerRegister = vi.mocked(container.register);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register handler in container and query bus', () => {
    const mockQueryBus = {
      register: vi.fn(),
    } as unknown as QueryBus;
    const mockQueryClass = { TYPE: 'test-query' };
    class MockHandler implements QueryHandler<any, any> {
      execute = vi.fn();
    }

    registerQueryHandler(mockQueryBus, mockQueryClass, MockHandler);

    expect(mockContainerRegister).toHaveBeenCalledWith(MockHandler, { useClass: MockHandler });
    expect(mockQueryBus.register).toHaveBeenCalledWith(mockQueryClass, MockHandler);
  });

  it('should allow multiple handler registrations', () => {
    const mockQueryBus = {
      register: vi.fn(),
    } as unknown as QueryBus;
    const mockQueryClass1 = { TYPE: 'query-1' };
    const mockQueryClass2 = { TYPE: 'query-2' };
    class Handler1 implements QueryHandler<any, any> { execute = vi.fn(); }
    class Handler2 implements QueryHandler<any, any> { execute = vi.fn(); }

    registerQueryHandler(mockQueryBus, mockQueryClass1, Handler1);
    registerQueryHandler(mockQueryBus, mockQueryClass2, Handler2);

    expect(mockContainerRegister).toHaveBeenCalledWith(Handler1, { useClass: Handler1 });
    expect(mockContainerRegister).toHaveBeenCalledWith(Handler2, { useClass: Handler2 });
    expect(mockQueryBus.register).toHaveBeenCalledWith(mockQueryClass1, Handler1);
    expect(mockQueryBus.register).toHaveBeenCalledWith(mockQueryClass2, Handler2);
  });
}); 