import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import pino from 'pino';

import { PinoLogger } from '../../src/logger/pino-logger';

// Mock pino
vi.mock('pino', () => ({
  default: vi.fn(() => ({
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  })),
}));

describe('PinoLogger', () => {
  let logger: PinoLogger;
  let mockPinoInstance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    logger = new PinoLogger();
    mockPinoInstance = (pino as any).mock.results[0].value;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create pino logger with correct configuration', () => {
      expect(pino).toHaveBeenCalledWith({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      });
    });
  });

  describe('info', () => {
    it('should log info message without metadata', () => {
      const message = 'Test info message';

      logger.info(message);

      expect(mockPinoInstance.info).toHaveBeenCalledWith({}, message);
    });

    it('should log info message with metadata', () => {
      const message = 'Test info message';
      const meta = { userId: '123', action: 'login' };

      logger.info(message, meta);

      expect(mockPinoInstance.info).toHaveBeenCalledWith(meta, message);
    });

    it('should handle empty metadata object', () => {
      const message = 'Test info message';
      const meta = {};

      logger.info(message, meta);

      expect(mockPinoInstance.info).toHaveBeenCalledWith(meta, message);
    });
  });

  describe('error', () => {
    it('should log error message without metadata', () => {
      const message = 'Test error message';

      logger.error(message);

      expect(mockPinoInstance.error).toHaveBeenCalledWith({}, message);
    });

    it('should log error message with metadata', () => {
      const message = 'Test error message';
      const meta = { errorCode: 'E001', stack: 'Error stack' };

      logger.error(message, meta);

      expect(mockPinoInstance.error).toHaveBeenCalledWith(meta, message);
    });

    it('should handle error with additional context', () => {
      const message = 'Database connection failed';
      const meta = {
        errorCode: 'DB_CONNECTION_ERROR',
        host: 'localhost',
        port: 5432,
        retryCount: 3,
      };

      logger.error(message, meta);

      expect(mockPinoInstance.error).toHaveBeenCalledWith(meta, message);
    });
  });

  describe('warn', () => {
    it('should log warning message without metadata', () => {
      const message = 'Test warning message';

      logger.warn(message);

      expect(mockPinoInstance.warn).toHaveBeenCalledWith({}, message);
    });

    it('should log warning message with metadata', () => {
      const message = 'Test warning message';
      const meta = { warningType: 'deprecation', version: '1.0.0' };

      logger.warn(message, meta);

      expect(mockPinoInstance.warn).toHaveBeenCalledWith(meta, message);
    });

    it('should handle warning with context', () => {
      const message = 'API rate limit approaching';
      const meta = {
        currentUsage: 950,
        limit: 1000,
        resetTime: '2024-01-01T00:00:00Z',
      };

      logger.warn(message, meta);

      expect(mockPinoInstance.warn).toHaveBeenCalledWith(meta, message);
    });
  });

  describe('debug', () => {
    it('should log debug message without metadata', () => {
      const message = 'Test debug message';

      logger.debug(message);

      expect(mockPinoInstance.debug).toHaveBeenCalledWith({}, message);
    });

    it('should log debug message with metadata', () => {
      const message = 'Test debug message';
      const meta = { debugLevel: 'verbose', component: 'auth' };

      logger.debug(message, meta);

      expect(mockPinoInstance.debug).toHaveBeenCalledWith(meta, message);
    });

    it('should handle debug with detailed context', () => {
      const message = 'Processing user request';
      const meta = {
        requestId: 'req-123',
        method: 'POST',
        path: '/api/users',
        duration: 150,
        memoryUsage: '45MB',
      };

      logger.debug(message, meta);

      expect(mockPinoInstance.debug).toHaveBeenCalledWith(meta, message);
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple log levels in sequence', () => {
      logger.debug('Debug message', { step: 1 });
      logger.info('Info message', { step: 2 });
      logger.warn('Warning message', { step: 3 });
      logger.error('Error message', { step: 4 });

      expect(mockPinoInstance.debug).toHaveBeenCalledWith({ step: 1 }, 'Debug message');
      expect(mockPinoInstance.info).toHaveBeenCalledWith({ step: 2 }, 'Info message');
      expect(mockPinoInstance.warn).toHaveBeenCalledWith({ step: 3 }, 'Warning message');
      expect(mockPinoInstance.error).toHaveBeenCalledWith({ step: 4 }, 'Error message');
    });

    it('should handle complex metadata objects', () => {
      const complexMeta = {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          roles: ['admin', 'user'],
        },
        request: {
          method: 'POST',
          url: '/api/data',
          headers: {
            'content-type': 'application/json',
            authorization: 'Bearer token',
          },
        },
        performance: {
          startTime: Date.now(),
          duration: 125,
          memoryUsage: process.memoryUsage(),
        },
      };

      logger.info('Complex request processed', complexMeta);

      expect(mockPinoInstance.info).toHaveBeenCalledWith(complexMeta, 'Complex request processed');
    });

    it('should handle null and undefined metadata gracefully', () => {
      logger.info('Message with null meta', null as any);
      logger.error('Message with undefined meta', undefined as any);

      expect(mockPinoInstance.info).toHaveBeenCalledWith({}, 'Message with null meta');
      expect(mockPinoInstance.error).toHaveBeenCalledWith({}, 'Message with undefined meta');
    });
  });
});
