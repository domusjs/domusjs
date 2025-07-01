import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { container } from 'tsyringe';
import { InMemoryCommandBus } from '../../../src/bus/command-bus/in-memory-command-bus';
import { CommandBus } from '@domusjs/core';
import { Command } from '@domusjs/core';
import { CommandHandler } from '@domusjs/core';

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    resolve: vi.fn(),
  },
}));

// Mock core interfaces
vi.mock('@domusjs/core', () => ({
  CommandBus: vi.fn(),
  Command: vi.fn(),
  CommandHandler: vi.fn(),
}));

describe('InMemoryCommandBus', () => {
  let commandBus: InMemoryCommandBus;
  const mockContainerResolve = vi.mocked(container.resolve);

  beforeEach(() => {
    vi.clearAllMocks();
    commandBus = new InMemoryCommandBus();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a command handler successfully', () => {
      const mockHandler = {
        execute: vi.fn(),
      };
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockCommandClass = { TYPE: 'test-command' };

      mockContainerResolve.mockReturnValue(mockHandler);

      commandBus.register(mockCommandClass, mockHandlerClass);

      expect(mockContainerResolve).toHaveBeenCalledWith(mockHandlerClass);
      expect((commandBus as any).handlers.get('test-command')).toBe(mockHandler);
    });

    it('should register multiple command handlers', () => {
      const mockHandler1 = { execute: vi.fn() };
      const mockHandler2 = { execute: vi.fn() };
      const mockHandlerClass1 = vi.fn(() => mockHandler1);
      const mockHandlerClass2 = vi.fn(() => mockHandler2);
      const mockCommandClass1 = { TYPE: 'command-1' };
      const mockCommandClass2 = { TYPE: 'command-2' };

      mockContainerResolve
        .mockReturnValueOnce(mockHandler1)
        .mockReturnValueOnce(mockHandler2);

      commandBus.register(mockCommandClass1, mockHandlerClass1);
      commandBus.register(mockCommandClass2, mockHandlerClass2);

      expect((commandBus as any).handlers.get('command-1')).toBe(mockHandler1);
      expect((commandBus as any).handlers.get('command-2')).toBe(mockHandler2);
      expect((commandBus as any).handlers.size).toBe(2);
    });

    it('should override existing handler when registering same command type', () => {
      const mockHandler1 = { execute: vi.fn() };
      const mockHandler2 = { execute: vi.fn() };
      const mockHandlerClass1 = vi.fn(() => mockHandler1);
      const mockHandlerClass2 = vi.fn(() => mockHandler2);
      const mockCommandClass = { TYPE: 'same-command' };

      mockContainerResolve
        .mockReturnValueOnce(mockHandler1)
        .mockReturnValueOnce(mockHandler2);

      commandBus.register(mockCommandClass, mockHandlerClass1);
      commandBus.register(mockCommandClass, mockHandlerClass2);

      expect((commandBus as any).handlers.get('same-command')).toBe(mockHandler2);
      expect((commandBus as any).handlers.size).toBe(1);
    });

    it('should handle container resolution errors', () => {
      const mockHandlerClass = vi.fn();
      const mockCommandClass = { TYPE: 'test-command' };
      const error = new Error('Container resolution failed');

      mockContainerResolve.mockImplementation(() => {
        throw error;
      });

      expect(() => commandBus.register(mockCommandClass, mockHandlerClass)).toThrow('Container resolution failed');
    });
  });

  describe('dispatch', () => {
    it('should dispatch command to registered handler', async () => {
      const mockHandler = {
        execute: vi.fn().mockResolvedValue('result'),
      };
      const mockCommand = {
        type: 'test-command',
        data: { test: 'data' },
      };

      // Register handler
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockCommandClass = { TYPE: 'test-command' };
      mockContainerResolve.mockReturnValue(mockHandler);
      commandBus.register(mockCommandClass, mockHandlerClass);

      // Dispatch command
      const result = await commandBus.dispatch(mockCommand);

      expect(mockHandler.execute).toHaveBeenCalledWith(mockCommand);
      expect(result).toBe('result');
    });

    it('should throw error when handler not found', async () => {
      const mockCommand = {
        type: 'unregistered-command',
        data: { test: 'data' },
      };

      await expect(commandBus.dispatch(mockCommand)).rejects.toThrow(
        'Command handler not found for type "unregistered-command"'
      );
    });

    it('should handle handler execution errors', async () => {
      const mockHandler = {
        execute: vi.fn().mockRejectedValue(new Error('Handler execution failed')),
      };
      const mockCommand = {
        type: 'test-command',
        data: { test: 'data' },
      };

      // Register handler
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockCommandClass = { TYPE: 'test-command' };
      mockContainerResolve.mockReturnValue(mockHandler);
      commandBus.register(mockCommandClass, mockHandlerClass);

      // Dispatch command
      await expect(commandBus.dispatch(mockCommand)).rejects.toThrow('Handler execution failed');
    });

    it('should dispatch multiple commands to different handlers', async () => {
      const mockHandler1 = {
        execute: vi.fn().mockResolvedValue('result1'),
      };
      const mockHandler2 = {
        execute: vi.fn().mockResolvedValue('result2'),
      };

      const mockCommand1 = { type: 'command-1', data: { test: 'data1' } };
      const mockCommand2 = { type: 'command-2', data: { test: 'data2' } };

      // Register handlers
      const mockHandlerClass1 = vi.fn(() => mockHandler1);
      const mockHandlerClass2 = vi.fn(() => mockHandler2);
      const mockCommandClass1 = { TYPE: 'command-1' };
      const mockCommandClass2 = { TYPE: 'command-2' };

      mockContainerResolve
        .mockReturnValueOnce(mockHandler1)
        .mockReturnValueOnce(mockHandler2);

      commandBus.register(mockCommandClass1, mockHandlerClass1);
      commandBus.register(mockCommandClass2, mockHandlerClass2);

      // Dispatch commands
      const result1 = await commandBus.dispatch(mockCommand1);
      const result2 = await commandBus.dispatch(mockCommand2);

      expect(mockHandler1.execute).toHaveBeenCalledWith(mockCommand1);
      expect(mockHandler2.execute).toHaveBeenCalledWith(mockCommand2);
      expect(result1).toBe('result1');
      expect(result2).toBe('result2');
    });

    it('should handle void return type', async () => {
      const mockHandler = {
        execute: vi.fn().mockResolvedValue(undefined),
      };
      const mockCommand = {
        type: 'test-command',
        data: { test: 'data' },
      };

      // Register handler
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockCommandClass = { TYPE: 'test-command' };
      mockContainerResolve.mockReturnValue(mockHandler);
      commandBus.register(mockCommandClass, mockHandlerClass);

      // Dispatch command
      const result = await commandBus.dispatch(mockCommand);

      expect(mockHandler.execute).toHaveBeenCalledWith(mockCommand);
      expect(result).toBeUndefined();
    });
  });

  describe('integration', () => {
    it('should handle complete command lifecycle', async () => {
      const mockHandler = {
        execute: vi.fn().mockResolvedValue('success'),
      };
      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockCommandClass = { TYPE: 'create-user' };
      const mockCommand = {
        type: 'create-user',
        data: { name: 'John', email: 'john@example.com' },
      };

      mockContainerResolve.mockReturnValue(mockHandler);

      // Register handler
      commandBus.register(mockCommandClass, mockHandlerClass);

      // Verify handler is registered
      expect((commandBus as any).handlers.get('create-user')).toBe(mockHandler);

      // Dispatch command
      const result = await commandBus.dispatch(mockCommand);

      expect(mockHandler.execute).toHaveBeenCalledWith(mockCommand);
      expect(result).toBe('success');
    });

    it('should handle concurrent command dispatches', async () => {
      const mockHandler = {
        execute: vi.fn().mockImplementation(async (command) => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return `processed-${command.data.id}`;
        }),
      };

      const mockHandlerClass = vi.fn(() => mockHandler);
      const mockCommandClass = { TYPE: 'process-item' };

      mockContainerResolve.mockReturnValue(mockHandler);
      commandBus.register(mockCommandClass, mockHandlerClass);

      const commands = [
        { type: 'process-item', data: { id: 1 } },
        { type: 'process-item', data: { id: 2 } },
        { type: 'process-item', data: { id: 3 } },
      ];

      const results = await Promise.all(
        commands.map(command => commandBus.dispatch(command))
      );

      expect(results).toEqual(['processed-1', 'processed-2', 'processed-3']);
      expect(mockHandler.execute).toHaveBeenCalledTimes(3);
    });
  });
}); 