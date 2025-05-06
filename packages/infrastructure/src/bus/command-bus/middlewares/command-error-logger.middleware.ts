import { container } from 'tsyringe';
import { Logger } from '../../../../../core/src/logger';

import { Middleware } from './middleware-command-bus';

export const commandErrorLoggerMiddleware: Middleware = async (command, next) => {
  const logger = container.resolve<Logger>('Logger');

  try {
    await next();
  } catch (error) {
    logger.error(
      `[CommandBus] Error executing command "${command.type}": ${(error as Error).message}`
    );
    throw error;
  }
};
