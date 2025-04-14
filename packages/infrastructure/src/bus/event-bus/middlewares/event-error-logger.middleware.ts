import { EventMiddleware } from './middleware-event-bus';
import { container } from 'tsyringe';
import { Logger } from '@domusjs/core';

export const eventErrorLoggerMiddleware: EventMiddleware = async (event, next) => {
    
  const logger = container.resolve<Logger>('Logger');

  try {
    await next();
  } catch (error) {
    logger.error(`[EventBus] Error in event "${event.type}": ${(error as Error).message}`);
    throw error;
  }
};
