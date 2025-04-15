import pino from 'pino';
import { Logger } from '@domusjs/core';

export class PinoLogger implements Logger {
  private readonly logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
    },
  });

  info(message: string, meta?: Record<string, any>): void {
    this.logger.info(meta ?? {}, message);
  }

  error(message: string, meta?: Record<string, any>): void {
    this.logger.error(meta ?? {}, message);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.logger.warn(meta ?? {}, message);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.logger.debug(meta ?? {}, message);
  }
}
