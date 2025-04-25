import { container } from 'tsyringe';
import { Logger } from '@domusjs/core';

import { QueryMiddleware } from './middleware-query-bus';

export const queryErrorLoggerMiddleware: QueryMiddleware = async (query, next) => {
  const logger = container.resolve<Logger>('Logger');

  try {
    return await next();
  } catch (error: any) {
    logger.error(`[QueryBus] Error executing query "${query.type}": ${(error as Error).message}`);
    throw error;
  }
};
