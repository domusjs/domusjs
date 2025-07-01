import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';

import { InMemoryQueryBus } from '../../../src/bus/query-bus/in-memory-query-bus';

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    resolve: vi.fn(),
  },
}));

// Mock core interfaces
vi.mock('@domusjs/core', () => ({
  QueryBus: vi.fn(),
  Query: vi.fn(),
  QueryHandler: vi.fn(),
}));

describe('InMemoryQueryBus', () => {
  let queryBus: InMemoryQueryBus;
  const mockContainerResolve = vi.mocked(container.resolve);

  beforeEach(() => {
    vi.clearAllMocks();
    queryBus = new InMemoryQueryBus();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a query handler successfully', () => {
      const mockHandler = { execute: vi.fn() };
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockQueryClass = { TYPE: 'test-query' };

      mockContainerResolve.mockReturnValue(mockHandler);

      queryBus.register(mockQueryClass, mockHandlerClass);

      expect(mockContainerResolve).toHaveBeenCalledWith(mockHandlerClass);
      expect((queryBus as any).handlers.get('test-query')).toBe(mockHandler);
    });

    it('should override existing handler when registering same query type', () => {
      const mockHandler1 = { execute: vi.fn() };
      const mockHandler2 = { execute: vi.fn() };
      const mockHandlerClass1 = vi.fn(() => mockHandler1);
      const mockHandlerClass2 = vi.fn(() => mockHandler2);
      const mockQueryClass = { TYPE: 'same-query' };

      mockContainerResolve.mockReturnValueOnce(mockHandler1).mockReturnValueOnce(mockHandler2);

      queryBus.register(mockQueryClass, mockHandlerClass1);
      queryBus.register(mockQueryClass, mockHandlerClass2);

      expect((queryBus as any).handlers.get('same-query')).toBe(mockHandler2);
      expect((queryBus as any).handlers.size).toBe(1);
    });
  });

  describe('ask', () => {
    it('should ask a registered query handler', async () => {
      const mockHandler = { execute: vi.fn().mockResolvedValue('result') };
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockQueryClass = { TYPE: 'test-query' };
      const mockQuery = { type: 'test-query', data: { test: 'data' } };

      mockContainerResolve.mockReturnValue(mockHandler);
      queryBus.register(mockQueryClass, mockHandlerClass);

      const result = await queryBus.ask(mockQuery);
      expect(mockHandler.execute).toHaveBeenCalledWith(mockQuery);
      expect(result).toBe('result');
    });

    it('should throw error when handler not found', async () => {
      const mockQuery = { type: 'unregistered-query', data: { test: 'data' } };
      await expect(queryBus.ask(mockQuery)).rejects.toThrow(
        'Query handler not found for type "unregistered-query". Did you forget to register it?'
      );
    });

    it('should handle handler execution errors', async () => {
      const mockHandler = {
        execute: vi.fn().mockRejectedValue(new Error('Handler execution failed')),
      };
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockQueryClass = { TYPE: 'test-query' };
      const mockQuery = { type: 'test-query', data: { test: 'data' } };

      mockContainerResolve.mockReturnValue(mockHandler);
      queryBus.register(mockQueryClass, mockHandlerClass);

      await expect(queryBus.ask(mockQuery)).rejects.toThrow('Handler execution failed');
    });
  });

  describe('integration', () => {
    it('should handle complete query lifecycle', async () => {
      const mockHandler = { execute: vi.fn().mockResolvedValue('success') };
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockQueryClass = { TYPE: 'find-user' };
      const mockQuery = { type: 'find-user', data: { id: 1 } };

      mockContainerResolve.mockReturnValue(mockHandler);
      queryBus.register(mockQueryClass, mockHandlerClass);

      expect((queryBus as any).handlers.get('find-user')).toBe(mockHandler);

      const result = await queryBus.ask(mockQuery);
      expect(mockHandler.execute).toHaveBeenCalledWith(mockQuery);
      expect(result).toBe('success');
    });
  });
});
