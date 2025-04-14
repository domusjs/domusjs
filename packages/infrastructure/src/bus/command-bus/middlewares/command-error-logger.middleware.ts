import { Middleware } from './middleware-command-bus';
import { container } from 'tsyringe';
import { Logger } from '@domusjs/core';

export const commandErrorLoggerMiddleware: Middleware = async (command, next) => {
  const logger = container.resolve<Logger>('Logger');

  try {
    await next();
  } catch (error) {
    logger.error(`[CommandBus] Error executing command "${command.type}": ${(error as Error).message}`);
    throw error;
  }
};
